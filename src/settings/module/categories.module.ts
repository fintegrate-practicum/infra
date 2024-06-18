import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Category, CategoriesSchema } from "../schemas/category.schema";
import { CategoryService } from "../services/category.service";
import { CategoryController } from "../controllers/categories.controller";
import { Setting, SettingSchema } from "../schemas/setting.schema";
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategoriesSchema },
      { name: Setting.name, schema: SettingSchema },
    ]),
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoriesModule {}
