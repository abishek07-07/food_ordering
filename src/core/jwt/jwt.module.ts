import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule as NestJwtModule, type JwtSignOptions } from '@nestjs/jwt';
import { AppJwtService } from './jwt.service';

@Global()
@Module({
  imports: [
    NestJwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.getOrThrow<string>('jwt.secret'),
        signOptions: {
          expiresIn: cfg.getOrThrow(
            'jwt.expiresIn',
          ) as JwtSignOptions['expiresIn'],
        },
      }),
    }),
  ],
  providers: [AppJwtService],
  exports: [AppJwtService],
})
export class JwtModule {}
