import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Service } from "../schemas/service.schema";
import { CreateServiceDto } from "../dto/service.dto";
import { Setting } from "../schemas/setting.schema";
import { CreateSettingDto } from "../dto/setting.dto";

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(Service.name) private ServiceModel: Model<Service>,
    @InjectModel(Setting.name) private SettingModel: Model<Setting>,
  ) {}
  
  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = await this.ServiceModel.create({
      Name: createServiceDto.Name,
      NameToView: createServiceDto.NameToView,
      icon: createServiceDto.icon,
      route: createServiceDto.route,
    });

    for (const settingService of createServiceDto.settingService) {
      for (const setting of settingService.settings) {
        const createSettingDto = new CreateSettingDto();
        createSettingDto.service_id = service._id;
        createSettingDto.setting_json = setting.setting_json;
        await this.SettingModel.create(createSettingDto);
      }
    }

    return service;
  }

  async findAll(): Promise<Service[]> {
    return this.ServiceModel.find().exec();
  }

  async findById(id: string): Promise<Service | null> {
    return await this.ServiceModel.findById(id).exec();
  }

  async update(id: string, updateServiceDto: CreateServiceDto): Promise<Service | null> {
    const { settingService, ...serviceData } = updateServiceDto;

    const updatedService = await this.ServiceModel.findByIdAndUpdate(
      id,
      serviceData,
      { new: true },
    );

    if (settingService) {
      await this.SettingModel.deleteMany({ service_id: id }).exec();
      const settingsPromises = settingService.map(async settingServiceData => {
        const { settings, ...settingServiceDetails } = settingServiceData;
        const settingsForService = settings.map(settingData => ({
          ...settingData,
          service_id: updatedService._id,
        }));

        return this.SettingModel.insertMany(settingsForService);
      });

      await Promise.all(settingsPromises);
    }

    return updatedService;
  }

  async delete(id: string): Promise<void> {
    await this.ServiceModel.findByIdAndDelete(id);
    await this.SettingModel.deleteMany({ service_id: id }).exec();
  }
}
