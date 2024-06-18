import { IsString, IsArray } from "class-validator";
import { Setting } from "../schemas/setting.schema";
import { Category } from "../schemas/category.schema";

export class CreateCategoryDto {
  @IsString()
  categoryName: string;

  @IsArray()
  settings: Setting[];

  @IsArray()
  subCategories: Category[];
}
