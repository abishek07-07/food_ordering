import { Module } from "@nestjs/common";
import { GroceriesController } from "./groceries.controller";
import { GroceriesRepository } from "./repository/groceries.repository";
import { FindGroceriesService } from "./services/find-groceries.service";
import { FindGroceriesByID } from "./services/find-groceries-by-id.service";
import { AddGroceriesService } from "./services/add-groceries.service";
import { DeleteGroceriesService } from "./services/delete-groceries.service";

@Module({
  controllers: [GroceriesController],
  providers: [
    GroceriesRepository,
    FindGroceriesService,
    FindGroceriesByID,
    AddGroceriesService,
    DeleteGroceriesService,
  ],
  exports: [GroceriesRepository],
})
export class GroceriesModule {}
