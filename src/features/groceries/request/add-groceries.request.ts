import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AddGroceriesRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsOptional()
  description?: string | Record<string, any> | null;
}
