export interface Product {
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

export interface ProductSearchOptions {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}