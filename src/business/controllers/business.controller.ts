import {
  Controller,
  Get,
  Param,
  Query,
  Body,
  Post,
  Delete,
  Put,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { businessService } from "../services/business.service";
import { CreateBusinessDto } from "../tdo/create-busin-first.dto";
import { CreateBusinessDtoLevel2 } from "../tdo/create-busin-secons.dto";

@Controller("business")
export class businessController {
  constructor(private readonly businessService: businessService) {}

  @Get(":id")
  async getBusinessById(@Param("id") id: string) {
    try {
      const response = this.businessService.getBusinessById(id);
      if (!response) {
        throw new HttpException("business not found", HttpStatus.BAD_REQUEST);
      }
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(":id")
  deleteBusinessById(@Param("id") id: string) {
    try {
      const response = this.businessService.deleteBusinessById(id);
      if (!response) {
        throw new HttpException("business not found", HttpStatus.BAD_REQUEST);
      }
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Post("")
  async createBusiness(
    @Query("id") id: string,
    @Query("name") name: string,
    @Query("email") email: string,
  ) {
    try {
      const response = this.businessService.createBusiness(
        new CreateBusinessDto(id, name, email),
      );
      if (!response) {
        throw new HttpException("business not found", HttpStatus.BAD_REQUEST);
      }
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(":id")
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
        throw new HttpException("business not found", HttpStatus.BAD_REQUEST);
      } else {
        return updatedBusiness;
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
