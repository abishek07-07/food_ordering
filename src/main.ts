import { NestFactory } from "@nestjs/core";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { AppModule } from "./app.module";
import { ValidationPipe } from "./common/pipes/validation.pipe";
import { LoggingInterceptor } from "./common/logging/logging.interceptor";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import dotenv from "dotenv";

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(app.get(LoggingInterceptor));
  app.useGlobalFilters(app.get(HttpExceptionFilter));
  app.enableCors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  });
  const port = process.env.PORT || 4000;
  console.log("The port for the app is ", port);
  await app.listen(port);
  //await app.listen(app.get(ConfigService).getOrThrow<number>("app.port"));
}
void bootstrap();
