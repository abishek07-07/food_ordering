import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { UserLoginRequest } from "./request/user-login.request";
import { UserLoginService } from "./services/user-login.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly userLoginService: UserLoginService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() data: UserLoginRequest) {
    return this.userLoginService.execute(data);
  }
}
