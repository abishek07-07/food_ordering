import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { AppLoggerService } from "../logging/logging.service";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.message
        : "Internal server error";
    this.logger.error(
      `${req.method} ${req.url} ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
      HttpExceptionFilter.name,
    );
    res.status(status).json({ statusCode: status, message, data: null });
  }
}
