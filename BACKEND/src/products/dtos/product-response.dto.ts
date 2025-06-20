export class ProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  totalStock: number;
  availableStock: number;
  reservedStock: number;
  createdAt: Date;
  updatedAt: Date;
  adminId: string;
}

export class PaginatedProductsResponseDto {
  products: ProductResponseDto[];
  total: number;
  // page: number;
  // limit: number;
  totalPages: number;
}
