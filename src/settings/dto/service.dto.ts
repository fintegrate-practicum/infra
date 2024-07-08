import { IsString, ValidateNested, IsArray, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class SettingDto {
  @IsObject()
  setting_json: Record<string, any>;
}

class SettingServiceDto {
  @IsString()
  settingServiceName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SettingDto)
  settings: SettingDto[];
}

export class CreateServiceDto {
  @IsString()
  Name: string;

  @IsString()
  NameToView: string;

  @IsString()
  icon: string;

  @IsString()
  route: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SettingServiceDto)
  settingService: SettingServiceDto[];
}
