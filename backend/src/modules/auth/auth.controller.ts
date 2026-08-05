import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import type { Request, Response } from "express";
import { Throttle } from "@nestjs/throttler";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import type { AuthPrincipal } from "../../common/auth.types";
import { AuthService } from "./auth.service";
import { SignInDto } from "./auth.dto";

@ApiTags("auth") @Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly config: ConfigService) {}
  private cookieName(): string { return this.config.get<string>("REFRESH_COOKIE_NAME") ?? "rz_refresh"; }
  private refreshCookie(request: Request): string | undefined {
    const cookies: unknown = request.cookies;
    if (typeof cookies !== "object" || cookies === null) return undefined;
    const value: unknown = (cookies as Record<string, unknown>)[this.cookieName()];
    return typeof value === "string" ? value : undefined;
  }
  private setCookie(response: Response, token: string, expires: Date) {
    response.cookie(this.cookieName(), token, { httpOnly: true, secure: (this.config.get<string>("COOKIE_SECURE") ?? "false") === "true",
      sameSite: "lax", path: "/api/v1/auth", expires });
  }
  @Public() @Throttle({ default: { limit: 5, ttl: 60_000 } }) @Post("sign-in")
  async signIn(@Body() dto: SignInDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const result = await this.auth.signIn(dto.email, dto.password, request.ip, request.headers["user-agent"]);
    this.setCookie(response, result.refreshToken, result.refreshExpiresAt); return result.session;
  }
  @Public() @Post("refresh")
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const token = this.refreshCookie(request);
    if (!token) throw new UnauthorizedException("Refresh token ausente.");
    const result = await this.auth.refresh(token); this.setCookie(response, result.refreshToken, result.refreshExpiresAt); return result.session;
  }
  @ApiBearerAuth() @Post("sign-out")
  async signOut(@CurrentUser() user: AuthPrincipal, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    await this.auth.signOut(this.refreshCookie(request), user.sub);
    response.clearCookie(this.cookieName(), { path: "/api/v1/auth" });
  }
  @ApiBearerAuth() @Get("session") session(@CurrentUser() user: AuthPrincipal) { return this.auth.session(user.sub); }
}
