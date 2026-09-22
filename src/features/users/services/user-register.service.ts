import { ConflictException, Injectable } from "@nestjs/common";
import { Results } from "src/common/response/api-response";
import { UseCase } from "src/common/usecase/usecase";
import { HashService } from "src/core/hashing/hashing.service";
import {
  IUserExceptPassword,
  UsersRepository,
} from "../repository/users.repository";
import { UserRegisterRequest } from "../request/user-register.request";
import { RolesRepository } from "../repository/roles.repository";

@Injectable()
export class UserRegisterService implements UseCase<
  UserRegisterRequest,
  Omit<IUserExceptPassword, "id" | "slug">
> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashService: HashService,
    private readonly rolesRepository: RolesRepository,
  ) {}

  async execute(
    data: UserRegisterRequest,
  ): Promise<Results<Omit<IUserExceptPassword, "id" | "slug">>> {
    const existing = await this.usersRepository.findByEmail(data.email);
    if (existing != null) throw new ConflictException("Email already in use");

    const user: number = await this.usersRepository.insertUser({
      first_name: data.firstName,
      last_name: data.lastname,
      middle_name: data.middleName,
      email: data.email,
      password: this.hashService.hashData(data.password),
    });

    await this.rolesRepository.addRoleToUser(user);

    return {
      statusCode: 201,
      message: "User registered successfully",
      data: {
        first_name: data.firstName,
        last_name: data.lastname,
        middle_name: data.middleName,
        email: data.email,
      },
    };
  }
}
