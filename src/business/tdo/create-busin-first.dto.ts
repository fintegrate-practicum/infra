import { IsNotEmpty, IsString } from "class-validator";

export class CreateBusinessDto {
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  owner: Object;

  @IsNotEmpty()
  @IsString()
  businessSize: string;

  @IsNotEmpty()
  @IsString()
  industryType: string;

  @IsString()
  email: string;
}
