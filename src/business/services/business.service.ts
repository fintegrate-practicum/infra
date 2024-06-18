import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Organization } from "../schema/organization.entity";
import { CreateBusinessDto } from "../dto/create-busin-first.dto";
import { CreateBusinessDtoLevel2 } from "../dto/create-busin-secons.dto";
@Injectable()
export class BusinessService {
  private readonly logger = new Logger(BusinessService.name);
  

  constructor(
    @InjectModel("Organization")
    private readonly businessModel: Model<Organization>,
  ) {}

  async createBusiness(
    Organization: CreateBusinessDto,
  ): Promise<CreateBusinessDto> {
    const newBusiness = new this.businessModel(Organization);
    if (newBusiness) {
      return await newBusiness.save();
    } else {
      return null;
    }
  }

  async getBusinessByCompanyNumber(
    companyNumber: string,
  ): Promise<CreateBusinessDto> {
    const business = await this.businessModel
      .findOne({ companyNumber: companyNumber })
      .exec();
    if (!business) {
      throw new Error("Business not found");
    }
    return business;
  }
  async updateBusinessByCompanyNumber(
    companyNumber: string,
    Organization: CreateBusinessDtoLevel2,
  ): Promise<CreateBusinessDtoLevel2> {
    const business = await this.businessModel
      .findOneAndUpdate({ companyNumber: companyNumber }, Organization, {
        new: true,
      })
      .exec();
    if (!business) {
      throw new Error("Business not found services");
    } else {
      return business;
    }
  }
  async deleteBusinessByCompanyNumber(
    companyNumber: string,
  ): Promise<CreateBusinessDto> {
    const business = await this.businessModel
      .findOneAndDelete({ companyNumber: companyNumber })
      .exec();
    if (!business) {
      throw new Error("Business not found delete");
    }
    return business;
  }
}
