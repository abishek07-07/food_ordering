import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class UserRegisterRequest  {
  @IsString()
  @IsNotEmpty()
  firstName: string
  @IsString()
  @IsNotEmpty()
  lastname: string
  @IsOptional()
  @IsString()
  middleName?: string
  @IsEmail()
  email: string
  @IsString()
  @MinLength(8)
  password: string
}
