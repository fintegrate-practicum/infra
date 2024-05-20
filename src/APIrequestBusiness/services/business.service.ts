import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization } from '../schema/organization.entity';
import {CreateTaskDto} from '../tdo/create-busin.dto'
@Injectable()
export class businessService {

  //private readonly logger = new Logger(businessService.name)

  constructor(
    @InjectModel('Organization') private readonly businessModel: Model<Organization>,
  ) { }


  async createBusiness(Organization: CreateTaskDto): Promise<CreateTaskDto> {
    console.log(Organization);
    console.log("services");
    const newBusiness = new this.businessModel(Organization);
    return await newBusiness.save();
  }

  async findAll(): Promise<Organization[]> {
    console.log(" i am here");

    return this.businessModel.find().exec();
  }

  async getBusinessByName(name: string): Promise<string> {
    console.log("serv name " + name);
    const business = await this.businessModel.findOne({ name: name }).exec();
    if (!business) {
      throw new Error("Business not found");
    }
    return "Success!!! " + business;
  }
  async updateBusinessByName(name: string, Organization: CreateTaskDto): Promise<CreateTaskDto> {
    const business = await this.businessModel
      .findOneAndUpdate({ name: name }, Organization, { new: true }).exec();
    if (!business) {
      throw new Error("Business not found");
    }
    else
      return business;
  }
  async deleteBusinessByName(name: string): Promise<string> {
    console.log("delete name " + name);
    const business = await this.businessModel.findOneAndDelete({ name: name }).exec();
    if (!business) {
      throw new Error("Business not found delete");
    }
    return "Success!!! " + business + "is delete";
  }


}
