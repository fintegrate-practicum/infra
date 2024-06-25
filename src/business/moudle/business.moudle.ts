import { Module  } from "@nestjs/common";
import { VerificationModule } from '../../verification/vertification.module';
import { VerificationService } from '../../verification/vertification.services';
import { BusinessService } from '../services/business.service';
import { businessController } from '../controllers/business.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitPublisherService } from 'src/rabbit-publisher/rabbit-publisher.service';


import {
  Organization,
  OrganizationSchema,
} from "src/business/schema/organization.entity";
import { VerificationCode, VerificationCodeSchema } from "src/verification/vertification.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
      { name: VerificationCode.name, schema: VerificationCodeSchema }
    ]),
    // VerificationModule,

  ],
  providers: [BusinessService,VerificationService,RabbitPublisherService],
  controllers: [businessController],
})
export class businessModule {}
