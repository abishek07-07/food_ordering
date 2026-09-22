import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ok = (await super.canActivate(context)) as boolean;
    if (ok) {
      const req = context.switchToHttp().getRequest();
      req.userID = req.user?.userID ?? req.user?.sub;
    }
    return ok;
  }
}
