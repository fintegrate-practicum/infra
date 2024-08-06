import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {
    const dbUri = this.configService.get<string>('MONGO_URI');
    console.log(`DB URI from ConfigService: ${dbUri}`);
  }
  getHello(): string {
    return 'Hello World!';
  }
}
