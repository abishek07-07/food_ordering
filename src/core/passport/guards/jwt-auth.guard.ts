import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request } from "express";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ok = (await super.canActivate(context)) as boolean;
    if (ok) {
      const req = context.switchToHttp().getRequest<Request>();
      req.userID = req.user?.userID;
    }
    return ok;
  }
}
