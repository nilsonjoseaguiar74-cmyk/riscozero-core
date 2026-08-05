import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";
import type { RequestContext } from "../auth.types";
import { ROLE_PERMISSIONS } from "../../modules/rbac/rbac";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    if (!required?.length) return true;
    const principal = context.switchToHttp().getRequest<RequestContext>().user;
    const available = ROLE_PERMISSIONS[principal.role] ?? [];
    if (!required.every((permission) => available.includes(permission))) {
      throw new ForbiddenException("Seu perfil não possui permissão para acessar este recurso.");
    }
    return true;
  }
}
