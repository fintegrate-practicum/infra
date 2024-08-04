import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceSettingsService } from '../services/serviceSettings.service';
import { ServiceSettingsController } from '../controllers/settingsService.controller';
import {
  ServiceSettings,
  ServiceSettingsSchema,
} from '../schemas/serviceSettings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceSettings.name, schema: ServiceSettingsSchema },
    ]),
  ],
  controllers: [ServiceSettingsController],
  providers: [ServiceSettingsService],
})
export class ServiceSettingsModule {}
