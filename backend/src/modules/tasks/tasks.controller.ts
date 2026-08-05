import { Body, Controller, Get, NotFoundException, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequirePermissions } from "../../common/decorators/permissions.decorator";
import type { AuthPrincipal } from "../../common/auth.types";
import { PrismaService } from "../../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateTaskDto } from "../leads/leads.dto";
import type { Prisma } from "@prisma/client";

type TaskWithRelations = Prisma.LeadTaskGetPayload<{ include: { lead: true; owner: true } }>;

@ApiTags("tasks") @ApiBearerAuth() @RequirePermissions("crm.view") @Controller()
export class TasksController {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}
  private present(t: TaskWithRelations) { return { id: t.id, leadId: t.leadId, leadName: t.lead.name, title: t.title,
    dueAt: t.dueAt.toISOString(), status: t.status, ownerName: t.owner.name }; }
  @Get("leads/:leadId/tasks") async byLead(@CurrentUser() user: AuthPrincipal, @Param("leadId") leadId: string) {
    const rows = await this.prisma.leadTask.findMany({ where: { associationId: user.associationId, leadId }, include: { lead: true, owner: true }, orderBy: { dueAt: "asc" } }); return rows.map((t) => this.present(t));
  }
  @Get("tasks") async list(@CurrentUser() user: AuthPrincipal) { const rows = await this.prisma.leadTask.findMany({ where: { associationId: user.associationId }, include: { lead: true, owner: true }, orderBy: { dueAt: "asc" } }); return rows.map((t) => this.present(t)); }
  @Post("tasks") @RequirePermissions("crm.edit") async create(@CurrentUser() user: AuthPrincipal, @Body() dto: CreateTaskDto) {
    const lead = await this.prisma.lead.findFirst({ where: { id: dto.leadId, associationId: user.associationId } }); if (!lead) throw new NotFoundException("Lead não encontrado.");
    const task = await this.prisma.leadTask.create({ data: { associationId: user.associationId, leadId: lead.id, ownerId: lead.ownerId ?? user.sub, title: dto.title, dueAt: new Date(dto.dueAt) }, include: { lead: true, owner: true } });
    await this.audit.record({ associationId: user.associationId, userId: user.sub, userName: user.sub, action: "task.create", resource: "task", resourceId: task.id }); return this.present(task);
  }
  @Patch("tasks/:id/complete") @RequirePermissions("crm.edit") async complete(@CurrentUser() user: AuthPrincipal, @Param("id") id: string) {
    const found = await this.prisma.leadTask.findFirst({ where: { id, associationId: user.associationId } }); if (!found) throw new NotFoundException("Tarefa não encontrada.");
    const task = await this.prisma.leadTask.update({ where: { id }, data: { status: "concluida", completedAt: new Date(), version: { increment: 1 } }, include: { lead: true, owner: true } });
    await this.audit.record({ associationId: user.associationId, userId: user.sub, userName: user.sub, action: "task.complete", resource: "task", resourceId: id }); return this.present(task);
  }
}
