import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class UpdateUserDto {
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
    description: 'mobile number of the user',
    example: '0555555555',
  })
  @IsNotEmpty()
  @IsString()
  mobile: string;

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
