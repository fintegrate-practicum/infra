import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Setting, SettingSchema } from "../schemas/setting.schema";
import { SettingService } from "../services/setting.service";
import { SettingController } from "../controllers/setting.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Setting.name, schema: SettingSchema },
    ]),
  ],
  providers: [SettingService],
  controllers: [SettingController],
})
export class SettingModule {}
