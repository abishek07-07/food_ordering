import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { FindGroceriesService } from "./services/find-groceries.service";
import { FindGroceriesByID } from "./services/find-groceries-by-id.service";
import { AddGroceriesService } from "./services/add-groceries.service";
import { DeleteGroceriesService } from "./services/delete-groceries.service";
import { FindGroceriesRequest } from "./request/find-groceries.request";
import { AddGroceriesRequest } from "./request/add-groceries.request";

@Controller("groceries")
export class GroceriesController {
  constructor(
    private readonly findGroceriesService: FindGroceriesService,
    private readonly findGroceryBySlugService: FindGroceriesByID,
    private readonly addGroceriesService: AddGroceriesService,
    private readonly deleteGroceriesService: DeleteGroceriesService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async find(@Query() query: FindGroceriesRequest) {
    return this.findGroceriesService.execute(query);
  }

  @Get(":slug")
  @HttpCode(HttpStatus.OK)
  async findBySlug(@Param("slug") slug: string) {
    return this.findGroceryBySlugService.execute({ slug });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async add(@Body() data: AddGroceriesRequest) {
    return this.addGroceriesService.execute(data);
  }

  @Delete(":slug")
  @HttpCode(HttpStatus.OK)
  async remove(@Param("slug") slug: string) {
    return this.deleteGroceriesService.execute({ slug });
  }
}
