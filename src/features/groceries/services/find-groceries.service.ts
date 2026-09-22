import { Injectable } from "@nestjs/common";
import { UseCase } from "src/common/usecase/usecase";
import { FindGroceriesRequest } from "../request/find-groceries.request";
import { GroceriesWithPicture } from "../repository/interface";
import { Results } from "src/common/response/api-response";
import { GroceriesRepository } from "../repository/groceries.repository";

@Injectable()
export class FindGroceriesService implements UseCase<
  FindGroceriesRequest,
  GroceriesWithPicture[]
> {
  constructor(private readonly groceriesRepository: GroceriesRepository) {}

  async execute(
    data: FindGroceriesRequest,
  ): Promise<Results<GroceriesWithPicture[]>> {
    let cursorId = 0;
    if (data.start) {
      const row = await this.groceriesRepository.findIdBySlug(data.start);
      cursorId = row?.id ?? 0;
    }

    const items = await this.groceriesRepository.findGroceries(
      cursorId,
      data.limit ?? 10,
    );

    return {
      message: "Items found successfully",
      statusCode: 200,
      data: items,
    };
  }
}
