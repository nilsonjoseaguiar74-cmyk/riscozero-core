import { Controller, Get, NotFoundException, Param, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequirePermissions } from "../../common/decorators/permissions.decorator";
import type { AuthPrincipal } from "../../common/auth.types";
import { PrismaService } from "../../database/prisma.service";
import type { Membership, Prisma, Vehicle } from "@prisma/client";

type MemberWithVehicles = Prisma.MemberGetPayload<{ include: { vehicles: true } }>;

const pageData = (items: unknown[], page: number, pageSize: number, total: number) => ({ items, page, pageSize, total, totalPages: Math.ceil(total / pageSize) });

@ApiTags("association") @ApiBearerAuth() @RequirePermissions("association.view") @Controller()
export class AssociationController {
  constructor(private readonly prisma: PrismaService) {}
  private member(m: MemberWithVehicles) { return { id: m.id, codigoInterno: m.code, nome: m.name, cpfMasked: m.cpfMasked, cpfFull: m.cpfMasked,
    whatsapp: m.whatsapp, email: m.email, cidade: m.city, endereco: m.address, status: m.status, dataAdesao: m.joinedAt.toISOString(),
    veiculoIds: m.vehicles.map((vehicle) => vehicle.id), situacaoFinanceira: m.financialSituation, sistemaOrigem: m.sourceSystem,
    consentimentos: [], timeline: [] }; }
  private vehicle(v: Vehicle) { return { id: v.id, placa: v.plate, memberId: v.memberId, marca: v.brand, modelo: v.model, ano: v.year,
    categoria: v.category, status: v.status, vistoriaStatus: v.inspectionStatus, rastreador: v.tracker, opcaoProtecao: v.protectionOption,
    sistemaOrigem: v.sourceSystem, fotos: [], divergencias: [] }; }
  private membership(m: Membership) { return { id: m.id, ...(m.leadId ? { leadId: m.leadId } : {}), ...(m.memberId ? { memberId: m.memberId } : {}),
    candidatoNome: m.candidateName, candidatoWhatsapp: m.candidateWhatsapp, cidade: m.city, veiculoResumo: m.vehicleSummary,
    stage: m.stage, iniciadaEm: m.startedAt.toISOString(), atualizadaEm: m.updatedAt.toISOString(),
    ...(m.activatedAt ? { ativadaEm: m.activatedAt.toISOString() } : {}), documentosPendentes: [], timeline: [] }; }
  private paging(rawPage?: string, rawSize?: string) { return { page: Math.max(Number(rawPage) || 1, 1), pageSize: Math.min(Math.max(Number(rawSize) || 20, 1), 100) }; }
  @Get("members") async members(@CurrentUser() u: AuthPrincipal, @Query("page") p?: string, @Query("pageSize") s?: string, @Query("search") search?: string) {
    const { page, pageSize } = this.paging(p, s); const where = { associationId: u.associationId, ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}) };
    const [rows, total] = await this.prisma.$transaction([this.prisma.member.findMany({ where, include: { vehicles: true }, skip: (page - 1) * pageSize, take: pageSize, orderBy: { name: "asc" } }), this.prisma.member.count({ where })]);
    return pageData(rows.map((m) => this.member(m)), page, pageSize, total);
  }
  @Get("members/:id") async memberById(@CurrentUser() u: AuthPrincipal, @Param("id") id: string) { const row = await this.prisma.member.findFirst({ where: { id, associationId: u.associationId }, include: { vehicles: true } }); if (!row) throw new NotFoundException(); return this.member(row); }
  @Get("vehicles") async vehicles(@CurrentUser() u: AuthPrincipal, @Query("page") p?: string, @Query("pageSize") s?: string) { const { page, pageSize } = this.paging(p, s); const where = { associationId: u.associationId }; const [rows, total] = await this.prisma.$transaction([this.prisma.vehicle.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { plate: "asc" } }), this.prisma.vehicle.count({ where })]); return pageData(rows.map((v) => this.vehicle(v)), page, pageSize, total); }
  @Get("vehicles/:id") async vehicleById(@CurrentUser() u: AuthPrincipal, @Param("id") id: string) { const row = await this.prisma.vehicle.findFirst({ where: { id, associationId: u.associationId } }); if (!row) throw new NotFoundException(); return this.vehicle(row); }
  @Get("memberships") async memberships(@CurrentUser() u: AuthPrincipal, @Query("page") p?: string, @Query("pageSize") s?: string) { const { page, pageSize } = this.paging(p, s); const where = { associationId: u.associationId }; const [rows, total] = await this.prisma.$transaction([this.prisma.membership.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { startedAt: "desc" } }), this.prisma.membership.count({ where })]); return pageData(rows.map((m) => this.membership(m)), page, pageSize, total); }
  @Get("memberships/:id") async membershipById(@CurrentUser() u: AuthPrincipal, @Param("id") id: string) { const row = await this.prisma.membership.findFirst({ where: { id, associationId: u.associationId } }); if (!row) throw new NotFoundException(); return this.membership(row); }
}
