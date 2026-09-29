import { Injectable, NotFoundException } from "@nestjs/common";
import { UseCase } from "src/common/usecase/usecase";
import { GroceriesWithPictures } from "../repository/interface";
import { Results } from "src/common/response/api-response";
import { GroceriesRepository } from "../repository/groceries.repository";

export class FindGroceriesBySlugRequst {
  slug: string;
}

@Injectable()
export class FindGroceriesByID implements UseCase<
  FindGroceriesBySlugRequst,
  GroceriesWithPictures
> {
  constructor(private readonly groceriesRepository: GroceriesRepository) {}

  async execute(
    data: FindGroceriesBySlugRequst,
  ): Promise<Results<GroceriesWithPictures>> {
    const item = await this.groceriesRepository.findGroceryBySlug(data.slug);
    if (item == null) throw new NotFoundException("Grocery not found");

    return {
      message: "Item found successfully",
      statusCode: 200,
      data: item,
    };
  }
}
