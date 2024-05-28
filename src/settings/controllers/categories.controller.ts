import { Body, Controller, Get ,Post } from "@nestjs/common";
import { CategoryService } from "../services/category.service";
import { Category } from "../schemas/category.schema";
import { CreateCategoryDto } from "../dto/category.dto";

@Controller("category")
export class CategoryController {
  constructor(private readonly CategoriesService: CategoryService) {}

  @Get()
  async findAll(): Promise<Category[]> {
    return this.CategoriesService.findAll();
  }
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.CategoriesService.create(createCategoryDto);
  }
}
