import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({ imports: [JwtModule.registerAsync({ inject: [ConfigService], useFactory: (config: ConfigService) => {
  const configuredTtl = Number(config.get<string>("JWT_ACCESS_TTL_SECONDS") ?? "900");
  const expiresIn = Number.isFinite(configuredTtl) && configuredTtl > 0 ? configuredTtl : 900;
  return { secret: config.getOrThrow<string>("JWT_ACCESS_SECRET"), signOptions: { expiresIn } };
} })], controllers: [AuthController], providers: [AuthService], exports: [JwtModule] })
export class AuthModule {}
