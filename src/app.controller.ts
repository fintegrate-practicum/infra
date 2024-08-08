import { Controller, Get, UseGuards, Request, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { RabbitPublisherService } from 'src/rabbit-publisher/rabbit-publisher.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
    private readonly RabbitPublisherService: RabbitPublisherService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getHello(@Request() req): string {
    this.logger.log(req.user.id);
    return this.appService.getHello();
  }
}
