import { Controller, Get, Logger } from '@nestjs/common';
import { deleteOldCodeService } from './deleteOldCode.service';

@Controller('verification')
export class deleteOldCodeController {
  constructor(private readonly deleteOldCodeService: deleteOldCodeService) {}
  public readonly logger = new Logger(deleteOldCodeController.name);

  @Get('/deleteExpiredCodes')
  async deleteExpiredVerificationCodes(): Promise<void> {
    try {
      await this.deleteOldCodeService.deleteExpiredVerificationCodes();
      this.logger.log('Successfully deleted expired verification codes');
    } catch (error) {
      this.logger.error('Error deleting expired verification codes:', error);
      throw new error(error);
    }
  }
}
