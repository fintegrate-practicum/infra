import { IsString, IsArray, ValidateNested, IsObject } from "class-validator";
import { Type } from "class-transformer";

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
