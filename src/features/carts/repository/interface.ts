export interface Carts {
  id: number;
  user_id: number;
  created_at: Date;
}

export interface CartItems {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  is_deleted: boolean;
  is_order_placed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CartItemRow {
  cartItemId: number;
  quantity: number;
  productId: number;
  name: string;
  slug: string;
  description: string | Record<string, any> | null;
}

export interface CartItemWithGrocery {
  id: number;
  quantity: number;
  name: string;
  slug: string;
  description: string | Record<string, any> | null;
  picture_url: string | null;
}
