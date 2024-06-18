import { Controller, Get } from "@nestjs/common";
import { SettingsService } from "../services/setting.service";
import { Setting } from "../schemas/setting.schema";

@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async findAll(): Promise<Setting[]> {
    return this.settingsService.findAll();
  }
}
