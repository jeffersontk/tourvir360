import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()

export class AppController {
  @ApiExcludeEndpoint(true)
  @Get()
  @Redirect('/api-docs', 301)
  redirectToSwagger() {
    return;
  }
  constructor(private readonly appService: AppService) {}
}
