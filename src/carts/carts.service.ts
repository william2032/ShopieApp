import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Cart } from './interfaces/cart.interface';
import { PrismaService } from '../prisma/prisma.service';
import { ProductService } from '../products/products.service';
import { AddToCartDto } from './dtos/add-cart.dto';
import { Product } from '../products/interfaces/product.interface';
import { CartItem } from '../../generated/prisma';
import { UpdateCartItemDto } from './dtos/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private productService: ProductService,
  ) {}

  /**
   * Get or create user's cart
   */
  async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
                availableStock: true,
              },
            },
          },
        },
      },
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  image: true,
                  availableStock: true,
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  /**
   * Add product to cart or update quantity if already exists
   */
  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;

    // Get or create cart
    const cart: Cart = await this.getOrCreateCart(userId);

    // Check if product exists and has sufficient stock
    const product: Product = await this.productService.findOne(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      // Update existing item quantity
      const newQuantity: number = existingItem.quantity + quantity;

      // Check stock availability for the new total quantity
      const canReserve = await this.productService.checkAvailability(
        productId,
        quantity,
      );
      if (!canReserve) {
        throw new BadRequestException('Insufficient stock available');
      }

      // Reserve additional stock
      await this.productService.reserveStock(productId, quantity);

      // Update cart item
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
              availableStock: true,
            },
          },
        },
      });
    } else {
      // Add new item to cart
      const canReserve = await this.productService.checkAvailability(
        productId,
        quantity,
      );
      if (!canReserve) {
        throw new BadRequestException('Insufficient stock available');
      }

      // Reserve stock
      await this.productService.reserveStock(productId, quantity);

      // Create new cart item
      return this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
              availableStock: true,
            },
          },
        },
      });
    }
  }

  /**
   * Get user's cart with items and summary
   */
  async getCart(
    userId: string,
  ): Promise<{ totalItems: number; totalPrice: number; items: CartItem[] }> {
    const cart = await this.getOrCreateCart(userId);

    // Calculate totals
    const totalItems: number = cart.items.reduce(
      (sum, item): number => sum + item.quantity,
      0,
    );
    const totalPrice: number = cart.items
      .filter((item) => item.product) //ensure product exists
      .reduce((sum, item) => sum + item.quantity * item.product!.price, 0);

    return {
      totalItems,
      totalPrice,
      items: cart.items,
    };
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(
    userId: string,
    itemId: string,
    updateDto: UpdateCartItemDto,
  ) {
    const { quantity } = updateDto;

    // Find the cart item and verify ownership
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    const quantityDifference = quantity - cartItem.quantity;

    if (quantityDifference > 0) {
      // Increasing quantity - need to reserve more stock
      const canReserve = await this.productService.checkAvailability(
        cartItem.productId,
        quantityDifference,
      );
      if (!canReserve) {
        throw new BadRequestException('Insufficient stock available');
      }
      await this.productService.reserveStock(
        cartItem.productId,
        quantityDifference,
      );
    } else if (quantityDifference < 0) {
      // Decreasing quantity - release some stock
      await this.productService.releaseStock(
        cartItem.productId,
        Math.abs(quantityDifference),
      );
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            availableStock: true,
          },
        },
      },
    });
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(
    userId: string,
    itemId: string,
    quantity: number,
  ): Promise<void> {
    // Find the cart item and verify ownership
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }
    if (quantity > cartItem.quantity) {
      throw new BadRequestException(
        `You are trying to remove ${quantity} items, but only ${cartItem.quantity} exist in your cart.`,
      );
    }

    if (quantity === cartItem.quantity) {
      await this.productService.releaseStock(
        cartItem.productId,
        cartItem.quantity,
      );
      await this.prisma.cartItem.delete({
        where: {
          id: itemId,
        },
      });
    } else {
      // Release reserved stock
      await this.productService.releaseStock(cartItem.productId, quantity);
    }
    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });
  }

  /**
   * Clear entire cart
   */
  async clearCart(userId: string): Promise<void> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      return; // No cart to clear
    }

    // Release all reserved stock
    for (const item of cart.items) {
      await this.productService.releaseStock(item.productId, item.quantity);
    }

    // Delete all cart items
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }

  /**
   * Get cart items for checkout (used by order module)
   */
  async getCartForCheckout(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    return cart;
  }
}
