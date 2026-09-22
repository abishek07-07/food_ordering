import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WinstonModule, utilities } from "nest-winston";
import * as winston from "winston";
import { AppLoggerService } from "./logging.service";

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        level: cfg.getOrThrow<string>("logger.level"),
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          utilities.format.nestLike(cfg.getOrThrow<string>("app.name"), {
            colors: true,
          }),
        ),
        transports: [new winston.transports.Console()],
      }),
    }),
  ],
  providers: [AppLoggerService],
  exports: [AppLoggerService, WinstonModule],
})
export class LoggingModule {}
