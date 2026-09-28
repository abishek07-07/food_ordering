import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { KNEX } from "src/core/database/database.module";

@Injectable()
export class OrdersRepository {
  constructor(
    @Inject(KNEX)
    private readonly db: Knex,
  ) {}

  createOrder(cartItems: string[]): Promise<void> {
    void cartItems;
    return Promise.resolve();
  }
}
