import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private configService: ConfigService) {
    const dbUri = this.configService.get<string>('MONGODB_URI');
    this.logger.log(`DB URI from ConfigService: ${dbUri}`);
  }
  getHello(): string {
    return 'Hello World!';
  }
}
