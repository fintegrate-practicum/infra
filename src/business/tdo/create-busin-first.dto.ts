import {  IsString } from "class-validator";
export class CreateBusinessDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}
