import { Inject, Injectable } from "@nestjs/common";
import { KNEX } from "src/core/database/database.module";
import { CartItemRow, CartItems, Carts } from "./interface";
import { Knex } from "knex";

interface CartItemRequest {
  groceriesID: number;
  quantity: number;
}

@Injectable()
export class CartsRepository {
  constructor(
    @Inject(KNEX)
    private readonly db: Knex,
  ) {}

  async findCartByUserId(userID: number): Promise<Carts | undefined> {
    return this.db<Carts>("cart").where("user_id", userID).first();
  }

  async createCart(userID: number): Promise<number> {
    const [row] = await this.db<Carts>("cart").insert(
      { user_id: userID },
      "id",
    );
    return typeof row === "object" ? (row as Carts).id : (row as number);
  }

  async findActiveItem(
    cartId: number,
    productId: number,
  ): Promise<CartItems | undefined> {
    return this.db<CartItems>("cart_items")
      .where({
        cart_id: cartId,
        product_id: productId,
        is_deleted: false,
        is_order_placed: false,
      })
      .first();
  }

  async addItemsToCart(cartId: number, data: CartItemRequest) {
    const existing = await this.findActiveItem(cartId, data.groceriesID);
    if (existing) {
      await this.db<CartItems>("cart_items")
        .where("id", existing.id)
        .update({ quantity: existing.quantity + data.quantity });
      return;
    }
    await this.db<CartItems>("cart_items").insert({
      cart_id: cartId,
      product_id: data.groceriesID,
      quantity: data.quantity,
    });
  }

  async removeItemFromCart(cartId: number, productId: number): Promise<number> {
    return this.db<CartItems>("cart_items")
      .where({
        cart_id: cartId,
        product_id: productId,
        is_deleted: false,
        is_order_placed: false,
      })
      .update({ is_deleted: true });
  }

  async clearCart(cartId: number): Promise<number> {
    return this.db<CartItems>("cart_items")
      .where({
        cart_id: cartId,
        is_deleted: false,
        is_order_placed: false,
      })
      .update({ is_deleted: true });
  }

  async findCartItems(cartId: number): Promise<CartItemRow[]> {
    return this.db("cart_items")
      .join("groceries", "groceries.id", "cart_items.product_id")
      .select(
        "cart_items.id as cartItemId",
        "cart_items.quantity",
        "cart_items.product_id as productId",
        "groceries.name",
        "groceries.slug",
        "groceries.description",
      )
      .where({
        cart_id: cartId,
        is_deleted: false,
        is_order_placed: false,
      })
      .orderBy("cart_items.id", "asc");
  }
}
