import { IsString, IsObject } from "class-validator";
import { Types } from "mongoose";

export class CreateSettingDto {
  @IsString()
  service_id: Types.ObjectId;

  @IsObject()
  setting_json: Record<string, any>;
}
