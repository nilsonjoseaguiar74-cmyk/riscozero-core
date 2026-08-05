import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequirePermissions } from "../../common/decorators/permissions.decorator";
import type { AuthPrincipal } from "../../common/auth.types";
import { AuditService } from "./audit.service";

@ApiTags("audit") @ApiBearerAuth() @Controller("audit")
export class AuditController {
  constructor(private readonly audit: AuditService) {}
  @Get() @RequirePermissions("audit.view")
  list(@CurrentUser() user: AuthPrincipal, @Query("search") search?: string) {
    return this.audit.list(user.associationId, search);
  }
}
