import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  VerificationCode,
  VerificationCodeSchema,
} from "../verification/vertification.entity";
import { deleteOldCodeService } from "./deleteOldCode.service";
import { deleteOldCodeController } from "./deleteOldCode.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VerificationCode.name, schema: VerificationCodeSchema },
    ]),
  ],
  providers: [deleteOldCodeService],
  controllers: [deleteOldCodeController],
})
export class deleteOldCodeModule {}
