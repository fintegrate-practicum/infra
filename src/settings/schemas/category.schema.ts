import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Setting } from "./setting.schema";

export type CategoriesDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop({
    type: String,
    required: true,
  })
  categoryName: string;

  @Prop()
  settings: Setting[];

  @Prop()
  subCategories: Category[];
}

export const CategoriesSchema = SchemaFactory.createForClass(Category);
