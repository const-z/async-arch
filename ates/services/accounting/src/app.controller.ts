import { Controller, Get } from '@nestjs/common';
import { AppConfigService } from './config.service';

@Controller()
export class AppController {
  constructor(private readonly config: AppConfigService) {}

  @Get()
  getHello(): string {
    return `Hello from ${this.config.appName}`;
  }
}
