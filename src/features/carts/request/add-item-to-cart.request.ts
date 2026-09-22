import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class AddItemToCartRequest {
  @IsString()
  @IsNotEmpty()
  groceryId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}
