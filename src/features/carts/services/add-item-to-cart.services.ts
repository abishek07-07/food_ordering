import { Injectable, NotFoundException } from "@nestjs/common";
import { UseCase } from "src/common/usecase/usecase";
import { AddItemToCartRequest } from "../request/add-item-to-cart.request";
import { Results } from "src/common/response/api-response";
import { CartsRepository } from "../repository/carts.repository";
import type { Carts } from "../repository/interface";
import { GroceriesRepository } from "src/features/groceries/repository/groceries.repository";

export type AddItemToCartInput = AddItemToCartRequest & { userID: number };

@Injectable()
export class AddItemToCartService implements UseCase<AddItemToCartInput, null> {
  constructor(
    private readonly cartRepository: CartsRepository,
    private readonly groceriesRepository: GroceriesRepository,
  ) {}

  async execute(data: AddItemToCartInput): Promise<Results<null>> {
    const grocery = await this.groceriesRepository.findIdBySlug(data.groceryId);
    if (!grocery) throw new NotFoundException("The grocery could not be found");

    let cart = await this.cartRepository.findCartByUserId(data.userID);
    if (!cart) {
      const cartId = await this.cartRepository.createCart(data.userID);
      cart = { id: cartId, user_id: data.userID } as Carts;
    }

    await this.cartRepository.addItemsToCart(cart!.id, {
      quantity: data.quantity,
      groceriesID: grocery.id,
    });

    return {
      message: "Item added to cart successfully",
      statusCode: 201,
      data: null,
    };
  }
}
