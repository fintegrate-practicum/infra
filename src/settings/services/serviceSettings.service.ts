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
    const { service_id } = createServiceSettingsDto;
    return this.serviceSettingsModel
      .findOneAndUpdate({ service_id }, createServiceSettingsDto, {
        new: true,
        upsert: true,
      })
      .exec();
  }

  async findAll(): Promise<ServiceSettings[]> {
    return this.serviceSettingsModel.find().exec();
  }

  async findOne(id: number): Promise<ServiceSettings> {
    return this.serviceSettingsModel.findOne({ service_id: id }).exec();
  }
}
