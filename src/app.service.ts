import { Injectable } from '@nestjs/common';

/* significa que ele é injetável em outros lugares, nao preciso
dar um new para instanciar, eu apenas saio utilizando ele */
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
