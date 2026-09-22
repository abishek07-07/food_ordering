import { Injectable, NotFoundException } from "@nestjs/common";
import { UseCase } from "src/common/usecase/usecase";
import { Results } from "src/common/response/api-response";
import { CartsRepository } from "../repository/carts.repository";

@Injectable()
export class ClearCartService implements UseCase<{ userID: number }, null> {
  constructor(private readonly cartRepository: CartsRepository) {}

  async execute(data: { userID: number }): Promise<Results<null>> {
    const cart = await this.cartRepository.findCartByUserId(data.userID);
    if (!cart) throw new NotFoundException("Cart could not be found");

    await this.cartRepository.clearCart(cart.id);

    return {
      message: "Cart cleared successfully",
      statusCode: 200,
      data: null,
    };
  }
}
