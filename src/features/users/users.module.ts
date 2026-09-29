import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { RolesRepository } from "./repository/roles.repository";
import { UsersRepository } from "./repository/users.repository";
import { UserLoginService } from "./services/user-login.service";
import { UserRegisterService } from "./services/user-register.service";
import { CartModule } from "../carts/cart.module";

@Module({
  imports: [CartModule],
  controllers: [AuthController],
  providers: [
    UsersRepository,
    RolesRepository,
    UserLoginService,
    UserRegisterService,
  ],
  exports: [UsersRepository],
})
export class UsersModule {}
