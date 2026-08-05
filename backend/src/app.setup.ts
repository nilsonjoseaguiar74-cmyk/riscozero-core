import { ValidationPipe } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";

export function configureApp(app: INestApplication, config: ConfigService): void {
  app.use(helmet());
  app.use(cookieParser());
  const frontendOrigin = config.get<string>("FRONTEND_ORIGIN") ?? "http://localhost:3000";
  app.enableCors({
    origin: frontendOrigin.split(",").map((value: string) => value.trim()),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  const prefix = config.get<string>("API_PREFIX") ?? "api/v1";
  app.setGlobalPrefix(prefix);
  const swaggerEnabled = (config.get<string>("SWAGGER_ENABLED") ?? "true") === "true";
  const production = (config.get<string>("NODE_ENV") ?? "development") === "production";
  if (swaggerEnabled && !production) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle("Risco Zero API")
        .setDescription("API do protótipo funcional Risco Zero")
        .setVersion("0.1")
        .addBearerAuth()
        .build(),
    );
    SwaggerModule.setup(`${prefix}/docs`, app, document);
  }
}
