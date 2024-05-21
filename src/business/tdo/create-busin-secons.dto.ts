import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBusinessDtoLevel2 {

    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    logo: string;

    @IsString()
    phone: string;

    @IsString()
    establishmentDate: string;   
 
}