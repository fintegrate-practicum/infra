import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization } from '../schema/organization.entity';
import { CreateBusinessDto } from '../tdo/create-busin-first.dto';
import { CreateBusinessDtoLevel2 } from '../tdo/create-busin-secons.dto';
@Injectable()
export class businessService {
  private readonly logger = new Logger(businessService.name);

  constructor(
    @InjectModel("Organization")
    private readonly businessModel: Model<Organization>,
  ) { }

  async createBusiness(Organization: CreateBusinessDto,): Promise<CreateBusinessDto> {
    const newBusiness = new this.businessModel(Organization);
    if (newBusiness) return await newBusiness.save();
    else return null;
  }

  async findAll(): Promise<Organization[]> {
    return this.businessModel.find().exec();
  }

  async getBusinessById(id: string): Promise<CreateBusinessDto> {
    const business = await this.businessModel.findOne({ id: id }).exec();
    if (!business) {
      throw new Error("Business not found");
    }
    return business;
  }
  async updateBusinessById(id: string,Organization: CreateBusinessDtoLevel2,): Promise<CreateBusinessDtoLevel2> {
    const business = await this.businessModel.findOneAndUpdate({ id: id }, Organization, { new: true }).exec();
    if (!business) {
      throw new Error("Business not found services");
    } else {
      return business;
    }
  }
  async deleteBusinessById(id: string): Promise<CreateBusinessDto> {
    const business = await this.businessModel
      .findOneAndDelete({ id: id })
      .exec();
    if (!business) {
      throw new Error("Business not found delete");
    }
    return business;
  }
}
