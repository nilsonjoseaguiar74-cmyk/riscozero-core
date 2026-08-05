/** Implementação mockada, em memória, do domínio de Aquisição e Tráfego. */

import {
  MOCK_AD_ACCOUNTS,
  MOCK_ADS,
  MOCK_AD_SETS,
  MOCK_CREATIVES,
  MOCK_EXPERIMENTS,
  MOCK_LANDING_PAGES,
  MOCK_LEAD_JOURNEYS,
  MOCK_MEDIA_INTEGRATIONS,
  MOCK_TRACKING_EVENTS,
  MOCK_TRAFFIC_CAMPAIGNS,
  MOCK_UTM_HISTORY,
  MOCK_UTM_PRESETS,
  buildDailySeries,
} from "@/mocks/traffic";
import { ApiError } from "@/services/http";
import type { TrafficServiceRegistry } from "@/services/traffic.contracts";
import type { MetricSummary, PaginatedResponse, SeriesPoint } from "@/types";
import type {
  Ad,
  AdSet,
  AttributionResult,
  AttributionSettings,
  ChannelPerformance,
  ConversionRow,
  CostRow,
  DiagnosticIssue,
  TrafficCampaign,
  TrafficCampaignDetail,
  TrafficDashboard,
  TrafficFilters,
  TrafficReport,
  UtmPreset,
} from "@/types/traffic";

const delay = (ms = 320) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const round2 = (n: number) => Math.round(n * 100) / 100;

const campaigns: TrafficCampaign[] = clone(MOCK_TRAFFIC_CAMPAIGNS);
const adSets: AdSet[] = clone(MOCK_AD_SETS);
const ads: Ad[] = clone(MOCK_ADS);
let attributionSettings: AttributionSettings = {
  model: "ultimo_contato",
  windowDays: 30,
};
const utmPresets: UtmPreset[] = clone(MOCK_UTM_PRESETS);
const reports: TrafficReport[] = [];

function applyCampaignFilters(list: TrafficCampaign[], filters: TrafficFilters): TrafficCampaign[] {
  return list.filter((c) => {
    if (filters.channel && filters.channel !== "todos" && c.channel !== filters.channel) return false;
    if (filters.accountId && c.accountId !== filters.accountId) return false;
    if (filters.campaignId && c.id !== filters.campaignId) return false;
    if (filters.from && c.updatedAt < filters.from) return false;
    if (filters.to && c.updatedAt > filters.to) return false;
    return true;
  });
}

function sumSeries(list: TrafficCampaign[], picker: (c: TrafficCampaign) => number, days = 90): SeriesPoint[] {
  const totals = new Array<number>(days).fill(0);
  list.forEach((campaign) => {
    const daily = buildDailySeries(campaign, days);
    const ratio = picker(campaign);
    const dailyTotal = daily.reduce((acc, d) => acc + d.investment, 0) || 1;
    daily.forEach((point, i) => {
      totals[i] = (totals[i] ?? 0) + (point.investment / dailyTotal) * ratio;
    });
  });
  return totals.map((value, i) => {
    const date = new Date(Date.now() - (days - 1 - i) * 86400000);
    return {
      label: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      value: Math.round(value * 100) / 100,
    };
  });
}

