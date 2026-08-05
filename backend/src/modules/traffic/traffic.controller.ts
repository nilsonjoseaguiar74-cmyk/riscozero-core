import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequirePermissions } from "../../common/decorators/permissions.decorator";
import type { AuthPrincipal } from "../../common/auth.types";
import { PrismaService } from "../../database/prisma.service";

@ApiTags("traffic") @ApiBearerAuth() @RequirePermissions("traffic.view") @Controller("traffic")
export class TrafficController {
  constructor(private readonly prisma: PrismaService) {}
  private async data(associationId: string) { return Promise.all([
    this.prisma.campaign.findMany({ where: { associationId }, include: { metrics: true } }),
    this.prisma.lead.findMany({ where: { associationId }, include: { tracking: true } }),
  ]); }
  @Get("overview") async overview(@CurrentUser() u: AuthPrincipal) { const [campaigns, leads] = await this.data(u.associationId);
    const investment = campaigns.flatMap((c) => c.metrics).reduce((n, m) => n + Number(m.investment), 0); const adhesions = leads.filter((l) => l.stage === "adesao_concluida").length;
    const metrics = [{ key: "investment", label: "Investimento demonstrativo", value: investment, format: "currency", deltaPercent: 0, helper: "Dados demonstrativos" },
      { key: "leads", label: "Leads", value: leads.length, format: "number", deltaPercent: 0 }, { key: "adhesions", label: "Adesões", value: adhesions, format: "number", deltaPercent: 0 }];
    const bySource = [...new Set(leads.map((l) => l.tracking?.utmSource ?? l.source))].map((label) => ({ label, value: leads.filter((l) => (l.tracking?.utmSource ?? l.source) === label).length }));
    return { metrics, investmentOverTime: [], impressionsOverTime: [], clicksOverTime: [], sessionsOverTime: [], leadsOverTime: [], qualifiedLeadsOverTime: [], adhesionsOverTime: [], cplOverTime: [], cpaOverTime: [], roasOverTime: [], investmentByChannel: [], leadsByChannel: bySource, leadsByCampaign: [], leadsByCity: [], leadsByDevice: [], funnel: [] };
  }
  @Get("by-channel") async channels(@CurrentUser() u: AuthPrincipal) { const [campaigns, leads] = await this.data(u.associationId); return ["google_ads", "meta_ads"].map((channel) => { const metrics = campaigns.filter((c) => c.channel === channel).flatMap((c) => c.metrics); const investment = metrics.reduce((n, m) => n + Number(m.investment), 0); const count = leads.filter((l) => l.tracking?.utmSource?.toLowerCase().includes(channel === "google_ads" ? "google" : "meta")).length; return { channel, investment, impressions: metrics.reduce((n, m) => n + m.impressions, 0), clicks: metrics.reduce((n, m) => n + m.clicks, 0), ctr: 0, cpc: 0, leads: count, cpl: count ? investment / count : 0, adhesions: 0, cpa: 0, revenue: 0, roas: 0, demoData: true }; }); }
  @Get("campaigns") async campaigns(@CurrentUser() u: AuthPrincipal) { const [campaigns, leads] = await this.data(u.associationId); const items = campaigns.map((c) => { const m = c.metrics; const investment = m.reduce((n, x) => n + Number(x.investment), 0); const leadCount = leads.filter((l) => l.campaign === c.name || l.tracking?.utmCampaign === c.externalKey).length; return { id: c.id, channel: c.channel, accountId: `demo-${c.channel}`, accountName: "Conta demonstrativa", name: c.name, status: c.status, objective: c.objective, budget: investment, investment, impressions: m.reduce((n, x) => n + x.impressions, 0), reach: 0, clicks: m.reduce((n, x) => n + x.clicks, 0), sessions: 0, leads: leadCount, qualifiedLeads: leads.filter((l) => l.campaign === c.name && l.stage !== "novo_contato").length, cpl: leadCount ? investment / leadCount : 0, adhesions: leads.filter((l) => l.campaign === c.name && l.stage === "adesao_concluida").length, cpa: 0, attributedRevenue: 0, roas: 0, updatedAt: c.updatedAt.toISOString(), demoData: true }; }); return { items, page: 1, pageSize: items.length, total: items.length, totalPages: 1 }; }
  @Get("conversions") async conversions(@CurrentUser() u: AuthPrincipal) { const leads = await this.prisma.lead.findMany({ where: { associationId: u.associationId, stage: "adesao_concluida" }, include: { tracking: true } }); const items = leads.map((l) => ({ id: l.id, date: l.stageChangedAt.toISOString(), channel: l.tracking?.utmSource?.toLowerCase().includes("meta") ? "meta_ads" : "google_ads", campaign: l.campaign ?? "Sem campanha", landingPage: l.tracking?.landingPage ?? "/", event: "form_success", leadName: l.name })); return { items, page: 1, pageSize: items.length, total: items.length, totalPages: 1 }; }
}
