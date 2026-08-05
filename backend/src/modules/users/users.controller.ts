import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequirePermissions } from "../../common/decorators/permissions.decorator";
import type { AuthPrincipal } from "../../common/auth.types";
import { PrismaService } from "../../database/prisma.service";
import { ROLE_PERMISSIONS } from "../rbac/rbac";

@ApiTags("users") @ApiBearerAuth() @RequirePermissions("crm.view") @Controller("users")
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}
  @Get() async list(@CurrentUser() principal: AuthPrincipal) {
    const users = await this.prisma.user.findMany({ where: { associationId: principal.associationId }, orderBy: { name: "asc" } });
    return users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, permissions: ROLE_PERMISSIONS[u.role], status: u.status,
      ...(u.lastAccessAt ? { lastAccessAt: u.lastAccessAt.toISOString() } : {}) }));
  }
}
