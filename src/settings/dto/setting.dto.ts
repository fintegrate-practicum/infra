import {
  IsString,
  IsEnum,
  IsArray,
  IsObject,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { InputType } from "../input-settings.enum";
import { Type } from "class-transformer";

class ChildDto {
  @IsString()
  key: string;

  @IsString()
  value: string;

  @IsString()
  string: string;
}

export class CreateSettingDto {
  @IsEnum(InputType)
  typeInput: InputType;

  @IsString()
  settingDesc: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChildDto)
  children?: ChildDto[];

  @IsOptional()
  @IsObject()
  props?: Record<string, any>;
}
