import { Module } from '@nestjs/common';
import { CartService } from './carts.service';
import { CartsController } from './carts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [PrismaModule, ProductsModule],
  controllers: [CartsController],
  providers: [CartService],
  exports: [CartService],
})
export class CartsModule {}
