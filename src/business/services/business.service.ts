import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization } from '../schema/organization.entity';
import { RabbitPublisherService } from 'src/rabbit-publisher/rabbit-publisher.service';
// const code="4244"
import { CreateBusinessDto } from "../dto/create-busin-first.dto";
import { CreateBusinessDtoLevel2 } from "../dto/create-busin-secons.dto";
import { VerificationService } from "src/verification/vertification.services";
import { v4 as uuidv4 } from "uuid";
import { Message } from "../interface/message.interface";


@Injectable()
export class BusinessService {
  private readonly logger = new Logger(BusinessService.name);

  constructor(
    @InjectModel('Organization')
    private readonly businessModel: Model<Organization>,
    private readonly rabbitPublisherService: RabbitPublisherService,
    private readonly verificationService: VerificationService,
  ) {}

  async createBusiness(Organization: CreateBusinessDto): Promise<CreateBusinessDto> {
    const regexmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const regexcompanynumber = /^516[0-9]{6}$/i;
    if (!regexmail.test(Organization.email))
      throw new HttpException('invalid email', HttpStatus.BAD_REQUEST);
    if (!regexcompanynumber.test(Organization.companyNumber))
      throw new HttpException('invalid number company', HttpStatus.BAD_REQUEST);
    if (
      await this.businessModel.findOne({
        companyNumber: Organization.companyNumber,
      })
    )
      throw new HttpException('company number exist', HttpStatus.BAD_REQUEST);
    if (await this.businessModel.findOne({ email: Organization.email }))
      throw new HttpException('email exist', HttpStatus.BAD_REQUEST);

    // Generate a unique linkUID
    const linkUID = uuidv4();

    const newBusiness = new this.businessModel({
      ...Organization,
      linkUID,
    });
    let save: CreateBusinessDto;
    if (newBusiness) {
      save = await newBusiness.save();
    } else {
      return null;
    }

    const code = await this.verificationService.generateCode(newBusiness.email);
    const message: Message = {
      pattern: 'message_exchange',
      data: {
        to: newBusiness.email,
        subject: "Login to the site",
        type: 'email',
        kindSubject: 'send-code',
        name: "user.userName",
        description: "description",
        managerName: "manager.userName",
        businessId:"businessId",
        code:"123",
        text:"Thank you for subscribing to our website and good luck in the future"
      },
    };
    try {
      await this.rabbitPublisherService.publishMessageToCommunication(message);
    } catch (error) {
      this.logger.error('Failed to publish message', error);
    }
    return save;
  }

  async getBusinessByLinkUID(linkUID: string): Promise<CreateBusinessDto> {
    const business = await this.businessModel.findOne({ linkUID }).exec();
    if (!business) {
      throw new Error('Business not found');
    }
    return business;
  }

  async getBusinessByCompanyNumber(companyNumber: string): Promise<CreateBusinessDto> {
    const business = await this.businessModel
      .findOne({ companyNumber: companyNumber })
      .exec();
    if (!business) {
      throw new Error('Business not found');
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
      throw new Error('Business not found services');
    } else {
      return business;
    }
  }

  async deleteBusinessByCompanyNumber(companyNumber: string): Promise<CreateBusinessDto> {
    const business = await this.businessModel
      .findOneAndDelete({ companyNumber: companyNumber })
      .exec();
    if (!business) {
      throw new Error('Business not found delete');
    }
    return business;
  }
}
