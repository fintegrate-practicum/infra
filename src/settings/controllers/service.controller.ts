import { Body, Controller, Get ,Param,Post, Put,Delete, HttpException, HttpStatus } from "@nestjs/common";
import { ServiceService } from "../services/service.service";
import { Service } from "../schemas/service.schema";
import { CreateServiceDto } from "../dto/service.dto";


@Controller("service")
export class ServiceController {
  constructor(private readonly ServiecesService: ServiceService)
   {}
  @Get()
  async findAll(): Promise<Service[]> {
    return this.ServiecesService.findAll();
  }
  @Post()
  async create(@Body() createServiceDto: CreateServiceDto): Promise<Service> {
    return this.ServiecesService.create(createServiceDto);
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Service> {
    return await this.ServiecesService.findById(id);
  }
//   @Get(':id')
// async findOne(@Param('id') id: string): Promise<Service> {
//   const service = await this.ServiecesService.findById(id).exec();
//   if (!service) {
//     throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
//   }
//   const settings = await this.settingServiceModel.find({ service_id: id });
//   service.settings = settings;
//   return service;
// }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateServiceDto: CreateServiceDto): Promise<Service> {
    return await this.ServiecesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.ServiecesService.delete(id);
  }
}