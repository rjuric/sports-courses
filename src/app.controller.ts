import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Role } from './util/enums/role';
import { Roles } from './auth/decorators/roles.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Roles(Role.USER)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
