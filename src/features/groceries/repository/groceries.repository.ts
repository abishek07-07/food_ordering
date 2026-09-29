import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { KNEX } from "src/core/database/database.module";
import {
  Groceries,
  GroceriesPictures,
  GroceriesWithPicture,
  GroceriesWithPictures,
  InsertGroceryRequest,
} from "./interface";

@Injectable()
export class GroceriesRepository {
  constructor(
    @Inject(KNEX)
    private readonly db: Knex,
  ) {}

  async findIdBySlug(slug: string): Promise<{ id: number } | undefined> {
    return this.db<Groceries>("groceries")
      .select("id")
      .where("slug", slug)
      .first();
  }

  async findGroceries(
    cursorId: number = 0,
    limit: number = 10,
  ): Promise<GroceriesWithPicture[]> {
    const rows = await this.db<Groceries>("groceries")
      .select("id", "name", "slug", "description")
      .where("id", ">", cursorId)
      .orderBy("id", "asc")
      .limit(limit);
    return this.attachSinglePicture(rows);
  }

  async findGroceryBySlug(
    slug: string,
  ): Promise<GroceriesWithPictures | undefined> {
    const row = await this.db<Groceries>("groceries")
      .select("id", "name", "slug", "description")
      .where("slug", slug)
      .first();
    if (row == null) return undefined;
    const pictures = await this.findPicturesByProductIds([row.id]);
    const { id, ...rest } = row;
    return { ...rest, picture_urls: pictures.map((p) => p.picture_url) };
  }

  // Batch: one query for all products, no join.
  async findPicturesByProductIds(
    productIds: number[],
  ): Promise<Pick<GroceriesPictures, "product_id" | "picture_url">[]> {
    if (productIds.length === 0) return [];
    return await this.db<GroceriesPictures>("product_pictures")
      .select("product_id", "picture_url")
      .whereIn("product_id", productIds)
      .orderBy("id", "asc");
  }

  private async findSinglePictureByProductIds(
    productIds: number[],
  ): Promise<Pick<GroceriesPictures, "product_id" | "picture_url">[]> {
    if (productIds.length === 0) return [];
    return this.db<GroceriesPictures>("product_pictures")
      .distinctOn("product_id")
      .select("product_id", "picture_url")
      .whereIn("product_id", productIds)
      .orderBy("product_id", "asc")
      .orderBy("id", "asc");
  }

  async insertGrocery(request: InsertGroceryRequest): Promise<number> {
    const [row] = (await this.db<Groceries>("groceries").insert(
      request,
      "id",
    )) as unknown as ({ id: number } | number)[];
    return typeof row === "object" ? row.id : row;
  }

  async deleteGroceryBySlug(slug: string): Promise<number> {
    return this.db<Groceries>("groceries").where("slug", slug).del();
  }

  // ponytail: lowest id wins per product via DISTINCT ON; cart service still dedupes in JS
  private async attachSinglePicture(
    rows: Pick<Groceries, "id" | "name" | "slug" | "description">[],
  ): Promise<GroceriesWithPicture[]> {
    if (rows.length === 0) return [];
    const pictures = await this.findSinglePictureByProductIds(
      rows.map((row) => row.id),
    );
    const urlByProduct = new Map(
      pictures.map((picture) => [picture.product_id, picture.picture_url]),
    );
    return rows.map(({ id, ...rest }) => ({
      ...rest,
      picture_url: urlByProduct.get(id) ?? null,
    }));
  }
}
