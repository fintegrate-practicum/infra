import { IsString, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { SettingServiceDto } from "./settingService.dto";

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
