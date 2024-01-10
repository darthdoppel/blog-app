import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): any {
    return {
      message:
        "Bienvenidos a la API del Blog de Leandro! Para más información, por favor, ingrese a:",
      url: "https://github.com/darthdoppel/blog-app",
    };
  }
}
