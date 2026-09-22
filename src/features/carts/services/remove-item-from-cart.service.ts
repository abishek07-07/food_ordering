import { Injectable, NotFoundException } from "@nestjs/common";
import { UseCase } from "src/common/usecase/usecase";
import { Results } from "src/common/response/api-response";
import { CartsRepository } from "../repository/carts.repository";
import { GroceriesRepository } from "src/features/groceries/repository/groceries.repository";
import { RemoveItemFromCartRequest } from "../request/remove-item-from-cart.request";

@Injectable()
export class RemoveItemFromCartService implements UseCase<
  RemoveItemFromCartRequest,
  null
> {
  constructor(
    private readonly cartRepository: CartsRepository,
    private readonly groceriesRepository: GroceriesRepository,
  ) {}

  async execute(data: RemoveItemFromCartRequest): Promise<Results<null>> {
    const grocery = await this.groceriesRepository.findIdBySlug(
      data.grocerySlug,
    );
    if (!grocery) throw new NotFoundException("The grocery could not be found");

    const cart = await this.cartRepository.findCartByUserId(data.userID);
    if (!cart) throw new NotFoundException("Cart could not be found");

    const removed = await this.cartRepository.removeItemFromCart(
      cart.id,
      grocery.id,
    );
    if (!removed) throw new NotFoundException("Item not found in cart");

    return {
      message: "Item removed from cart successfully",
      statusCode: 200,
      data: null,
    };
  }
}
