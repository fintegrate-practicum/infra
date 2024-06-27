import { IsString } from "class-validator";
export class CreateBusinessDto {
  @IsString()
  companyNumber: string;

  @IsString()
  name: string;

  @IsString()
  email: string;
}
