import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequirePermissions } from "../../common/decorators/permissions.decorator";
import type { AuthPrincipal } from "../../common/auth.types";
import { PrismaService } from "../../database/prisma.service";
import { buildDashboardOverview } from "./dashboard";

@ApiTags("analytics") @ApiBearerAuth() @RequirePermissions("dashboard.view") @Controller("analytics")
export class AnalyticsController {
  constructor(private readonly prisma: PrismaService) {}
  @Get("overview") async overview(@CurrentUser() user: AuthPrincipal, @Query("from") from?: string, @Query("to") to?: string) {
    const where = { associationId: user.associationId, ...((from || to) ? { createdAt: { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lt: new Date(to) } : {}) } } : {}) };
    const leads = await this.prisma.lead.findMany({ where, include: { owner: true, tracking: true, stageHistory: true }, orderBy: { createdAt: "asc" } });
    return buildDashboardOverview(leads);
  }
}
