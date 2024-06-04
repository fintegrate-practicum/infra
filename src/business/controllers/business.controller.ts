import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Delete,
  Put,
  HttpException,
  HttpStatus,
}
from "@nestjs/common";
import { BusinessService } from "../services/business.service";
import { CreateBusinessDto } from "../tdo/create-busin-first.dto";
import { CreateBusinessDtoLevel2 } from "../tdo/create-busin-secons.dto";
import * as fs from "fs";

@Controller("business")
export class businessController {
  constructor(private readonly businessService: BusinessService) {}


  @Get(":companyNumber")
  async getBusinessByCompanyNumber(
    @Param("companyNumber") companyNumber: string,
  ) {
    try {
      const response =
        this.businessService.getBusinessByCompanyNumber(companyNumber);
      if (!response) {
        throw new HttpException("business not found", HttpStatus.BAD_REQUEST);
      }
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(":companyNumber")
  deleteBusinessByCompanyNumber(@Param("companyNumber") companyNumber: string) {
    try {

      const response =
        this.businessService.deleteBusinessByCompanyNumber(companyNumber);
      if (!response) {
        throw new HttpException("business not found", HttpStatus.BAD_REQUEST);
      }
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("")
  async createBusiness(@Body() business: CreateBusinessDto) {
    try {
      const response = this.businessService.createBusiness(business);
      if (!response) {
        throw new HttpException("business not found", HttpStatus.BAD_REQUEST);
      }
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(":companyNumber")
  async updateBusinessByCompanyNumber(
    @Param("companyNumber") companyNumber: string,
    @Body() newData: CreateBusinessDtoLevel2,
  ): Promise<CreateBusinessDtoLevel2> {
    try {
      const filepath = `./logo/company${companyNumber}.png`;
      fs.writeFileSync(filepath, newData.logo, { encoding: "base64" });
      newData.logo = filepath;
      const updatedBusiness =
        this.businessService.updateBusinessByCompanyNumber(
          companyNumber,
          newData,
        );
      if (!updatedBusiness) {
        throw new HttpException("business not found", HttpStatus.BAD_REQUEST);
      } else {
        return updatedBusiness;
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
