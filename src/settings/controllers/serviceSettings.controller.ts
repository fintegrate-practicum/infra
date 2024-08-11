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

  @Get('names')
  async getAllServiceNames(): Promise<string[]> {
    return this.serviceSettingsService.getAllServiceNames();
  }

  @Get(':serviceName')
  async findOneByServiceName(
    @Param('serviceName') serviceName: string,
  ): Promise<ServiceSettings | null> {
    return this.serviceSettingsService.findOneByServiceName(serviceName);
  }
}
