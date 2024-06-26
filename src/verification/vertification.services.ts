
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VerificationCode } from './vertification.entity';
import { randomBytes } from 'crypto';


@Injectable()

export class VerificationService {

  constructor(
    @InjectModel('VerificationCode') private readonly verificationCodeModel: Model<VerificationCode>,
  ) { }

  async removeVerificationCode(code: string): Promise<void> {
    await this.verificationCodeModel.deleteOne({ code }).exec();
    
  }

  async validateVerificationCode(email: string, code: string): Promise<boolean> {
    const verificationCode = await this.verificationCodeModel.findOne({ email, code }).exec();
    if (!verificationCode) return false;
    const isExpired = verificationCode.expiresAt < new Date();
    if (isExpired) {
      await this.removeVerificationCode(code);
      return false;

    }
    return true;
  }

  async generateCode(email: string): Promise<string> {
    const code = randomBytes(3).toString('hex'); 
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);     
    try{
      const verificationCode = ({
        email,
        code,
        expiresAt,
      });
      
      const ver = new this.verificationCodeModel(verificationCode);
      const message = {
        pattern: 'message_queue',
        data: {
          to: verificationCode.email,
          message: code,
        },
      };
      // await this.rabbitPublisherService.publishMessageToCommunication(message);
      await ver.save();
    }

    catch(error){
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);


    }




    return code;
  }

}