import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { businessModule } from "./business/moudle/business.moudle";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
// import { settingServiceModule } from "./settings/module/settingService.module";
import { AuthzModule } from "./authz/authz.module";
import { ServiceModule } from "./settings/module/service.module";
import { SettingModule } from "./settings/module/settings.module"
@Module({
  imports: [
    AuthzModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    businessModule,
    // settingServiceModule,
    // settingServiceModule,
    ServiceModule,
    SettingModule,
    ServiceModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),
    AuthzModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
