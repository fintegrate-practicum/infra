import {
  Controller,
  Get,
  Param,
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

import { error } from "console";

@Controller("business")
export class businessController {
  constructor(private readonly businessService: businessService) {}
  @Get()
  async findAll(): Promise<Organization[]> {
    try {
      const response = await this.businessService.findAll();
      if (!response) {
        throw new error("Business not found");
      }
      return response;
    } catch (error) {
      throw new error("Internal Server Error");
    }
  }

  @Get(":id")
  async getBusinessById(@Param("id") id: string) {
    try {
      const responce = this.businessService.getBusinessById(id);
      if (!responce) {
        throw new error("Business not found");
      }
      return responce;
    } catch (error) {
      throw new error("Internal Server Error");
    }
  }

  @Delete(":id")
  deleteBusinessById(@Param("id") id: string) {
    try {
      const responce = this.businessService.deleteBusinessById(id);
      if (!responce) {
        throw new error("Business not found");
      }
      return responce;
    } catch (error) {
      throw new error("Internal Server Error");
    }
  }

  @Post("level1s")
  async createBusiness(@Body() newData: CreateBusinessDto) {
    try {
      const responce = this.businessService.createBusiness(newData);
      if (!responce) {
        throw new error("Business not correct");
      }
      return responce;
    } catch (error) {
      throw new error("Internal Server Error");
    }
  }

  @Put("id")
  async updateBusinessById(
    @Query("id") id: string,
    @Body() newData: CreateBusinessDtoLevel2,
  ): Promise<CreateBusinessDtoLevel2> {
    try {
      const updatedBusiness = this.businessService.updateBusinessById(
        id,
        newData,
      );
      if (!updatedBusiness) {
        throw new error("Business not found");
      } else {
        return updatedBusiness;
      }
    } catch (error) {
      throw new error("Internal Server Error");
    }
  }
}
