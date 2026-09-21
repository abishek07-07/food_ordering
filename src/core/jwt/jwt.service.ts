import { Injectable } from '@nestjs/common';
import {
  JwtService,
  type JwtSignOptions,
  type JwtVerifyOptions,
} from '@nestjs/jwt';

@Injectable()
export class AppJwtService {
  constructor(private readonly jwt: JwtService) {}

  sign(payload: Record<string, string>): string {
    return this.jwt.sign(payload);
  }

  signWithOptions(
    payload: Record<string, any>,
    options: JwtSignOptions,
  ): string {
    return this.jwt.sign(payload, options);
  }

  verify<T extends object = any>(token: string, options?: JwtVerifyOptions): T {
    return this.jwt.verify<T>(token, options);
  }

  decode<T = any>(token: string): T {
    return this.jwt.decode<T>(token);
  }
}