function buildDashboard(filters: TrafficFilters): TrafficDashboard {
  const filtered = applyCampaignFilters(campaigns, filters);
  const investment = filtered.reduce((a, c) => a + c.investment, 0);
  const impressions = filtered.reduce((a, c) => a + c.impressions, 0);
  const reach = filtered.reduce((a, c) => a + c.reach, 0);
  const clicks = filtered.reduce((a, c) => a + c.clicks, 0);
  const sessions = filtered.reduce((a, c) => a + c.sessions, 0);
  const leads = filtered.reduce((a, c) => a + c.leads, 0);
  const qualifiedLeads = filtered.reduce((a, c) => a + c.qualifiedLeads, 0);
  const adhesions = filtered.reduce((a, c) => a + c.adhesions, 0);
  const revenue = filtered.reduce((a, c) => a + c.attributedRevenue, 0);
  const propostas = Math.round(qualifiedLeads * 0.42);

  const ctr = impressions ? (clicks / impressions) * 100 : 0;
  const cpc = clicks ? investment / clicks : 0;
  const cpl = leads ? investment / leads : 0;
  const costPerQualified = qualifiedLeads ? investment / qualifiedLeads : 0;
  const cpa = adhesions ? investment / adhesions : 0;
  const roas = investment ? revenue / investment : 0;
  const frequency = reach ? impressions / reach : 0;

  const metrics: MetricSummary[] = [
    { key: "investment", label: "Investimento", value: round2(investment), format: "currency", deltaPercent: 5.2 },
    { key: "impressions", label: "Impressões", value: impressions, format: "number", deltaPercent: 3.1 },
    { key: "reach", label: "Alcance", value: reach, format: "number", deltaPercent: 2.4 },
    { key: "frequency", label: "Frequência", value: round2(frequency), format: "number", deltaPercent: 0.8 },
    { key: "clicks", label: "Cliques", value: clicks, format: "number", deltaPercent: 4.6 },
    { key: "ctr", label: "CTR", value: round2(ctr), format: "percent", deltaPercent: 1.1 },
    { key: "cpc", label: "CPC", value: round2(cpc), format: "currency", deltaPercent: -1.4 },
    { key: "sessions", label: "Sessões", value: sessions, format: "number", deltaPercent: 3.9 },
    { key: "leads", label: "Leads", value: leads, format: "number", deltaPercent: 8.3 },
    { key: "cpl", label: "CPL", value: round2(cpl), format: "currency", deltaPercent: -2.6 },
    { key: "qualifiedLeads", label: "Leads qualificados", value: qualifiedLeads, format: "number", deltaPercent: 6.5 },
    { key: "costPerQualified", label: "Custo por lead qualificado", value: round2(costPerQualified), format: "currency", deltaPercent: -1.9 },
    { key: "proposals", label: "Propostas de adesão", value: propostas, format: "number", deltaPercent: 7.2 },
    { key: "adhesions", label: "Adesões concluídas", value: adhesions, format: "number", deltaPercent: 9.8 },
    { key: "cpa", label: "CPA", value: round2(cpa), format: "currency", deltaPercent: -3.1 },
    { key: "revenue", label: "Receita atribuída", value: round2(revenue), format: "currency", deltaPercent: 11.4 },
    { key: "roas", label: "ROAS", value: round2(roas), format: "number", deltaPercent: 6.7 },
  ];

  const funnel: SeriesPoint[] = [
    { label: "Sessões", value: sessions },
    { label: "Leads", value: leads },
    { label: "Leads qualificados", value: qualifiedLeads },
    { label: "Propostas de adesão", value: propostas },
    { label: "Adesões concluídas", value: adhesions },
  ];

  const byChannel = (picker: (c: TrafficCampaign) => number): SeriesPoint[] => {
    const map = new Map<string, number>();
    filtered.forEach((c) => {
      const label = c.channel === "google_ads" ? "Google Ads" : "Meta Ads";
      map.set(label, (map.get(label) ?? 0) + picker(c));
    });
    return [...map.entries()].map(([label, value]) => ({ label, value: round2(value) }));
  };

  const byCampaign: SeriesPoint[] = [...filtered]
    .sort((a, b) => b.leads - a.leads)
    .slice(0, 10)
    .map((c) => ({ label: c.name, value: c.leads }));

  const cities = ["São José", "Florianópolis", "Palhoça", "Biguaçu"];
  const leadsByCity: SeriesPoint[] = cities.map((city, i) => ({
    label: city,
    value: Math.round(leads * (0.32 - i * 0.06)),
  }));

  const leadsByDevice: SeriesPoint[] = [
    { label: "Celular", value: Math.round(leads * 0.68) },
    { label: "Computador", value: Math.round(leads * 0.24) },
    { label: "Tablet", value: Math.round(leads * 0.08) },
  ];

  return {
    metrics,
    investmentOverTime: sumSeries(filtered, (c) => c.investment),
    impressionsOverTime: sumSeries(filtered, (c) => c.impressions),
    clicksOverTime: sumSeries(filtered, (c) => c.clicks),
    sessionsOverTime: sumSeries(filtered, (c) => c.sessions),
    leadsOverTime: sumSeries(filtered, (c) => c.leads),
    qualifiedLeadsOverTime: sumSeries(filtered, (c) => c.qualifiedLeads),
    adhesionsOverTime: sumSeries(filtered, (c) => c.adhesions),
    cplOverTime: sumSeries(filtered, () => cpl),
    cpaOverTime: sumSeries(filtered, () => cpa),
    roasOverTime: sumSeries(filtered, () => roas),
    investmentByChannel: byChannel((c) => c.investment),
    leadsByChannel: byChannel((c) => c.leads),
    leadsByCampaign: byCampaign,
    leadsByCity,
    leadsByDevice,
    funnel,
  };
}

