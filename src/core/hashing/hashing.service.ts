import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';

@Injectable()
export class HashService {
  constructor(private readonly cfg: ConfigService) {}

  hashData(data: string): string {
    return bcrypt.hashSync(
      data,
      this.cfg.getOrThrow<number>('hashing.saltRounds'),
    );
  }

  compareHashData(data: string, hashedData: string): boolean {
    return bcrypt.compareSync(data, hashedData);
  }
}
