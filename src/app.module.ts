import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { businessModule } from "./business/moudle/business.moudle";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RabbitPublisherService } from "src/rabbit-publisher/rabbit-publisher.service";
import { SettingsModule } from "./settings/module/settings.module";
import { CategoriesModule } from "./settings/module/categories.module";
import { AuthzModule } from "./authz/authz.module";
import { VerificationModule } from "./verification/vertification.module";
import { HttpModule } from '@nestjs/axios';
import { CurrentUserController } from './currentuser/currentUser.controlller';
import { ExternalCurrentUserService } from './currentuser/currentUser.service';
// import { VerificationModule } from "./verification/vertification.module";


@Module({
  imports: [
    AuthzModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    businessModule,
    VerificationModule,
    SettingsModule,
    CategoriesModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),
    // AuthzModule,
    HttpModule
  ],
  controllers: [AppController,CurrentUserController],
  providers: [AppService,RabbitPublisherService,ExternalCurrentUserService],

})
export class AppModule {}
