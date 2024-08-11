import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateServiceSettingsDto } from '../dto/serviceSettings.dto';
import {
  ServiceSettings,
  ServiceSettingsDocument,
} from '../schemas/serviceSettings.schema';

@Injectable()
export class ServiceSettingsService {
  constructor(
    @InjectModel(ServiceSettings.name)
    private serviceSettingsModel: Model<ServiceSettingsDocument>,
  ) {}

  async createOrUpdate(
    createServiceSettingsDto: CreateServiceSettingsDto,
  ): Promise<ServiceSettings> {
    const { service_name } = createServiceSettingsDto;
    return this.serviceSettingsModel
      .findOneAndUpdate({ service_name }, createServiceSettingsDto, {
        new: true,
        upsert: true,
      })
      .exec();
  }

  async findAll(): Promise<ServiceSettings[]> {
    return this.serviceSettingsModel.find().exec();
  }

  async getAllServiceNames(): Promise<string[]> {
    const services = await this.serviceSettingsModel.find({}, 'service_name').exec();
    return services.map((service) => service.service_name);
  }

  async findOneByServiceName(serviceName: string): Promise<ServiceSettings | null> {
    return this.serviceSettingsModel.findOne({ service_name: serviceName }).exec();
  }
}
