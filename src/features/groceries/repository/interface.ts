export interface Groceries {
  id: number;
  name: string;
  description: string | Record<string, any> | null;
  slug: string;
}

export interface StoresGroceries {
  id: number;
  store_id: number;
  product_id: number;
  quantity: number;
  price: number;
  added_by: number;
  created_at: Date;
  updated_at: Date;
}

// table name : product_pictures;
export interface GroceriesPictures {
  id: number;
  product_id: number;
  picture_url: string;
  added_by: number;
}

export type GroceriesWithPicture = Omit<Groceries, "id"> & {
  picture_url: string | null;
};

export type InsertGroceryRequest = Omit<Groceries, "id">;
