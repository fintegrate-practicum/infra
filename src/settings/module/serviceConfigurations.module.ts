import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceConfigurationsService } from '../services/serviceConfigurations.service';
import { ServiceConfigurationsController } from '../controllers/serviceConfigurations.controller';
import {
  ServiceConfigurations,
  ServiceConfigurationsSchema,
} from '../schemas/serviceConfigurations.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceConfigurations.name, schema: ServiceConfigurationsSchema },
    ]),
  ],
  controllers: [ServiceConfigurationsController],
  providers: [ServiceConfigurationsService],
})
export class ServiceConfigurationsModule {}
