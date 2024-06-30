import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ServiceController } from "../controllers/service.controller";
import { Service, ServicesSchema } from "../schemas/service.schema";
import { ServiceService } from "../services/service.service";
import { Setting, SettingSchema } from "../schemas/setting.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Service.name, schema: ServicesSchema },
      { name: Setting.name, schema: SettingSchema },
    ]),
  ],
  providers: [ServiceService],
  controllers: [ServiceController],
})
export class ServiceModule {}
