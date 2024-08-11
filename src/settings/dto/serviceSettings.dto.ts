import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class CreateServiceSettingsDto {
  @IsString()
  @IsNotEmpty()
  service_name: string;

  @IsObject()
  @IsNotEmpty()
  settings_json: any;
}
