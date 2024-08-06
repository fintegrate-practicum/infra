import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'name of the user',
    example: 'Avi',
  })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({
    description: 'email of the user',
    example: 'avi@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  userEmail: string;

  @ApiProperty({
    description: 'use id of the user from auth0',
    example: 'n05y7452opu',
  })
  @IsNotEmpty()
  @IsString()
  auth0_user_id: string;

  @ApiProperty({
    description: 'date of registered',
    example: '2024-12-31',
  })
  @IsNotEmpty()
  @IsDate()
  registeredAt: Date;

  @ApiProperty({
    description: 'date of last login',
    example: '2024-12-31',
  })
  @IsNotEmpty()
  @IsDate()
  lastLogin: Date;

  @ApiProperty({
    description: 'mobile number of the user',
    example: '0555555555',
  })
  @IsNotEmpty()
  @IsString()
  mobile: string;

  @ApiProperty({
    description: 'statuse of the user',
    example: 'Married',
  })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({
    description: 'date of birth of the user',
    example: '2024-12-31',
  })
  @IsNotEmpty()
  @IsDate()
  dateOfBirth: Date;

  @ApiProperty({
    description: 'address object of the user',
    example: { city: 'TV', street: 'Hshalom', num: 5 },
  })
  @IsNotEmpty()
  @IsObject()
  address: {
    city: string;
    street: string;
    num: number;
  };
}
