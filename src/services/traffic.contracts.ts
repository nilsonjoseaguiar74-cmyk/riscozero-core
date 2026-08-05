/** Contratos de serviço do domínio de Aquisição e Tráfego (somente leitura para campanhas externas). */

import type { PaginatedResponse } from "@/types";
import type {
  Ad,
  AdAccount,
  AdSet,
  AttributionResult,
  AttributionSettings,
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

export interface TrafficAnalyticsService {
  overview(filters: TrafficFilters): Promise<TrafficDashboard>;
  byChannel(filters: TrafficFilters): Promise<import("@/types/traffic").ChannelPerformance[]>;
}

/** Serviço analítico e somente leitura: nunca altera campanhas nas plataformas externas. */
export interface TrafficCampaignsService {
  listAccounts(): Promise<AdAccount[]>;
  list(filters: TrafficFilters): Promise<PaginatedResponse<TrafficCampaign>>;
  getById(id: string): Promise<TrafficCampaignDetail>;
  listAdSets(campaignId: string): Promise<AdSet[]>;
  listAds(adSetId: string): Promise<Ad[]>;
}

export interface AttributionService {
  getSettings(): Promise<AttributionSettings>;
  updateSettings(payload: Partial<AttributionSettings>): Promise<AttributionSettings>;
  calculate(filters: TrafficFilters): Promise<AttributionResult>;
  journeys(filters: TrafficFilters): Promise<LeadJourney[]>;
  journeyByLead(leadId: string): Promise<LeadJourney | null>;
}

export interface LandingAnalyticsService {
  list(filters: TrafficFilters): Promise<LandingPagePerformance[]>;
  getByPath(path: string): Promise<LandingPagePerformance | null>;
}

export interface ConversionsService {
  list(filters: TrafficFilters): Promise<PaginatedResponse<ConversionRow>>;
}

export interface CostsService {
  list(filters: TrafficFilters): Promise<PaginatedResponse<CostRow>>;
  exportCsv(filters: TrafficFilters): Promise<string>;
}

export interface UtmService {
  build(params: {
    url: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    utmTerm?: string | undefined;
    utmContent?: string | undefined;
  }): Promise<string>;
  validate(url: string): Promise<{ valid: boolean; issues: string[] }>;
  normalize(url: string): Promise<string>;
  history(): Promise<UtmHistoryEntry[]>;
  presets(): Promise<UtmPreset[]>;
  savePreset(preset: Omit<UtmPreset, "id" | "createdAt">): Promise<UtmPreset>;
}

export interface EventsService {
  list(filters: TrafficFilters): Promise<PaginatedResponse<TrackingEventRow>>;
  diagnostics(): Promise<{ issue: DiagnosticIssue; count: number }[]>;
}

export interface CreativesService {
  list(filters: TrafficFilters): Promise<Creative[]>;
  getById(id: string): Promise<Creative>;
}

export interface ExperimentsService {
  list(): Promise<Experiment[]>;
  getById(id: string): Promise<Experiment>;
}

export interface MediaIntegrationsService {
  list(): Promise<MediaIntegrationCard[]>;
}

export interface TrafficReportsService {
  list(): Promise<TrafficReport[]>;
  generate(title: string, filters: TrafficFilters): Promise<TrafficReport>;
}

export interface TrafficServiceRegistry {
  trafficAnalytics: TrafficAnalyticsService;
  trafficCampaigns: TrafficCampaignsService;
  attribution: AttributionService;
  landingAnalytics: LandingAnalyticsService;
  conversions: ConversionsService;
  costs: CostsService;
  utm: UtmService;
  events: EventsService;
  creatives: CreativesService;
  experiments: ExperimentsService;
  mediaIntegrations: MediaIntegrationsService;
  trafficReports: TrafficReportsService;
}
