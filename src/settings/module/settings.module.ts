import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Setting, SettingSchema } from "../schemas/setting.schema";
import { SettingsService } from "../services/setting.service";
import { SettingsController } from "../controllers/settings.controller";
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }]),
  ],
  providers: [SettingsService],
  controllers: [SettingsController],
})
export class SettingsModule {}
