import { Body, Controller, Get, Param, Post, Put, Delete } from "@nestjs/common";
import { SettingService } from "../services/setting.service";
import { Setting } from "../schemas/setting.schema";
import { CreateSettingDto } from "../dto/setting.dto";

@Controller("setting")
export class SettingController {
  constructor(private readonly SettingService: SettingService) {}

  @Get()
  async findAll(): Promise<Setting[]> {
    return this.SettingService.findAll();
  }

  @Post()
  async create(@Body() createSettingDto: CreateSettingDto): Promise<Setting> {
    return this.SettingService.create(createSettingDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Setting> {
    return await this.SettingService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateSettingDto: CreateSettingDto): Promise<Setting> {
    return await this.SettingService.update(id, updateSettingDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.SettingService.delete(id);
  }
}
