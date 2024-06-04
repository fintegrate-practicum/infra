import { Controller, Post, Body, Get, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { VerificationService } from './vertification.services';


@Controller('verification')
export class VerificationController {

  constructor(private readonly verificationService: VerificationService) { }

  @Post('create')
  async createVerificationCode(@Body('email') email: string): Promise<string> {
    const res = this.verificationService.generateCode(email);
    if (!res) {
      throw new HttpException("verification code not correct", HttpStatus.BAD_REQUEST);
    }
    return res;
  }

  @Get('validate') async validateVerificationCode(@Body('email') email: string, @Body('code') code: string,): Promise<boolean> {
    const res = this.verificationService.validateVerificationCode(email, code);
    if (!res) {
      throw new HttpException("verification code not correct to email", HttpStatus.BAD_REQUEST);
    }
    return res;
  }

}