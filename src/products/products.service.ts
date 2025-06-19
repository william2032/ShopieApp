import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Product } from './interfaces/product.interface';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductQueryDto } from './dtos/product-query.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // Create a new product (Admin only)

  async create(
    createProductDto: CreateProductDto,
    adminId: string,
  ): Promise<Product> {
    const { totalStock, ...productData } = createProductDto;

    return this.prisma.product.create({
      data: {
        ...productData,
        totalStock,
        availableStock: totalStock,
        reservedStock: 0,
        adminId,
      },
    });
  }

  /**
   * Get all products with filtering and pagination
   */
  async findAll(query: ProductQueryDto) {
    const { search, minPrice, maxPrice, sortBy, sortOrder } = query;

    // Build where clause for filtering
    const where: Prisma.ProductWhereInput = {};

    // Search in name and description
    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Price range filtering
    const min =
      minPrice !== undefined && !isNaN(minPrice) ? minPrice : undefined;
    const max =
      maxPrice !== undefined && !isNaN(maxPrice) ? maxPrice : undefined;

    if (min !== undefined || max !== undefined) {
      where.price = {};

      if (min !== undefined && !isNaN(min)) {
        where.price.gte = min;
      }

      if (max !== undefined && !isNaN(max)) {
        where.price.lte = max;
      }
    }

    // Build order by clause
    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    const validSortFields: string[] = ['name', 'price', 'createdAt'];

    if (sortBy && sortOrder && validSortFields.includes(sortBy)) {
      const normalizedSortOrder: string = sortOrder.toLowerCase();
      if (['asc', 'desc'].includes(normalizedSortOrder)) {
        orderBy[sortBy] = normalizedSortOrder as 'asc' | 'desc';
      } else {
        console.warn(`Invalid sortOrder: ${sortOrder}, defaulting to 'asc'`);
        orderBy[sortBy] = 'asc';
      }
    } else {
      // Default sorting if sortBy or sortOrder is invalid
      orderBy.createdAt = 'desc';
    }

    // Execute queries
    try {
      const products = await Promise.all([
        this.prisma.product.findMany({
          where,
          orderBy,
          include: {
            admin: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        }),
      ]);
      return { products };
    } catch (e) {
      console.error('Product query error:', e);
      throw new InternalServerErrorException(
        'Something went wrong while querying products.',
      );
    }
  }

  /**
   * Get a single product by ID
   */
  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  /**
   * Update a product (Admin only)
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    adminId: string,
  ): Promise<Product> {
    // Check if product exists and belongs to the admin
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (existingProduct.adminId !== adminId) {
      throw new BadRequestException('You can only update your own products');
    }

    // If totalStock is being updated, adjust availableStock accordingly
    const updateData = { ...updateProductDto };

    if (updateProductDto.totalStock !== undefined) {
      const stockDifference: number =
        existingProduct.availableStock - updateProductDto.totalStock;
      updateData.totalStock = existingProduct.availableStock + stockDifference;

      // Ensure availableStock doesn't go negative
      if (existingProduct.availableStock < 0) {
        throw new BadRequestException(
          'Cannot reduce total stock below reserved stock',
        );
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Delete a product (Admin only)
   */
  async remove(id: string, adminId: string): Promise<void> {
    // Check if product exists and belongs to the admin
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (existingProduct.adminId !== adminId) {
      throw new BadRequestException('You can only delete your own products');
    }

    // Check if product is in any active carts or orders
    const [cartItems, orderItems] = await Promise.all([
      this.prisma.cartItem.count({ where: { productId: id } }),
      this.prisma.orderItem.count({ where: { productId: id } }),
    ]);

    if (cartItems > 0 || orderItems > 0) {
      throw new BadRequestException(
        'Cannot delete product that is in carts or orders',
      );
    }

    await this.prisma.product.delete({
      where: { id },
    });
  }

  /**
   * Check product availability for cart operations
   */
  async checkAvailability(
    productId: string,
    quantity: number,
  ): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return product.availableStock >= quantity;
  }

  /**
   * Reserve stock when adding to cart
   */
  async reserveStock(productId: string, quantity: number): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (product.availableStock < quantity) {
      throw new BadRequestException('Insufficient stock available');
    }

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        availableStock: product.availableStock - quantity,
        reservedStock: product.reservedStock + quantity,
      },
    });
  }

  /**
   * Release reserved stock when removing from cart
   */
  async releaseStock(productId: string, quantity: number): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        availableStock: product.availableStock + quantity,
        reservedStock: Math.max(0, product.reservedStock - quantity),
      },
    });
  }
}
