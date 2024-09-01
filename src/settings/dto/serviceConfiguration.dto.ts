import { IsString, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SettingDTO {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  value: any;
}

export class CreateServiceConfigurationDTO {
  @IsString()
  @IsNotEmpty()
  serviceName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SettingDTO)
  settings: SettingDTO[];
}
