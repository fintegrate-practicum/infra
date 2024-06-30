import { IsString, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { SettingDto } from "./setting.dto";

export class SettingServiceDto {
  @IsString()
  settingServiceName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SettingDto)
  settings: SettingDto[];
}
