import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BusinessRole {
  @ApiProperty({
    description: 'ID of the business',
    example: '12345',
  })
  @IsNotEmpty()
  @IsString()
  businessId: string;

  @ApiProperty({
    description: 'Role of the user in the business',
    example: 'Admin',
  })
  @IsNotEmpty()
  @IsString()
  role: string;
}
