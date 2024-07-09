import { Module } from "@nestjs/common";
import { VerificationService } from "./vertification.services";
import { VerificationController } from "./vertification.controller";
import { MongooseModule } from "@nestjs/mongoose";
import {
  VerificationCode,
  VerificationCodeSchema,
} from "./vertification.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VerificationCode.name, schema: VerificationCodeSchema },
    ]),
  ],
  providers: [VerificationService],
  controllers: [VerificationController],
})
export class VerificationModule {}
