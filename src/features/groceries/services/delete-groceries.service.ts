import { Injectable, NotFoundException } from "@nestjs/common";
import { UseCase } from "src/common/usecase/usecase";
import { Results } from "src/common/response/api-response";
import { GroceriesRepository } from "../repository/groceries.repository";

@Injectable()
export class DeleteGroceriesService implements UseCase<
  { slug: string },
  { deleted: number }
> {
  constructor(private readonly groceriesRepository: GroceriesRepository) {}

  async execute(data: { slug: string }): Promise<Results<{ deleted: number }>> {
    const deleted = await this.groceriesRepository.deleteGroceryBySlug(
      data.slug,
    );
    if (!deleted) throw new NotFoundException("Grocery not found");

    return {
      message: "Item deleted successfully",
      statusCode: 200,
      data: { deleted },
    };
  }
}
