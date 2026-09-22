import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "src/core/passport/guards/jwt-auth.guard";
import { AddItemToCartService } from "./services/add-item-to-cart.services";
import { RemoveItemFromCartService } from "./services/remove-item-from-cart.service";
import { ClearCartService } from "./services/clear-cart.service";
import { GetCartItemsService } from "./services/get-cart-items.services";
import { AddItemToCartRequest } from "./request/add-item-to-cart.request";

@UseGuards(JwtAuthGuard)
@Controller("carts")
export class CartController {
  constructor(
    private readonly addItemService: AddItemToCartService,
    private readonly removeItemService: RemoveItemFromCartService,
    private readonly clearCartService: ClearCartService,
    private readonly getItemsService: GetCartItemsService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  find(@Req() req: Request) {
    return this.getItemsService.execute({ userID: req.userID! });
  }

  @Post("items")
  @HttpCode(HttpStatus.CREATED)
  add(@Body() body: AddItemToCartRequest, @Req() req: Request) {
    return this.addItemService.execute({
      ...body,
      userID: req.userID!,
    });
  }

  @Delete("items/:slug")
  @HttpCode(HttpStatus.OK)
  remove(@Param("slug") slug: string, @Req() req: Request) {
    return this.removeItemService.execute({
      userID: req.userID!,
      grocerySlug: slug,
    });
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  clear(@Req() req: Request) {
    return this.clearCartService.execute({ userID: req.userID! });
  }
}
