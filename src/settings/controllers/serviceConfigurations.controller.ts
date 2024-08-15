import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ServiceConfigurationsService } from '../services/serviceConfigurations.service';
import { CreateServiceConfigurationDTO } from '../dto/serviceConfiguration.dto';
import { ServiceConfigurations } from '../schemas/serviceConfigurations.schema';

@Controller('service-configurations')
export class ServiceConfigurationsController {
  constructor(
    private readonly serviceConfigurationsService: ServiceConfigurationsService,
  ) {}

  @Post()
  async create(
    @Body() createConfigDto: CreateServiceConfigurationDTO,
  ): Promise<ServiceConfigurations> {
    return this.serviceConfigurationsService.updateOrCreate(
      createConfigDto.serviceName,
      createConfigDto.settings,
    );
  }

  @Get()
  async findAll(): Promise<ServiceConfigurations[]> {
    return this.serviceConfigurationsService.findAll();
  }

  @Get(':serviceName')
  async findOne(
    @Param('serviceName') serviceName: string,
  ): Promise<ServiceConfigurations | null> {
    return this.serviceConfigurationsService.findOne(serviceName);
  }
}
