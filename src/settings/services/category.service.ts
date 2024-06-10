import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Category } from "../schemas/category.schema";
import { CreateCategoryDto } from "../dto/category.dto";
import { Setting } from "../schemas/setting.schema";

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name) private CategoryModel: Model<Category>,
        @InjectModel(Setting.name) private SettingModel: Model<Setting>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const { settings, ...categoryData } = createCategoryDto;

        const settingPromises = settings.map(async setting => {
            const newSetting = new this.SettingModel(setting);
            return await newSetting.save();
        });

        const createdSettings = await Promise.all(settingPromises);

        const createdCategory = new this.CategoryModel({
            ...categoryData,
            settings: createdSettings.map(setting => setting._id),
        });

        return await createdCategory.save();
    }
    async findAll(): Promise<Category[]> {
        return this.CategoryModel.find().exec();
    }
}
