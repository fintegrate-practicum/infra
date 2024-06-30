import { IsString, IsEnum, IsArray, IsObject, IsOptional, ValidateNested } from "class-validator";
import { InputType } from "../input-settings.enum";
import { Type } from "class-transformer";
import { Types } from "mongoose";

export class SettingDto {
  @IsString()
  key: string;

  @IsString()
  value: string;

  @IsString()
  settingDesc: string; 

  @IsString()
  typeInput: string; 
}

export class CreateSettingDto {
  @IsEnum(InputType)
  typeInput: InputType;

  @IsString()
  settingDesc: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SettingDto )
  children?: SettingDto [];

  @IsOptional()
  @IsObject()
  props?: Record<string, any>;

  @IsString()
  service_id: Types.ObjectId;
}
