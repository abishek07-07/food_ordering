import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoggingModule } from "./common/logging/logging.module";
import { AuthModule } from "./core/passport/passport.module";
import { DatabaseModule } from "./core/database/database.module";
import { HashingModule } from "./core/hashing/hashing.module";
import { JwtModule } from "./core/jwt/jwt.module";
import { UsersModule } from "./features/users/users.module";
import { GroceriesModule } from "./features/groceries/groceries.module";
import { CartModule } from "./features/carts/cart.module";
import appConfig from "../config/app.config";
import databaseConfig from "../config/database.config";
import hashingConfig from "../config/hashing.config";
import jwtConfig from "../config/jwt.config";
import loggerConfig from "../config/logger.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [appConfig, loggerConfig, jwtConfig, databaseConfig, hashingConfig],
    }),
    LoggingModule,
    DatabaseModule,
    JwtModule,
    HashingModule,
    AuthModule,
    UsersModule,
    GroceriesModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
