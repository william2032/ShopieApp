export class CartItemResponseDto {
  id: string;
  productId: string;
  quantity: number;
  addedAt: Date;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    availableStock: number;
  };
}

export class CartResponseDto {
  id: string;
  userId: string;
  items: CartItemResponseDto[];
  totalItems: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
