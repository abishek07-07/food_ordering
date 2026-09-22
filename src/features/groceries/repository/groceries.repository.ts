import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { KNEX } from "src/core/database/database.module";
import {
  Groceries,
  GroceriesPictures,
  GroceriesWithPicture,
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
  ): Promise<GroceriesWithPicture | undefined> {
    const row = await this.db<Groceries>("groceries")
      .select("id", "name", "slug", "description")
      .where("slug", slug)
      .first();
    if (row == null) return undefined;
    const [item] = await this.attachSinglePicture([row]);
    return item;
  }

  // Batch: one query for all products, no join.
  async findPicturesByProductIds(
    productIds: number[],
  ): Promise<Pick<GroceriesPictures, "product_id" | "picture_url">[]> {
    if (productIds.length === 0) return [];
    return this.db<GroceriesPictures>("product_pictures")
      .select("product_id", "picture_url")
      .whereIn("product_id", productIds)
      .orderBy("id", "asc");
  }

  async insertGrocery(request: InsertGroceryRequest): Promise<number> {
    return this.db<Groceries>("groceries").insert(request, "id");
  }

  async deleteGroceryBySlug(slug: string): Promise<number> {
    return this.db<Groceries>("groceries").where("slug", slug).del();
  }

  // ponytail: first picture wins per product; add explicit ordering if choice matters
  private async attachSinglePicture(
    rows: Pick<Groceries, "id" | "name" | "slug" | "description">[],
  ): Promise<GroceriesWithPicture[]> {
    const pictures = await this.findPicturesByProductIds(
      rows.map((row) => row.id),
    );
    const firstByProduct = new Map<number, string>();
    for (const picture of pictures) {
      if (!firstByProduct.has(picture.product_id)) {
        firstByProduct.set(picture.product_id, picture.picture_url);
      }
    }
    return rows.map(({ id, ...rest }) => ({
      ...rest,
      picture_url: firstByProduct.get(id) ?? null,
    }));
  }
}
