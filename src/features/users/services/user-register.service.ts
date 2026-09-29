import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { Results } from "src/common/response/api-response";
import { UseCase } from "src/common/usecase/usecase";
import { HashService } from "src/core/hashing/hashing.service";
import {
  IUserExceptPassword,
  UsersRepository,
} from "../repository/users.repository";
import { UserRegisterRequest } from "../request/user-register.request";
import { RolesRepository } from "../repository/roles.repository";
import { CreateCart } from "src/features/carts/services/create-cart.service";

@Injectable()
export class UserRegisterService implements UseCase<
  UserRegisterRequest,
  Omit<IUserExceptPassword, "id" | "slug">
> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashService: HashService,
    private readonly rolesRepository: RolesRepository,
    private readonly cartService: CreateCart,
  ) {}

  async execute(
    data: UserRegisterRequest,
  ): Promise<Results<Omit<IUserExceptPassword, "id" | "slug">>> {
    const existing = await this.usersRepository.findByEmail(data.email);
    if (existing != null) throw new ConflictException("Email already in use");

    const user: number = await this.usersRepository.insertUser({
      first_name: data.firstName,
      last_name: data.lastName,
      middle_name: data.middleName,
      email: data.email,
      password: this.hashService.hashData(data.password),
    });

    await this.rolesRepository.addRoleToUser(user);
    try {
      await this.cartService.execute({ userID: user });
    } catch (error) {
      console.log("Error in creating the cart for the user", error);
      throw new InternalServerErrorException("Error in creating the cart");
    }
    return {
      statusCode: 201,
      message: "User registered successfully",
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        middle_name: data.middleName,
        email: data.email,
      },
    };
  }
}
