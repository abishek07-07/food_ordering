import { Injectable } from "@nestjs/common";
import { Results } from "src/common/response/api-response";
import { UseCase } from "src/common/usecase/usecase";
import { CartsRepository } from "../repository/carts.repository";

interface CreateCartRequest {
  userID: number;
}

@Injectable()
export class CreateCart implements UseCase<CreateCartRequest, null> {
  constructor(private readonly cartRepository: CartsRepository) {}

  async execute(data: CreateCartRequest): Promise<Results<null>> {
    await this.cartRepository.createCart(data.userID);

    return {
      message: "cart created successfully",
      statusCode: 200,
      data: null,
    };
  }
}
