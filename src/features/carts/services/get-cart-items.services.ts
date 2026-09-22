import { Injectable } from "@nestjs/common";
import { UseCase } from "src/common/usecase/usecase";
import { Results } from "src/common/response/api-response";
import { CartsRepository } from "../repository/carts.repository";
import type { CartItemWithGrocery } from "../repository/interface";
import { GroceriesRepository } from "src/features/groceries/repository/groceries.repository";

@Injectable()
export class GetCartItemsService implements UseCase<
  { userID: number },
  CartItemWithGrocery[]
> {
  constructor(
    private readonly cartRepository: CartsRepository,
    private readonly groceriesRepository: GroceriesRepository,
  ) {}

  async execute(data: {
    userID: number;
  }): Promise<Results<CartItemWithGrocery[]>> {
    const cart = await this.cartRepository.findCartByUserId(data.userID);
    if (!cart) {
      return {
        message: "Cart items fetched successfully",
        statusCode: 200,
        data: [],
      };
    }

    const rows = await this.cartRepository.findCartItems(cart.id);
    const pictures = await this.groceriesRepository.findPicturesByProductIds(
      rows.map((row) => row.productId),
    );
    const firstByProduct = new Map<number, string>();
    for (const picture of pictures) {
      if (!firstByProduct.has(picture.product_id)) {
        firstByProduct.set(picture.product_id, picture.picture_url);
      }
    }

    return {
      message: "Cart items fetched successfully",
      statusCode: 200,
      data: rows.map((row) => ({
        id: row.cartItemId,
        quantity: row.quantity,
        name: row.name,
        slug: row.slug,
        description: row.description,
        picture_url: firstByProduct.get(row.productId) ?? null,
      })),
    };
  }
}
