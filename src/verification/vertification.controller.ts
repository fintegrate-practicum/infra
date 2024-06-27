import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { VerificationService } from "./vertification.services";

@Controller("verification")
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post("create")
  async createVerificationCode(@Body("email") email: string) {
    try {
      const code = await this.verificationService.generateCode(email);
      const message = {
        pattern: "message_queue",
        data: {
          to: email,
          message: code,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //לשלוח את הערך הזה למייל
    // return res;
  }
  @Get("validate") async validateVerificationCode(
    @Query() data: { email: string; code: string },
  ): Promise<boolean> {
    const { email, code } = data;
    const res = await this.verificationService.validateVerificationCode(
      email,
      code,
    );
    if (!res) {
      throw new HttpException(
        "verification code not correct to email",
        HttpStatus.BAD_REQUEST,
      );
    }
    return res;
  }
}
