import { registerAs } from '@nestjs/config';

export default registerAs('hashing', () => ({
  saltRounds: Number(process.env.HASH_SALT ?? 12),
}));
