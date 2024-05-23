import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
export class CreateBusinessDto {
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  owner: Object;
  @IsString()
  email: string;
}
