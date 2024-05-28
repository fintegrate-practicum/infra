import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Organization } from "../schema/organization.entity";
import { CreateBusinessDto } from "../tdo/create-busin-first.dto";
import { CreateBusinessDtoLevel2 } from "../tdo/create-busin-secons.dto";
@Injectable()
export class businessService {
  private readonly logger = new Logger(businessService.name);

  constructor(
    @InjectModel("Organization")
    private readonly businessModel: Model<Organization>,
  ) {}

  async createBusiness(
    Organization: CreateBusinessDto,
  ): Promise<CreateBusinessDto> {
    const regexmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const regexcompanynumber = /^516[0-9]{6}$/i;
    if (!regexmail.test(Organization.email))
      throw new HttpException("invalid email", HttpStatus.BAD_REQUEST);
    if (!regexcompanynumber.test(Organization.companyNumber))
      throw new HttpException("invalid number company", HttpStatus.BAD_REQUEST);
    if (
      await this.businessModel.findOne({
        companyNumber: Organization.companyNumber,
      })
    )
      throw new HttpException("company number exist", HttpStatus.BAD_REQUEST);
    if (await this.businessModel.findOne({ email: Organization.email }))
      throw new HttpException("email exist", HttpStatus.BAD_REQUEST);
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
