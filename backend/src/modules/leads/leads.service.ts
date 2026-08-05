import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import type { LeadStage, Prisma } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { AuthPrincipal } from "../../common/auth.types";
import { AssignLeadDto, ChangeStageDto, CreateActivityDto, CreateLeadDto, LeadFiltersDto, UpdateLeadDto } from "./leads.dto";
import { leadPresentationInclude as include, presentLead } from "./lead.presenter";
import { duplicateWindowStart, normalizePhone, normalizePlate } from "./lead.rules";


@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async createPublic(associationId: string, dto: CreateLeadDto, idempotencyKey?: string) {
    if (dto.website) throw new ConflictException("Solicitação inválida.");
    const whatsapp = normalizePhone(dto.whatsapp); const plate = normalizePlate(dto.plate);
    if (idempotencyKey) {
      const existing = await this.prisma.lead.findFirst({ where: { associationId, idempotencyKey }, include });
      if (existing) return presentLead(existing);
    }
    const recent = await this.prisma.lead.findFirst({ where: { associationId, whatsapp, plate,
      createdAt: { gte: duplicateWindowStart(new Date()) } }, include });
    if (recent) return presentLead(recent);
    const t = dto.tracking;
    const source = t?.utmSource || (t?.referrer ? "Referência" : "Direto");
    const lead = await this.prisma.$transaction(async (tx) => {
      const created = await tx.lead.create({ data: { associationId, name: dto.name.trim(), whatsapp, plate,
        city: dto.city.trim(), vehicleType: dto.vehicleType, vehicleYear: dto.vehicleYear,
        bestTime: dto.bestTime, contactPreference: dto.contactPreference, source, campaign: t?.utmCampaign,
        idempotencyKey, consent: { create: { associationId, granted: dto.consent, version: t?.consentVersion ?? "v1.0" } },
        tracking: { create: { associationId, utmSource: t?.utmSource, utmMedium: t?.utmMedium, utmCampaign: t?.utmCampaign,
          utmTerm: t?.utmTerm, utmContent: t?.utmContent, referrer: t?.referrer, landingPage: t?.landingPage,
          gclid: t?.gclid, gbraid: t?.gbraid, wbraid: t?.wbraid, fbclid: t?.fbclid, deviceType: t?.deviceType,
          browser: t?.browser, operatingSystem: t?.operatingSystem,
          firstVisitAt: t?.firstVisitAt ? new Date(t.firstVisitAt) : undefined,
          conversionPage: t?.conversionPage, conversionCta: t?.conversionCta } },
        stageHistory: { create: { associationId, toStage: "novo_contato" } } }, include });
      return created;
    });
    await this.audit.record({ associationId, userName: "Captação pública", action: "lead.create", resource: "lead", resourceId: lead.id });
    return presentLead(lead);
  }

  async list(user: AuthPrincipal, filters: LeadFiltersDto) {
    const where: Prisma.LeadWhereInput = { associationId: user.associationId,
      ...(filters.stage && filters.stage !== "todas" ? { stage: filters.stage as LeadStage } : {}),
      ...(filters.city ? { city: filters.city } : {}), ...(filters.ownerId ? { ownerId: filters.ownerId } : {}),
      ...(filters.source ? { source: filters.source } : {}), ...(filters.campaign ? { campaign: filters.campaign } : {}),
      ...((filters.from || filters.to) ? { createdAt: { ...(filters.from ? { gte: new Date(filters.from) } : {}), ...(filters.to ? { lt: new Date(filters.to) } : {}) } } : {}),
      ...(filters.search ? { OR: [{ name: { contains: filters.search, mode: "insensitive" } }, { whatsapp: { contains: normalizePhone(filters.search) } }, { plate: { contains: normalizePlate(filters.search) } }] } : {}),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.lead.findMany({ where, include, skip: (filters.page - 1) * filters.pageSize, take: filters.pageSize,
        orderBy: { [filters.sortBy]: filters.sortDir } }), this.prisma.lead.count({ where }),
    ]);
    return { items: items.map(presentLead), page: filters.page, pageSize: filters.pageSize, total, totalPages: Math.ceil(total / filters.pageSize) };
  }

  async get(user: AuthPrincipal, id: string) {
    const lead = await this.prisma.lead.findFirst({ where: { id, associationId: user.associationId }, include });
    if (!lead) throw new NotFoundException("Lead não encontrado."); return presentLead(lead);
  }

  async update(user: AuthPrincipal, id: string, dto: UpdateLeadDto) {
    await this.ensure(user, id); const lead = await this.prisma.lead.update({ where: { id }, data: {
      ...dto, ...(dto.whatsapp ? { whatsapp: normalizePhone(dto.whatsapp) } : {}), ...(dto.plate ? { plate: normalizePlate(dto.plate) } : {}), version: { increment: 1 },
    }, include });
    await this.audit.record({ associationId: user.associationId, userId: user.sub, userName: user.sub, action: "lead.update", resource: "lead", resourceId: id });
    return presentLead(lead);
  }

  async assign(user: AuthPrincipal, id: string, dto: AssignLeadDto) {
    const current = await this.ensure(user, id); const owner = await this.prisma.user.findFirst({ where: { id: dto.userId, associationId: user.associationId, status: "ativo" } });
    if (!owner) throw new NotFoundException("Responsável não encontrado.");
    const lead = await this.prisma.$transaction(async (tx) => {
      const changed = await tx.lead.update({ where: { id }, data: { ownerId: dto.userId, version: { increment: 1 } }, include });
      await tx.leadAssignmentHistory.create({ data: { associationId: user.associationId, leadId: id, fromUserId: current.ownerId, toUserId: dto.userId, changedById: user.sub } });
      await tx.leadActivity.create({ data: { associationId: user.associationId, leadId: id, authorId: user.sub, type: "responsavel", title: `Responsável alterado para ${owner.name}` } });
      return changed;
    });
    await this.audit.record({ associationId: user.associationId, userId: user.sub, userName: user.sub, action: "lead.assign", resource: "lead", resourceId: id, metadata: { ownerId: dto.userId } });
    return presentLead(lead);
  }

  async changeStage(user: AuthPrincipal, id: string, dto: ChangeStageDto) {
    const current = await this.ensure(user, id); const lead = await this.prisma.$transaction(async (tx) => {
      const changed = await tx.lead.update({ where: { id }, data: { stage: dto.stage, stageChangedAt: new Date(), version: { increment: 1 } }, include });
      await tx.leadStageHistory.create({ data: { associationId: user.associationId, leadId: id, fromStage: current.stage, toStage: dto.stage, changedById: user.sub } });
      await tx.leadActivity.create({ data: { associationId: user.associationId, leadId: id, authorId: user.sub, type: "etapa", title: `Etapa alterada para ${dto.stage}` } });
      return changed;
    });
    await this.audit.record({ associationId: user.associationId, userId: user.sub, userName: user.sub, action: "lead.stage_change", resource: "lead", resourceId: id, metadata: { from: current.stage, to: dto.stage } });
    return presentLead(lead);
  }

  async addActivity(user: AuthPrincipal, id: string, dto: CreateActivityDto) {
    await this.ensure(user, id); const author = await this.prisma.user.findUniqueOrThrow({ where: { id: user.sub } });
    const activity = await this.prisma.leadActivity.create({ data: { associationId: user.associationId, leadId: id, authorId: user.sub, ...dto } });
    await this.audit.record({ associationId: user.associationId, userId: user.sub, userName: author.name, action: "activity.create", resource: "lead", resourceId: id });
    return { id: activity.id, leadId: id, type: activity.type, title: activity.title, ...(activity.description ? { description: activity.description } : {}), authorName: author.name, createdAt: activity.createdAt.toISOString() };
  }

  private async ensure(user: AuthPrincipal, id: string) {
    const lead = await this.prisma.lead.findFirst({ where: { id, associationId: user.associationId } });
    if (!lead) throw new NotFoundException("Lead não encontrado."); return lead;
  }
}