function paginate<T>(list: T[], filters: { page?: number | undefined; pageSize?: number | undefined }): PaginatedResponse<T> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const start = (page - 1) * pageSize;
  return {
    items: list.slice(start, start + pageSize),
    page,
    pageSize,
    total: list.length,
    totalPages: Math.max(1, Math.ceil(list.length / pageSize)),
  };
}

export const trafficMock: TrafficServiceRegistry = {
  trafficAnalytics: {
    async overview(filters) {
      await delay(420);
      return buildDashboard(filters);
    },
    async byChannel(filters) {
      await delay(360);
      const filtered = applyCampaignFilters(campaigns, filters);
      const channels: ChannelPerformance["channel"][] = ["google_ads", "meta_ads"];
      return channels.map((channel) => {
        const list = filtered.filter((c) => c.channel === channel);
        const investment = list.reduce((a, c) => a + c.investment, 0);
        const impressions = list.reduce((a, c) => a + c.impressions, 0);
        const clicks = list.reduce((a, c) => a + c.clicks, 0);
        const leads = list.reduce((a, c) => a + c.leads, 0);
        const adhesions = list.reduce((a, c) => a + c.adhesions, 0);
        const revenue = list.reduce((a, c) => a + c.attributedRevenue, 0);
        return {
          channel,
          investment: round2(investment),
          impressions,
          clicks,
          ctr: impressions ? round2((clicks / impressions) * 100) : 0,
          cpc: clicks ? round2(investment / clicks) : 0,
          leads,
          cpl: leads ? round2(investment / leads) : 0,
          adhesions,
          cpa: adhesions ? round2(investment / adhesions) : 0,
          revenue: round2(revenue),
          roas: investment ? round2(revenue / investment) : 0,
        } satisfies ChannelPerformance;
      });
    },
  },

  trafficCampaigns: {
    async listAccounts() {
      await delay(220);
      return clone(MOCK_AD_ACCOUNTS);
    },
    async list(filters) {
      await delay(360);
      let filtered = applyCampaignFilters(campaigns, filters);
      const sortBy = filters.sortBy ?? "investment";
      const dir = filters.sortDir === "asc" ? 1 : -1;
      filtered = [...filtered].sort((a, b) => {
        const av = (a as unknown as Record<string, unknown>)[sortBy];
        const bv = (b as unknown as Record<string, unknown>)[sortBy];
        if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
        return String(av ?? "") > String(bv ?? "") ? dir : -dir;
      });
      return paginate(filtered, filters);
    },
    async getById(id) {
      await delay(300);
      const campaign = campaigns.find((c) => c.id === id);
      if (!campaign) throw new ApiError("nao_encontrado", "Campanha não encontrada.", 404);
      const daily = buildDailySeries(campaign);
      const funnel: SeriesPoint[] = [
        { label: "Sessões", value: campaign.sessions },
        { label: "Leads", value: campaign.leads },
        { label: "Leads qualificados", value: campaign.qualifiedLeads },
        { label: "Adesões concluídas", value: campaign.adhesions },
      ];
      const byDevice: SeriesPoint[] = [
        { label: "Celular", value: Math.round(campaign.leads * 0.68) },
        { label: "Computador", value: Math.round(campaign.leads * 0.24) },
        { label: "Tablet", value: Math.round(campaign.leads * 0.08) },
      ];
      const byLandingPage: SeriesPoint[] = MOCK_LANDING_PAGES.slice(0, 4).map((lp) => ({
        label: lp.path,
        value: Math.round(campaign.leads * (0.1 + Math.random() * 0)),
      }));
      const detail: TrafficCampaignDetail = {
        ...campaign,
        daily,
        funnel,
        byDevice,
        byLandingPage,
        adSets: adSets.filter((a) => a.campaignId === campaign.id),
        ads: ads.filter((a) => a.campaignId === campaign.id),
      };
      return detail;
    },
    async listAdSets(campaignId) {
      await delay(220);
      return adSets.filter((a) => a.campaignId === campaignId);
    },
    async listAds(adSetId) {
      await delay(220);
      return ads.filter((a) => a.adSetId === adSetId);
    },
  },

  attribution: {
    async getSettings() {
      await delay(160);
      return clone(attributionSettings);
    },
    async updateSettings(payload) {
      await delay(280);
      attributionSettings = { ...attributionSettings, ...payload };
      return clone(attributionSettings);
    },
    async calculate(filters) {
      await delay(400);
      const filtered = applyCampaignFilters(campaigns, filters);
      const totalRevenue = filtered.reduce((a, c) => a + c.attributedRevenue, 0);
      const totalAdhesions = filtered.reduce((a, c) => a + c.adhesions, 0);
      const byChannel = new Map<string, number>();
      const byCampaign: SeriesPoint[] = filtered
        .map((c) => ({ label: c.name, value: c.attributedRevenue }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
      filtered.forEach((c) => {
        const label = c.channel === "google_ads" ? "Google Ads" : "Meta Ads";
        byChannel.set(label, (byChannel.get(label) ?? 0) + c.attributedRevenue);
      });
      const result: AttributionResult = {
        model: attributionSettings.model,
        byChannel: [...byChannel.entries()].map(([label, value]) => ({ label, value: round2(value) })),
        byCampaign,
        totalRevenue: round2(totalRevenue),
        totalAdhesions,
      };
      return result;
    },
    async journeys() {
      await delay(340);
      return clone(MOCK_LEAD_JOURNEYS);
    },
    async journeyByLead(leadId) {
      await delay(220);
      return clone(MOCK_LEAD_JOURNEYS.find((j) => j.leadId === leadId) ?? null);
    },
  },

  landingAnalytics: {
    async list() {
      await delay(300);
      return clone(MOCK_LANDING_PAGES);
    },
    async getByPath(path) {
      await delay(180);
      return clone(MOCK_LANDING_PAGES.find((lp) => lp.path === path) ?? null);
    },
  },

  conversions: {
    async list(filters) {
      await delay(340);
      const rows: ConversionRow[] = MOCK_LEAD_JOURNEYS.filter((j) => j.convertedAt).map((j, i) => {
        const last = j.touchpoints[j.touchpoints.length - 1];
        const channel = last?.channel === "google_ads" || last?.channel === "meta_ads" ? last.channel : "google_ads";
        return {
          id: `conv-${i + 1}`,
          date: j.convertedAt ?? new Date().toISOString(),
          channel,
          campaign: last?.campaign ?? "Orgânico",
          landingPage: last?.landingPage ?? "/",
          event: "form_success",
          leadName: j.leadName,
          value: 1290,
        } satisfies ConversionRow;
      });
      const filtered = rows.filter((r) => {
        if (filters.channel && filters.channel !== "todos" && r.channel !== filters.channel) return false;
        if (filters.from && r.date < filters.from) return false;
        if (filters.to && r.date > filters.to) return false;
        return true;
      });
      return paginate(filtered, filters);
    },
  },

  costs: {
    async list(filters) {
      await delay(340);
      const filtered = applyCampaignFilters(campaigns, filters);
      const rows: CostRow[] = filtered.map((c, i) => ({
        id: `cost-${i + 1}`,
        date: c.updatedAt,
        channel: c.channel,
        accountName: c.accountName,
        campaign: c.name,
        investment: c.investment,
        clicks: c.clicks,
        cpc: c.clicks ? round2(c.investment / c.clicks) : 0,
        leads: c.leads,
        cpl: c.leads ? round2(c.investment / c.leads) : 0,
      }));
      return paginate(rows, filters);
    },
    async exportCsv(filters) {
      await delay(500);
      const filtered = applyCampaignFilters(campaigns, filters);
      const header = "canal;conta;campanha;investimento;cliques;cpc;leads;cpl";
      const body = filtered
        .map((c) =>
          [
            c.channel,
            c.accountName,
            c.name,
            c.investment,
            c.clicks,
            c.clicks ? round2(c.investment / c.clicks) : 0,
            c.leads,
            c.leads ? round2(c.investment / c.leads) : 0,
          ].join(";"),
        )
        .join("\n");
      return `${header}\n${body}`;
    },
  },

  utm: {
    async build(params) {
      await delay(160);
      const url = new URL(params.url, "https://riscozero.com.br");
      url.searchParams.set("utm_source", params.utmSource);
      url.searchParams.set("utm_medium", params.utmMedium);
      url.searchParams.set("utm_campaign", params.utmCampaign);
      if (params.utmTerm) url.searchParams.set("utm_term", params.utmTerm);
      if (params.utmContent) url.searchParams.set("utm_content", params.utmContent);
      return url.toString();
    },
    async validate(url) {
      await delay(140);
      const issues: string[] = [];
      try {
        const parsed = new URL(url, "https://riscozero.com.br");
        if (!parsed.searchParams.get("utm_source")) issues.push("Parâmetro utm_source ausente.");
        if (!parsed.searchParams.get("utm_medium")) issues.push("Parâmetro utm_medium ausente.");
        if (!parsed.searchParams.get("utm_campaign")) issues.push("Parâmetro utm_campaign ausente.");
      } catch {
        issues.push("URL inválida.");
      }
      return { valid: issues.length === 0, issues };
    },
    async normalize(url) {
      await delay(120);
      try {
        const parsed = new URL(url, "https://riscozero.com.br");
        parsed.searchParams.forEach((value, key) => {
          if (key.startsWith("utm_")) parsed.searchParams.set(key, value.trim().toLowerCase().replace(/\s+/g, "_"));
        });
        return parsed.toString();
      } catch {
        throw new ApiError("validacao", "Informe uma URL válida para normalizar.");
      }
    },
    async history() {
      await delay(220);
      return clone(MOCK_UTM_HISTORY);
    },
    async presets() {
      await delay(180);
      return clone(utmPresets);
    },
    async savePreset(preset) {
      await delay(260);
      const created: UtmPreset = { ...preset, id: `utm-preset-${Date.now()}`, createdAt: new Date().toISOString() };
      utmPresets.unshift(created);
      return created;
    },
  },

  events: {
    async list(filters) {
      await delay(360);
      const filtered = MOCK_TRACKING_EVENTS.filter((e) => {
        if (filters.channel && filters.channel !== "todos" && e.channel !== filters.channel) return false;
        if (filters.from && e.occurredAt < filters.from) return false;
        if (filters.to && e.occurredAt > filters.to) return false;
        if (filters.landingPage && e.landingPage !== filters.landingPage) return false;
        return true;
      });
      return paginate(filtered, filters);
    },
    async diagnostics() {
      await delay(240);
      const map = new Map<DiagnosticIssue, number>();
      MOCK_TRACKING_EVENTS.forEach((e) => {
        e.issues.forEach((issue) => map.set(issue, (map.get(issue) ?? 0) + 1));
      });
      return [...map.entries()].map(([issue, count]) => ({ issue, count }));
    },
  },

  creatives: {
    async list(filters) {
      await delay(300);
      return MOCK_CREATIVES.filter((c) => {
        if (filters.channel && filters.channel !== "todos" && c.channel !== filters.channel) return false;
        if (filters.campaignId) {
          const campaign = campaigns.find((camp) => camp.id === filters.campaignId);
          if (campaign && c.campaign !== campaign.name) return false;
        }
        return true;
      });
    },
    async getById(id) {
      await delay(200);
      const creative = MOCK_CREATIVES.find((c) => c.id === id);
      if (!creative) throw new ApiError("nao_encontrado", "Criativo não encontrado.", 404);
      return creative;
    },
  },

  experiments: {
    async list() {
      await delay(260);
      return clone(MOCK_EXPERIMENTS);
    },
    async getById(id) {
      await delay(180);
      const experiment = MOCK_EXPERIMENTS.find((e) => e.id === id);
      if (!experiment) throw new ApiError("nao_encontrado", "Experimento não encontrado.", 404);
      return experiment;
    },
  },

  mediaIntegrations: {
    async list() {
      await delay(200);
      return clone(MOCK_MEDIA_INTEGRATIONS);
    },
  },

  trafficReports: {
    async list() {
      await delay(220);
      return clone(reports);
    },
    async generate(title, filters) {
      await delay(600);
      const report: TrafficReport = {
        id: `report-${Date.now()}`,
        title,
        description: "Relatório gerado a partir dos dados de aquisição e tráfego filtrados.",
        generatedAt: new Date().toISOString(),
        periodStart: filters.from ?? new Date(Date.now() - 30 * 86400000).toISOString(),
        periodEnd: filters.to ?? new Date().toISOString(),
        format: "pdf",
      };
      reports.unshift(report);
      return report;
    },
  },
};
