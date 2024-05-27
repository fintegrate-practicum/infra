import { IsNotEmpty, IsString } from "class-validator";
export class CreateBusinessDto {
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  owner: number;
  @IsString()
  email: string;
}
