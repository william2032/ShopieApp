import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartsService {
  constructor(
    private prisma: PrismaService,
    private productService:ProductService;
  ) {
  }
}
