import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  Query,
  Body,
  Post,
  Delete,
  Put,
} from "@nestjs/common";
import { businessService } from "../services/business.service";
import { Organization } from "../schema/organization.entity";
import { CreateBusinessDto } from "../tdo/create-busin-first.dto";
import { CreateBusinessDtoLevel2 } from "../tdo/create-busin-secons.dto";

@Controller("business")
export class businessController {
  constructor(private readonly businessService: businessService) {}

  @Get()
  async findAll(): Promise<Organization[]> {
    return this.businessService.findAll();
  }

  @Get(":id")
  getBusinessById(@Param("id") id: string) {
    return this.businessService.getBusinessById(id);
  }

  @Delete(":id")
  deleteBusinessById(@Param("id") id: string) {
    return this.businessService.deleteBusinessById(id);
  }
  @Post(":data")
  async createBusiness(@Body() data: CreateBusinessDto) {
    return this.businessService.createBusiness(data);
  }
  @Post(":data")
  async createBusinessLevel2(@Body() data: CreateBusinessDtoLevel2) {
    return this.businessService.createBusinessLevel2(data);
  }
  @Put("id")
  async updateBusinessById(
    @Param("id") id: string,
    @Body() newData: CreateBusinessDto,
  ): Promise<CreateBusinessDto> {
    const updatedBusiness = this.businessService.updateBusinessById(
      id,
      newData,
    );
    return updatedBusiness;
  }
}
