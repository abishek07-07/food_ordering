import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { KNEX } from "src/core/database/database.module";
import { UsersRoles, Roles } from "./interface";

@Injectable()
export class RolesRepository {
  constructor(
    @Inject(KNEX)
    private readonly db: Knex,
  ) {}

  async addRoleToUser(userId: number): Promise<void> {
    await this.db<UsersRoles>("users_roles").insert({
      user_id: userId,
      role_id: Number(process.env.DEFAULT_ROLE_ID as string) as number,
    });
  }

  async findRolesofUser(userId: number): Promise<string[]> {
    const res = await this.db<Pick<Roles, "name">>("roles")
      .innerJoin("users_roles", "roles.id", "users_roles.role_id")
      .where("users_roles.user_id", userId)
      .select("roles.name");
    return res.map((r) => r.name) as string[];
  }
}
