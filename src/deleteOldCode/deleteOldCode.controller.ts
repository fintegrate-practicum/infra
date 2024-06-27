import { Controller, Get } from "@nestjs/common";
import { deleteOldCodeService } from "./deleteOldCode.service";

@Controller("verification")
export class deleteOldCodeController {
  constructor(private readonly deleteOldCodeService: deleteOldCodeService) {}

  @Get("/deleteExpiredCodes")
  async deleteExpiredVerificationCodes(): Promise<void> {
    try {
      await this.deleteOldCodeService.deleteExpiredVerificationCodes();
    } catch (error) {
      throw new error(error);
    }
  }
}
