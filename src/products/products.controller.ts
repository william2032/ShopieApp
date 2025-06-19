// src/modules/product/product.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { $Enums } from '../../generated/prisma';
import UserRole = $Enums.UserRole;
import { CreateProductDto } from './dtos/create-product.dto';
import { Product } from './interfaces/product.interface';
import { ProductQueryDto } from './dtos/product-query.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Roles } from '../auth/decorators/role-decorator';

interface RawQueryParams {
  q?: string;
  [key: string]: string | undefined;
}
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Create a new product (Admin only)
   * POST /products
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductDto: CreateProductDto,
    @Request() req,
  ): Promise<Product> {
    return this.productService.create(createProductDto, req.user.id);
  }

  /**
   * Get all products with filtering and pagination (customers)
   */
  @Get()
  async findAll(@Query() query: ProductQueryDto) {
    return this.productService.findAll(query);
  }

  /**
   * Search products (Public)
   * GET /products/search?q=laptop
   */
  @Get('search')
  async search(
    @Query() rawQuery: RawQueryParams,
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: ProductQueryDto,
  ) {
    const searchQuery = rawQuery.q || '';
    if (!searchQuery) {
      return { message: 'No search query provided' };
    }
    const queryDto: ProductQueryDto = { ...query, search: searchQuery };
    return this.productService.findAll(queryDto);
  }

  /**
   * Get a single product by ID (Public)
   * GET /products/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  /**
   * Update a product (Admin only - can only update own products)
   * PATCH /products/:id
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req,
  ) {
    return this.productService.update(id, updateProductDto, req.user.id);
  }

  /**
   * Delete a product (Admin only - can only delete own products)
   * DELETE /products/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req) {
    await this.productService.remove(id, req.user.id);
  }
}
