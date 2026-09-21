import { UseCase } from "src/common/usecase/usecase";
import { UserLoginRequest } from "../request/user-login.request";
import { UserLoginResponse } from "../response/user-login.response";
import { Results } from "src/common/response/api-response";
import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersRepository } from "../repository/users.repository";
import { HashService } from "src/core/hashing/hashing.service";
import { AppJwtService } from "src/core/jwt/jwt.service";


@Injectable()
export class UserLoginService implements UseCase<
  UserLoginRequest,
  UserLoginResponse>
{
  constructor(private readonly userRepository: UsersRepository,
    private readonly hashing: HashService,
    private readonly jwtService: AppJwtService)
    {}
  async execute(data: UserLoginRequest): Promise<Results<UserLoginResponse>> {
    const userExists = await this.userRepository.findByEmail(data.email)


    if (userExists == null)
      throw new BadRequestException("Invalid credentials", {
        description: "Invalid credentials",
      });

    const checkPassword: boolean = userExists.password != null &&
      this.hashing.compareHashData(data.password, userExists.password);

    if (!checkPassword)
      throw new BadRequestException("Invalid Credentials", {
        cause: "Invalid Credentials"
      });

    const accessToken = this.jwtService.sign({
      sub: userExists.slug ?? userExists.email ?? "",
      email: userExists.email ?? "",
    });

    return {
      statusCode: 200,
      message: "Login successful",
      data: {
        users: {
          firstName: userExists.first_name ?? "",
          lastName: userExists.last_name ?? "",
          email: userExists.email ?? "",
          middleName: userExists.middle_name ?? "",
          slug: userExists.slug ?? "",
        },
        accessToken,
      },
    };
  }


}
