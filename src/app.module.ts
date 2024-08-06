import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { businessModule } from './business/moudle/business.moudle';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitPublisherService } from 'src/rabbit-publisher/rabbit-publisher.service';
import { ServiceSettingsModule } from './settings/module/serviceSettings.module';
import { AuthzModule } from 'fintegrate-auth';
import { VerificationModule } from './verification/vertification.module';
import { deleteOldCodeModule } from './deleteOldCode/deleteOldCode.module';
import { HttpModule } from '@nestjs/axios';
import { UserService } from './user/user.service';
@Module({
  imports: [
    AuthzModule,
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    businessModule,
    VerificationModule,
    ServiceSettingsModule,
    deleteOldCodeModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, RabbitPublisherService, UserService],
})
export class AppModule {}
