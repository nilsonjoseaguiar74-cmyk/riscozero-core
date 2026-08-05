import { Controller, Get, NotFoundException, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequirePermissions } from "../../common/decorators/permissions.decorator";
import type { AuthPrincipal } from "../../common/auth.types";
import { PrismaService } from "../../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { IntegrationCatalogItem } from "@prisma/client";

const NOTICE = "A integração real depende da documentação técnica, credenciais e autorização do fornecedor.";
@ApiTags("integrations") @ApiBearerAuth() @RequirePermissions("integrations.view") @Controller("integrations")
export class IntegrationsController {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}
  private present(item: IntegrationCatalogItem) { return { id: item.id, name: item.name, description: `${item.description} ${NOTICE}`, status: item.status, category: item.category, requestedAt: item.requestedAt?.toISOString() }; }
  @Get() async list(@CurrentUser() u: AuthPrincipal) { return (await this.prisma.integrationCatalogItem.findMany({ where: { associationId: u.associationId }, orderBy: { name: "asc" } })).map((item) => this.present(item)); }
  @Get(":id") async get(@CurrentUser() u: AuthPrincipal, @Param("id") id: string) { const item = await this.prisma.integrationCatalogItem.findFirst({ where: { id, associationId: u.associationId } }); if (!item) throw new NotFoundException(); return this.present(item); }
  @Post(":id/request-configuration") async request(@CurrentUser() u: AuthPrincipal, @Param("id") id: string) { const item = await this.prisma.integrationCatalogItem.findFirst({ where: { id, associationId: u.associationId } }); if (!item) throw new NotFoundException(); const updated = await this.prisma.integrationCatalogItem.update({ where: { id }, data: { status: "aguardando_documentacao", requestedAt: new Date(), version: { increment: 1 } } }); await this.audit.record({ associationId: u.associationId, userId: u.sub, userName: u.sub, action: "integration.request_configuration", resource: "integration", resourceId: id }); return this.present(updated); }
}
