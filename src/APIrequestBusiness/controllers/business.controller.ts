import { Controller, Get, Param, UseInterceptors, Query, Body, Post, Delete, Put, } from '@nestjs/common';
import { businessService } from '../services/business.service';
import { Organization } from '../schema/organization.entity';
import {CreateTaskDto} from '../tdo/create-busin.dto'

@Controller('business')
export class businessController {
  constructor(private readonly businessService: businessService) { }

  @Get()
  async findAll(@Query('businessId') data: any): Promise<Organization[]> {
    return this.businessService.findAll();
  }

  @Get(':name')
  getBusinessByName(@Param('name') name: string) {
    console.log(name + " name");
    return this.businessService.getBusinessByName(name);
  }

  @Delete(':name')
  deleteBusinessByName(@Param('name') name: string) {
    return this.businessService.deleteBusinessByName(name);
  }
  //יצירת עסק חדש
  @Post(':data')
  async createBusiness(@Body() data: CreateTaskDto) {
    console.log(data + "data");
    return this.businessService.createBusiness(data);
  }
  //עדכון נתונים לפי שם
  @Put('name')
  async updateBusiness(@Param('name') name: string, @Body() newData: CreateTaskDto): Promise<CreateTaskDto> {
    const updatedBusiness = this.businessService.updateBusinessByName(name, newData);
    return updatedBusiness;
  }
}
