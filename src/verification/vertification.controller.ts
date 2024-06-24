import { Controller, Post, Body, Get, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { VerificationService } from './vertification.services';


@Controller('verification')
export class VerificationController {

  constructor(private readonly verificationService: VerificationService) { }

  @Post('create')
  async createVerificationCode(@Body('email') email: string) {
    try{
      const code =await this.verificationService.generateCode(email);
      return code;
    }
    catch(error){
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }

  @Get('validate') async validateVerificationCode(@Body('email') email: string, @Body('code') code: string,): Promise<boolean> {
    const res =await this.verificationService.validateVerificationCode(email, code);
    if (!res) {
      throw new HttpException("verification code not correct to email", HttpStatus.BAD_REQUEST);
    }
    return res;


  }

}