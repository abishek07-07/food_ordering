import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { AppLoggerService } from "./logging.service";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context
      .switchToHttp()
      .getRequest<{ method: string; url: string }>();
    const started = Date.now();
    this.logger.log(`→ ${req.method} ${req.url}`, LoggingInterceptor.name);
    return next.handle().pipe(
      tap(() => {
        const res = context
          .switchToHttp()
          .getResponse<{ statusCode: number }>();
        this.logger.log(
          `← ${req.method} ${req.url} ${res.statusCode} ${Date.now() - started}ms`,
          LoggingInterceptor.name,
        );
      }),
    );
  }
}
