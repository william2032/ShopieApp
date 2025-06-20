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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto, ProductResponseDto } from './interfaces';

interface RawQueryParams {
  q?: string;

  [key: string]: string | undefined;
}

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Create a new product
   * POST /products
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Create a new product',
    description:
      'Create a new product in the catalog. Only admin users can create products.',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiCreatedResponse({
    description: 'Product created successfully',
    type: ProductResponseDto,
    example: {
      id: 'prod-123',
      name: 'MacBook Pro 14"',
      description: 'Apple MacBook Pro with M2 chip',
      price: 1999.99,
      image: 'https://example.com/macbook.jpg',
      stock: 10,
      createdBy: 'user-456',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid product data',
    type: ErrorResponseDto,
    example: {
      statusCode: 400,
      message: ['price must be a positive number', 'name should not be empty'],
      error: 'Bad Request',
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
    type: ErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Admin access required',
    type: ErrorResponseDto,
    example: {
      statusCode: 403,
      message: 'Insufficient permissions',
      error: 'Forbidden',
    },
  })
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
  @ApiOperation({
    summary: 'Get all products',
    description:
      'Retrieve all products with optional filtering, sorting Public endpoint.',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'Minimum price filter',
    example: 100,
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'Maximum price filter',
    example: 2000,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Sort by field (name, price, createdAt)',
    example: 'price',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
    example: 'asc',
  })
  async findAll(@Query() query: ProductQueryDto) {
    return this.productService.findAll(query);
  }

  /**
   * Search products (Public)
   * GET /products/search?q=laptop
   */
  @Get('search')
  @ApiOperation({
    summary: 'Search products',
    description:
      'Search for products by name or description using a query string. Public endpoint.',
  })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    description: 'Search query string',
    example: 'laptop',
  })
  @ApiBadRequestResponse({
    description: 'Invalid search parameters',
    type: ErrorResponseDto,
  })
  async search(
    @Query() rawQuery: RawQueryParams,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: ProductQueryDto,
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
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieve a specific product by its ID. Public endpoint.',
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: ErrorResponseDto,
    example: {
      statusCode: 404,
      message: 'Product not found',
      error: 'Not Found',
    },
  })
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
  @ApiOperation({
    summary: 'Update a product',
    description:
      'Update product information. Only admin users can update products, and they can only update products they created.',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid update data',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
    type: ErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Admin access required or not product owner',
    type: ErrorResponseDto,
    example: {
      statusCode: 403,
      message: 'You can only update products you created',
      error: 'Forbidden',
    },
  })
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
  @ApiOperation({
    summary: 'Delete a product',
    description:
      'Delete a product from the catalog. Only admin users can delete products, and they can only delete products they created.',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiNoContentResponse({
    description: 'Product deleted successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
    type: ErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Admin access required or not product owner',
    type: ErrorResponseDto,
    example: {
      statusCode: 403,
      message: 'You can only delete products you created',
      error: 'Forbidden',
    },
  })
  async remove(@Param('id') id: string, @Request() req) {
    await this.productService.remove(id, req.user.id);
  }
}
