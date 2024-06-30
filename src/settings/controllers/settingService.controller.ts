// import { Body, Controller, Get ,Param,Post,Delete,Put } from "@nestjs/common";
// import { settingServiceService } from "../services/settingService.service";
// import { settingService } from "../schemas/settingService.schema";
// import { CreatesettingServiceDto } from "../dto/settingService.dto";

// @Controller("settingService")
// export class settingServiceController {
//   constructor(private readonly settingServiceService: settingServiceService) {}

//   @Get()
//   async findAll(): Promise<settingService[]> {
//     return this.settingServiceService.findAll();
//   }
//   @Post()
//   async create(@Body() createsettingServiceDto: CreatesettingServiceDto): Promise<settingService> {
//     return this.settingServiceService.create(createsettingServiceDto);
//   }
//   @Get(':id')
//   async findOne(@Param('id') id: string): Promise<settingService> {
//     return await this.settingServiceService.findById(id);
//   }

//   @Put(':id')
//   async update(@Param('id') id: string, @Body() updatesettingServiceDto: CreatesettingServiceDto): Promise<settingService> {
//     return await this.settingServiceService.update(id, updatesettingServiceDto);
//   }

//   @Delete(':id')
//   async delete(@Param('id') id: string): Promise<void> {
//     await this.settingServiceService.delete(id);
//   }
// }
