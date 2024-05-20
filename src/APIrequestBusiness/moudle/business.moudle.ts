import { Module } from '@nestjs/common';
import { businessService } from '../services/business.service';
import { businessController } from '../controllers/business.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from '../schema/organization.entity';

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: Organization.name, schema: OrganizationSchema },
      ]),
    ],
    providers: [businessService],
    controllers: [businessController],
  })
  export class businessModule { }