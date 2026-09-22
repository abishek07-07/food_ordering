import { Injectable, Inject } from "@nestjs/common";
import { KNEX } from "src/core/database/database.module";
import { Knex } from "knex";
import { Users } from "./interface";

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(KNEX)
    private readonly db: Knex,
  ) {}

  async findByEmail(email: string): Promise<Partial<Users> | null | undefined> {
    return this.db<Users>("users")
      .select(
        "email",
        "first_name",
        "last_name",
        "middle_name",
        "password",
        "slug",
      )
      .where("email", email)
      .first();
  }

  async findUserBySlug(
    slug: string,
  ): Promise<Partial<IUserExceptPassword> | undefined> {
    return await this.db<Users>("users")
      .select("email", "first_name", "last_name", "middle_name", "slug")
      .where("slug", slug)
      .first();
  }

  async insertUser(request: InsertUserRequst): Promise<number> {
    return await this.db<Users>("users").insert(request, "id");
  }

  async updateUserBySlug(
    slug: string,
    patch: Partial<InsertUserRequst>,
  ): Promise<number> {
    return await this.db<Users>("users").where("slug", slug).update(patch);
  }

  async deleteUserBySlug(slug: string): Promise<number> {
    return await this.db<Users>("users").where("slug", slug).del();
  }
}

export type IUserExceptPassword = Omit<Users, "password">;

export type InsertUserRequst = Omit<Users, "id" | "slug">;
