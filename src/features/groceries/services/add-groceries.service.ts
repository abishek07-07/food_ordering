import { ConflictException, Injectable } from "@nestjs/common";
import { UseCase } from "src/common/usecase/usecase";
import { Results } from "src/common/response/api-response";
import { AddGroceriesRequest } from "../request/add-groceries.request";
import { GroceriesRepository } from "../repository/groceries.repository";

@Injectable()
export class AddGroceriesService implements UseCase<
  AddGroceriesRequest,
  { id: number }
> {
  constructor(private readonly groceriesRepository: GroceriesRepository) {}

  async execute(data: AddGroceriesRequest): Promise<Results<{ id: number }>> {
    const existing = await this.groceriesRepository.findGroceryBySlug(
      data.slug,
    );
    if (existing != null) throw new ConflictException("Slug already in use");

    const id = await this.groceriesRepository.insertGrocery({
      ...data,
      description: data.description ?? null,
    });

    return {
      message: "Item added successfully",
      statusCode: 201,
      data: { id },
    };
  }
}
