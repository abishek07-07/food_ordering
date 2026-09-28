export interface Orders {
  id: string;
  user_id: string;
  status: orderStatus;
  total_price: number;
  created_at: Date;
  updated_at: Date;
}

export enum orderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  PARTIALLY_FULFILLED = "partially_fulfilled",
  FULFILLED = "fulfilled",
}

export interface OrderItems {
  id: number;
  order_id: number;
  cart_item_id: number;
  product_id: number;
  requested_quantity: number;
  price_at_order: number;
  status: OrderItemsStatus;
  created_at: Date;
  updated_at: Date;
}

export enum OrderItemsStatus {
  PENDING = "pending",
  PARTIALLY_ALLOCATED = "partially_allocated",
  FULFILLED = "fulfilled",
  CANCELLED = "cancelled",
}

export interface OrderItemsAllocations {
  id: number;
  order_item_id: number;
  store_id: number;
  allocated_quantity: number;
  price: number;
  status: OrderItemsAllocationsStatus;
  created_at: Date;
  updated_at: Date;
}

export enum OrderItemsAllocationsStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}
