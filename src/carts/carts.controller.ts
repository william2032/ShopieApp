// src/modules/cart/cart.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartService } from './carts.service';
import { AddToCartDto } from './dtos/add-cart.dto';
import { UpdateCartItemDto } from './dtos/update-cart.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard) // All cart endpoints require authentication
export class CartsController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Add product to cart
   * POST /cart
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addToCart(@Body() addToCartDto: AddToCartDto, @Request() req) {
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  /**
   * Get user's cart
   * GET /cart
   */
  @Get()
  async getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  /**
   * Update cart item quantity
   * PATCH /cart/items/:itemId
   */
  @Patch('items/:itemId')
  async updateCartItem(
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Request() req,
  ) {
    return this.cartService.updateCartItem(
      req.user.id,
      itemId,
      updateCartItemDto,
    );
  }

  /**
   * Remove item from cart
   * DELETE /cart/items/:itemId
   */
  @Delete('items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFromCart(@Param('itemId') itemId: string, @Request() req) {
    await this.cartService.removeFromCart(req.user.id, itemId);
  }

  /**
   * Clear entire cart
   * DELETE /cart
   */
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearCart(@Request() req) {
    await this.cartService.clearCart(req.user.id);
  }
}
