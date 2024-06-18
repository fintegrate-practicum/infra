import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Setting } from "../schemas/setting.schema";
import { CreateSettingDto } from "../dto/setting.dto";

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name) private SettingModel: Model<Setting>,
  ) {}

  async create(createSettingDto: CreateSettingDto): Promise<Setting> {
    const createdSetting = new this.SettingModel(createSettingDto);
    return createdSetting.save();
  }

  async findAll(): Promise<Setting[]> {
    return this.SettingModel.find().exec();
  }
}
