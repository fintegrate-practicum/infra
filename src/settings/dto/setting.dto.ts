import { IsString, IsArray, ValidateNested, IsObject } from "class-validator";
import { Types } from "mongoose";
import { Type } from "class-transformer";

export class CreateSettingDto {
  @IsString()
  service_id: Types.ObjectId;

  @IsObject()
  setting_json: Record<string, any>;
}

export class SettingDto {
  @IsObject()
  setting_json: Record<string, any>;
}

export class SettingServiceDto {
  @IsString()
  settingServiceName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SettingDto)
  settings: SettingDto[];
}

