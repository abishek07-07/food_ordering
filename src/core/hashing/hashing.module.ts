import { Global, Module } from '@nestjs/common';
import { HashService } from './hashing.service';

@Global()
@Module({
  providers: [HashService],
  exports: [HashService],
})
export class HashingModule {}
