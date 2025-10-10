import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

  // DECORATOR
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // DECORATOR
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
