import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {

    @IsString()
    description: string;
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    logo: string;

    @IsString()
    phone: string;

    @ApiProperty({
        description: 'User that should complete the task',
        example: 'useroneid',
    })
    //   @IsOptional()
    //   assignedTo: string | null;

    @ApiProperty({
        description: 'Date',
        example: '2022-08-19T22:00:00.000+00:00',
    })
    @IsNotEmpty()
    owner: Object;

    @ApiProperty({
        description: 'Description of the task',
        example: 'Feed cats from colony "John"',
    })
    @IsNotEmpty()
    @IsString()
    businessSize: string;

    @ApiProperty({
        description: 'Location of the task',
        example: [51, -0.09],
    })
    @IsNotEmpty()
    @IsString()
    industryType: string;

    @IsString()
    establishmentDate: string;   
}