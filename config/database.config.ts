import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.PGHOST ?? 'localhost',
  port: Number(process.env.PGPORT ?? 5432),
  user: process.env.PGUSER ?? 'postgres',
  password: process.env.PGPASSWORD ?? 'postgres',
  database: process.env.PGDATABASE ?? 'food_ordering',
  poolMin: Number(process.env.DB_POOL_MIN ?? 2),
  poolMax: Number(process.env.DB_POOL_MAX ?? 10),
}));
