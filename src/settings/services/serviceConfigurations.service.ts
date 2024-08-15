import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ServiceConfigurations,
  ServiceConfigurationsDocument,
} from '../schemas/serviceConfigurations.schema';

@Injectable()
export class ServiceConfigurationsService {
  constructor(
    @InjectModel(ServiceConfigurations.name)
    private serviceConfigurationsModel: Model<ServiceConfigurationsDocument>,
  ) {}

  async updateOrCreate(
    serviceName: string,
    newSettings: any[],
  ): Promise<ServiceConfigurations> {
    const existingConfiguration = await this.serviceConfigurationsModel.findOne({
      serviceName,
    });

    if (existingConfiguration) {
      newSettings.forEach((newSetting) => {
        const existingSetting = existingConfiguration.settings.find(
          (s) => s.key === newSetting.key,
        );
        if (existingSetting) {
          existingSetting.value = newSetting.value;
        } else {
          existingConfiguration.settings.push(newSetting);
        }
      });
      return existingConfiguration.save();
    } else {
      const newConfiguration = new this.serviceConfigurationsModel({
        serviceName,
        settings: newSettings,
      });
      return newConfiguration.save();
    }
  }

  async findAll(): Promise<ServiceConfigurations[]> {
    return this.serviceConfigurationsModel.find().exec();
  }

  async findOne(serviceName: string): Promise<ServiceConfigurations | null> {
    return this.serviceConfigurationsModel.findOne({ serviceName }).exec();
  }
}
