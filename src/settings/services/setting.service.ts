import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Setting } from "../schemas/setting.schema";
import { CreateSettingDto } from "../dto/setting.dto";

@Injectable()
export class SettingService {
  constructor(
    @InjectModel(Setting.name) private SettingModel: Model<Setting>,
  ) { }

  async create(createSettingDto: CreateSettingDto): Promise<Setting> {
    const createdSetting = new this.SettingModel(createSettingDto);
    return await createdSetting.save();
  }

  async findAll(): Promise<Setting[]> {
    return this.SettingModel.find().exec();
  }

  async findById(id: string): Promise<Setting | null> {
    return await this.SettingModel.findById(id).populate('service_id').exec();
  }

  async update(id: string, updateSettingDto: CreateSettingDto): Promise<Setting | null> {
    const updatedSetting = await this.SettingModel.findByIdAndUpdate(
      id,
      updateSettingDto,
      { new: true },
    );
    return updatedSetting;
  }

  async delete(id: string): Promise<void> {
    await this.SettingModel.findByIdAndDelete(id);
  }
}
