import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersRepository } from "src/features/users/repository/users.repository";

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    cfg: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfg.getOrThrow<string>("jwt.secret"),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersRepository.findIdBySlug(payload.sub);
    if (!user) throw new UnauthorizedException("User no longer exists");
    return { userID: user.id, email: payload.email };
  }
}
