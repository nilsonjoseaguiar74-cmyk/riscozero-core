/** Adaptador HTTP (preparado para backend NestJS) do domínio de Aquisição e Tráfego. */

import { httpRequest } from "@/services/http";
import type { TrafficServiceRegistry } from "@/services/traffic.contracts";
import type { PaginatedResponse } from "@/types";
import type {
  Ad,
  AdAccount,
  AdSet,
  AttributionResult,
  AttributionSettings,
  ChannelPerformance,
  ConversionRow,
  CostRow,
  Creative,
  DiagnosticIssue,
  Experiment,
  LandingPagePerformance,
  LeadJourney,
  MediaIntegrationCard,
  TrackingEventRow,
  TrafficCampaign,
  TrafficCampaignDetail,
  TrafficDashboard,
  TrafficFilters,
  TrafficReport,
  UtmHistoryEntry,
  UtmPreset,
} from "@/types/traffic";

const query = (filters: TrafficFilters): Record<string, string | number | boolean | undefined> => ({
  from: filters.from,
  to: filters.to,
  channel: filters.channel,
  accountId: filters.accountId,
  campaignId: filters.campaignId,
  adSetId: filters.adSetId,
  adId: filters.adId,
  city: filters.city,
  device: filters.device,
  landingPage: filters.landingPage,
  ownerId: filters.ownerId,
  page: filters.page,
  pageSize: filters.pageSize,
  sortBy: filters.sortBy,
  sortDir: filters.sortDir,
});

export const trafficHttp: TrafficServiceRegistry = {
  trafficAnalytics: {
    overview: (filters) =>
      httpRequest<TrafficDashboard>("traffic/overview", { query: query(filters) }),
    byChannel: (filters) =>
      httpRequest<ChannelPerformance[]>("traffic/by-channel", { query: query(filters) }),
  },

  trafficCampaigns: {
    listAccounts: () => httpRequest<AdAccount[]>("traffic/accounts"),
    list: (filters) =>
      httpRequest<PaginatedResponse<TrafficCampaign>>("traffic/campaigns", {
        query: query(filters),
      }),
    getById: (id) => httpRequest<TrafficCampaignDetail>(`traffic/campaigns/${id}`),
    listAdSets: (campaignId) => httpRequest<AdSet[]>(`traffic/campaigns/${campaignId}/ad-sets`),
    listAds: (adSetId) => httpRequest<Ad[]>(`traffic/ad-sets/${adSetId}/ads`),
  },

  attribution: {
    getSettings: () => httpRequest<AttributionSettings>("traffic/attribution/settings"),
    updateSettings: (payload) =>
      httpRequest<AttributionSettings>("traffic/attribution/settings", {
        method: "PATCH",
        body: payload,
      }),
    calculate: (filters) =>
      httpRequest<AttributionResult>("traffic/attribution/calculate", { query: query(filters) }),
    journeys: (filters) =>
      httpRequest<LeadJourney[]>("traffic/attribution/journeys", { query: query(filters) }),
    journeyByLead: (leadId) =>
      httpRequest<LeadJourney | null>(`traffic/attribution/journeys/${leadId}`),
  },

  landingAnalytics: {
    list: (filters) =>
      httpRequest<LandingPagePerformance[]>("traffic/landing-pages", { query: query(filters) }),
    getByPath: (path) =>
      httpRequest<LandingPagePerformance | null>("traffic/landing-pages/by-path", {
        query: { path },
      }),
  },

  conversions: {
    list: (filters) =>
      httpRequest<PaginatedResponse<ConversionRow>>("traffic/conversions", {
        query: query(filters),
      }),
  },

  costs: {
    list: (filters) =>
      httpRequest<PaginatedResponse<CostRow>>("traffic/costs", { query: query(filters) }),
    exportCsv: (filters) => httpRequest<string>("traffic/costs/export", { query: query(filters) }),
  },

  utm: {
    build: (params) => httpRequest<string>("traffic/utm/build", { method: "POST", body: params }),
    validate: (url) => httpRequest("traffic/utm/validate", { method: "POST", body: { url } }),
    normalize: (url) =>
      httpRequest<string>("traffic/utm/normalize", { method: "POST", body: { url } }),
    history: () => httpRequest<UtmHistoryEntry[]>("traffic/utm/history"),
    presets: () => httpRequest<UtmPreset[]>("traffic/utm/presets"),
    savePreset: (preset) =>
      httpRequest<UtmPreset>("traffic/utm/presets", { method: "POST", body: preset }),
  },

  events: {
    list: (filters) =>
      httpRequest<PaginatedResponse<TrackingEventRow>>("traffic/events", { query: query(filters) }),
    diagnostics: () =>
      httpRequest<{ issue: DiagnosticIssue; count: number }[]>("traffic/events/diagnostics"),
  },

  creatives: {
    list: (filters) => httpRequest<Creative[]>("traffic/creatives", { query: query(filters) }),
    getById: (id) => httpRequest<Creative>(`traffic/creatives/${id}`),
  },

  experiments: {
    list: () => httpRequest<Experiment[]>("traffic/experiments"),
    getById: (id) => httpRequest<Experiment>(`traffic/experiments/${id}`),
  },

  mediaIntegrations: {
    list: () => httpRequest<MediaIntegrationCard[]>("traffic/media-integrations"),
  },

  trafficReports: {
    list: () => httpRequest<TrafficReport[]>("traffic/reports"),
    generate: (title, filters) =>
      httpRequest<TrafficReport>("traffic/reports", { method: "POST", body: { title, filters } }),
  },
};
