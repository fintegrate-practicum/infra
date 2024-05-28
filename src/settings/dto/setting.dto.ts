import { IsString, IsEnum } from "class-validator";
import { InputType } from "../input-settings.enum";

export class CreateSettingDto {
  @IsEnum(InputType)
  typeInput: InputType;

  @IsString()
  settingDesc: string;

  @IsString()
  options: string;
}
