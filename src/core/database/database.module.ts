import { Global, Inject, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Knex, knex } from "knex";

export const KNEX = "KNEX";

function knexConfig(cfg: ConfigService): Knex.Config {
  const pool = {
    min: cfg.getOrThrow<number>("database.poolMin"),
    max: cfg.getOrThrow<number>("database.poolMax"),
  };
  const url = cfg.get<string>("database.url");
  if (url) {
    return { client: "pg", connection: url, pool };
  }
  return {
    client: "pg",
    connection: {
      host: cfg.getOrThrow<string>("database.host"),
      port: cfg.getOrThrow<number>("database.port"),
      user: cfg.getOrThrow<string>("database.user"),
      password: cfg.getOrThrow<string>("database.password"),
      database: cfg.getOrThrow<string>("database.database"),
    },
    pool,
  };
}

@Global()
@Module({
  providers: [
    {
      provide: KNEX,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => knex(knexConfig(cfg)),
    },
  ],
  exports: [KNEX],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(@Inject(KNEX) private readonly db: Knex) {}

  onModuleDestroy() {
    return this.db.destroy();
  }
}
