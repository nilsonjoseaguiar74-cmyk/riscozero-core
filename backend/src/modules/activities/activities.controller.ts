import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequirePermissions } from "../../common/decorators/permissions.decorator";
import type { AuthPrincipal } from "../../common/auth.types";
import { PrismaService } from "../../database/prisma.service";
import type { Prisma } from "@prisma/client";

type ActivityWithAuthor = Prisma.LeadActivityGetPayload<{ include: { author: true } }>;

@ApiTags("activities") @ApiBearerAuth() @RequirePermissions("crm.view")
@Controller()
export class ActivitiesController {
  constructor(private readonly prisma: PrismaService) {}
  private present(a: ActivityWithAuthor) { return { id: a.id, leadId: a.leadId, type: a.type, title: a.title,
    ...(a.description ? { description: a.description } : {}), authorName: a.author?.name ?? "Sistema", createdAt: a.createdAt.toISOString() }; }
  @Get("leads/:leadId/activities") async byLead(@CurrentUser() user: AuthPrincipal, @Param("leadId") leadId: string) {
    const rows = await this.prisma.leadActivity.findMany({ where: { associationId: user.associationId, leadId }, include: { author: true }, orderBy: { createdAt: "desc" } }); return rows.map((a) => this.present(a));
  }
  @Get("activities") async recent(@CurrentUser() user: AuthPrincipal, @Query("limit") raw?: string) {
    const rows = await this.prisma.leadActivity.findMany({ where: { associationId: user.associationId }, include: { author: true }, orderBy: { createdAt: "desc" }, take: Math.min(Number(raw) || 50, 100) }); return rows.map((a) => this.present(a));
  }
}
