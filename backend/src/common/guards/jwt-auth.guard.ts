import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import type { AuthPrincipal, RequestContext } from "../auth.types";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])) return true;
    const request = context.switchToHttp().getRequest<RequestContext>();
    const authorization = request.headers.authorization;
    const value = Array.isArray(authorization) ? authorization[0] : authorization;
    const token = value?.startsWith("Bearer ") ? value.slice(7) : undefined;
    if (!token) throw new UnauthorizedException("Sessão não autenticada.");
    try {
      request.user = await this.jwt.verifyAsync<AuthPrincipal>(token);
      return true;
    } catch {
      throw new UnauthorizedException("Sessão expirada ou inválida.");
    }
  }
}
