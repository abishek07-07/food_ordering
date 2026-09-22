import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartsRepository } from "./repository/carts.repository";
import { AddItemToCartService } from "./services/add-item-to-cart.services";
import { RemoveItemFromCartService } from "./services/remove-item-from-cart.service";
import { ClearCartService } from "./services/clear-cart.service";
import { GetCartItemsService } from "./services/get-cart-items.services";
import { GroceriesModule } from "../groceries/groceries.module";

@Module({
  imports: [GroceriesModule],
  controllers: [CartController],
  providers: [
    CartsRepository,
    AddItemToCartService,
    RemoveItemFromCartService,
    ClearCartService,
    GetCartItemsService,
  ],
  exports: [CartsRepository],
})
export class CartModule {}
