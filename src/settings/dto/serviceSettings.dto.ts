import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';

export class CreateServiceSettingsDto {
  @IsNumber()
  @IsNotEmpty()
  service_id: number;

  @IsObject()
  @IsNotEmpty()
  settings_json: any;
}
