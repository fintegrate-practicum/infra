import {  IsString } from 'class-validator';
export class CreateBusinessDto {
  @IsString()
  companyNumber: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  constructor(companyNumber: string, name: string, email: string) {
    this.companyNumber = companyNumber;
    this.name = name;
    this.email = email;
  }
}
