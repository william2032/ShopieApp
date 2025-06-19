export interface Cart {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  items: CartItem[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  addedAt: Date;
  product?: {
    id: string;
    name: string;
    price: number;
    image: string;
    availableStock: number;
  };
}

export interface CartsSummary {
  totalItems: number;
  totalPrice: number;
  items: CartItemWithProduct[];
}

export interface CartItemWithProduct extends CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    availableStock: number;
  };
}
