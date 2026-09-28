import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { UserLoginRequest } from "./request/user-login.request";
import { UserLoginService } from "./services/user-login.service";
import { UserRegisterRequest } from "./request/user-register.request";

import { UserRegisterService } from "./services/user-register.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly userLoginService: UserLoginService,
    private readonly userRegisterService: UserRegisterService,
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: UserLoginRequest) {
    return await this.userLoginService.execute(data);
  }

  @Post("register")
  @HttpCode(HttpStatus.OK)
  async register(@Body() data: UserRegisterRequest) {
    return await this.userRegisterService.execute(data);
  }
}
