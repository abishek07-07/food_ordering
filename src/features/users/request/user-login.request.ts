import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserLoginRequest {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
