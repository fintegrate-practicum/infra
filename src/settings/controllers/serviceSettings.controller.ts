import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ServiceSettingsService } from '../services/serviceSettings.service';
import { CreateServiceSettingsDto } from '../dto/serviceSettings.dto';
import { ServiceSettings } from '../schemas/serviceSettings.schema';

@Controller('service-settings')
export class ServiceSettingsController {
  constructor(private readonly serviceSettingsService: ServiceSettingsService) {}

  @Post()
  async create(
    @Body() createServiceSettingsDto: CreateServiceSettingsDto,
  ): Promise<ServiceSettings> {
    return this.serviceSettingsService.createOrUpdate(createServiceSettingsDto);
  }

  @Get()
  async findAll(): Promise<ServiceSettings[]> {
    return this.serviceSettingsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ServiceSettings> {
    return this.serviceSettingsService.findOne(id);
  }
}
