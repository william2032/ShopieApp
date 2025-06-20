import { Product } from './product.interface';

export class ProductListResponseDto {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export class ProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  stock: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export class SearchResponseDto {
  message?: string;
  products?: Product[];
  total?: number;
  totalPages?: number;
}

export class ErrorResponseDto {
  statusCode: number;
  message: string;
  error?: string;
}
