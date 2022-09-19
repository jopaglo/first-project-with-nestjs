import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

//onde eu registro as rotas, via path dentro dos decorators
@Controller('app') // path
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('getRoute') // path da rota
  getHello(): string {
    return this.appService.getHello();
  }
}
