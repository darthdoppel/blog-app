import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiExcludeEndpoint } from "@nestjs/swagger";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiExcludeEndpoint()
  @Get()
  getHello(): any {
    return {
      message:
        "Bienvenidos a la API del Blog de Leandro! Para más información, por favor, ingrese a:",
      url: "https://github.com/darthdoppel/blog-app",
    };
  }
}
