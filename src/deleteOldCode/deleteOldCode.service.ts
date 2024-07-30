import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VerificationCode } from '../verification/vertification.entity';

@Injectable()
export class deleteOldCodeService {
  constructor(
    @InjectModel('VerificationCode')
    private verificationCodeModel: Model<VerificationCode>,
  ) {}

  public readonly logger = new Logger(deleteOldCodeService.name);

  async deleteExpiredVerificationCodes(): Promise<void> {
    const currentDate = new Date();
    const currentDateDB = new Date(currentDate.getTime());
    try {
      const expiredVerificationCodes = await this.verificationCodeModel.find({
        expiresAt: { $lt: currentDate },
      });
      if (expiredVerificationCodes.length > 0) {
        this.logger.log(
          `deleted ${expiredVerificationCodes.length} Expired verification codes.`,
        );
        await this.verificationCodeModel.deleteMany({
          expiresAt: { $lt: currentDate },
        });
      } else {
        this.logger.log('No expired verification codes found.');
      }
    } catch (error) {
      throw new error('Error while deleting expired verification codes:', error);
    }
  }
}
