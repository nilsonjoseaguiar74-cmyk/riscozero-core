/** Tipos do domínio de Aquisição e Tráfego (mockado, somente leitura de campanhas). */

import type { MetricSummary, SeriesPoint, TrackingEventName } from "@/types";

export type TrafficChannel = "google_ads" | "meta_ads";

export const TRAFFIC_CHANNEL_LABEL: Record<TrafficChannel, string> = {
  google_ads: "Google Ads",
  meta_ads: "Meta Ads",
};

export type CampaignStatus = "ativa" | "pausada" | "encerrada";

export const CAMPAIGN_STATUS_LABEL: Record<CampaignStatus, string> = {
  ativa: "Ativa",
  pausada: "Pausada",
  encerrada: "Encerrada",
};

export type CampaignObjective =
  | "geracao_leads"
  | "trafego"
  | "reconhecimento"
  | "conversao"
  | "remarketing";

export const CAMPAIGN_OBJECTIVE_LABEL: Record<CampaignObjective, string> = {
  geracao_leads: "Geração de leads",
  trafego: "Tráfego",
  reconhecimento: "Reconhecimento",
  conversao: "Conversão",
  remarketing: "Remarketing",
};

export type DeviceType = "desktop" | "tablet" | "mobile";

export const DEVICE_TYPE_LABEL: Record<DeviceType, string> = {
  desktop: "Computador",
  tablet: "Tablet",
  mobile: "Celular",
};

export interface TrafficFilters {
  from?: string | undefined;
  to?: string | undefined;
  channel?: TrafficChannel | "todos" | undefined;
  accountId?: string | undefined;
  campaignId?: string | undefined;
  adSetId?: string | undefined;
  adId?: string | undefined;
  city?: string | undefined;
  device?: DeviceType | "todos" | undefined;
  landingPage?: string | undefined;
  ownerId?: string | undefined;
  page?: number | undefined;
  pageSize?: number | undefined;
  sortBy?: string | undefined;
  sortDir?: "asc" | "desc" | undefined;
}

export interface TrafficDashboard {
  metrics: MetricSummary[];
  investmentOverTime: SeriesPoint[];
  impressionsOverTime: SeriesPoint[];
  clicksOverTime: SeriesPoint[];
  sessionsOverTime: SeriesPoint[];
  leadsOverTime: SeriesPoint[];
  qualifiedLeadsOverTime: SeriesPoint[];
  adhesionsOverTime: SeriesPoint[];
  cplOverTime: SeriesPoint[];
  cpaOverTime: SeriesPoint[];
  roasOverTime: SeriesPoint[];
  investmentByChannel: SeriesPoint[];
  leadsByChannel: SeriesPoint[];
  leadsByCampaign: SeriesPoint[];
  leadsByCity: SeriesPoint[];
  leadsByDevice: SeriesPoint[];
  funnel: SeriesPoint[];
}

export interface AdAccount {
  id: string;
  channel: TrafficChannel;
  name: string;
  currency: string;
  timezone: string;
  status: "ativa" | "pausada";
  dailyBudget: number;
  connectedAt: string;
}

export interface TrafficCampaign {
  id: string;
  channel: TrafficChannel;
  accountId: string;
  accountName: string;
  name: string;
  status: CampaignStatus;
  objective: CampaignObjective;
  budget: number;
  investment: number;
  impressions: number;
  reach: number;
  clicks: number;
  sessions: number;
  leads: number;
  qualifiedLeads: number;
  cpl: number;
  adhesions: number;
  cpa: number;
  attributedRevenue: number;
  roas: number;
  updatedAt: string;
}

export interface AdSet {
  id: string;
  campaignId: string;
  name: string;
  status: CampaignStatus;
  budget: number;
  investment: number;
  clicks: number;
  leads: number;
  targeting: string;
}

export interface Ad {
  id: string;
  adSetId: string;
  campaignId: string;
  name: string;
  status: CampaignStatus;
  format: string;
  investment: number;
  clicks: number;
  leads: number;
  ctr: number;
}

export interface CampaignDailyPoint {
  date: string;
  investment: number;
  impressions: number;
  clicks: number;
  sessions: number;
  leads: number;
  qualifiedLeads: number;
  adhesions: number;
  revenue: number;
}

export interface TrafficCampaignDetail extends TrafficCampaign {
  daily: CampaignDailyPoint[];
  funnel: SeriesPoint[];
  byDevice: SeriesPoint[];
  byLandingPage: SeriesPoint[];
  adSets: AdSet[];
  ads: Ad[];
}

export interface ChannelPerformance {
  channel: TrafficChannel;
  investment: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  leads: number;
  cpl: number;
  adhesions: number;
  cpa: number;
  revenue: number;
  roas: number;
}

export type AttributionModel =
  | "primeiro_contato"
  | "ultimo_contato"
  | "linear"
  | "posicao"
  | "configuravel";

export const ATTRIBUTION_MODEL_LABEL: Record<AttributionModel, string> = {
  primeiro_contato: "Primeiro contato",
  ultimo_contato: "Último contato",
  linear: "Linear",
  posicao: "Baseado em posição",
  configuravel: "Configurável",
};

export interface AttributionSettings {
  model: AttributionModel;
  windowDays: number;
  firstTouchWeight?: number | undefined;
  lastTouchWeight?: number | undefined;
  middleWeight?: number | undefined;
}

export interface AttributionResult {
  model: AttributionModel;
  byChannel: SeriesPoint[];
  byCampaign: SeriesPoint[];
  totalRevenue: number;
  totalAdhesions: number;
}

export interface TouchPoint {
  occurredAt: string;
  channel: TrafficChannel | "organico" | "direto" | "indicacao";
  campaign?: string | undefined;
  utmSource?: string | undefined;
  utmMedium?: string | undefined;
  utmCampaign?: string | undefined;
  utmTerm?: string | undefined;
  utmContent?: string | undefined;
  gclid?: string | undefined;
  fbclid?: string | undefined;
  landingPage?: string | undefined;
}

export interface LeadJourney {
  leadId: string;
  leadName: string;
  touchpoints: TouchPoint[];
  convertedAt?: string | undefined;
  attributedChannel: string;
}

export interface LandingPagePerformance {
  path: string;
  title: string;
  sessions: number;
  formsStarted: number;
  leads: number;
  conversionRate: number;
  whatsappClicks: number;
  abandonmentRate: number;
  topDevice: DeviceType;
  topSource: string;
  topCampaign?: string | undefined;
  topCta: string;
}

export interface ConversionRow {
  id: string;
  date: string;
  channel: TrafficChannel;
  campaign: string;
  landingPage: string;
  event: TrackingEventName;
  leadName: string;
  value?: number | undefined;
}

export interface CostRow {
  id: string;
  date: string;
  channel: TrafficChannel;
  accountName: string;
  campaign: string;
  investment: number;
  clicks: number;
  cpc: number;
  leads: number;
  cpl: number;
}

export interface UtmPreset {
  id: string;
  name: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm?: string | undefined;
  utmContent?: string | undefined;
  createdAt: string;
}

export interface UtmHistoryEntry {
  id: string;
  url: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm?: string | undefined;
  utmContent?: string | undefined;
  createdAt: string;
  authorName: string;
}

export interface TrackingEventRow {
  id: string;
  name: TrackingEventName;
  occurredAt: string;
  landingPage: string;
  channel: TrafficChannel | "organico" | "direto" | "indicacao";
  campaign?: string | undefined;
  utmSource?: string | undefined;
  utmMedium?: string | undefined;
  gclid?: string | undefined;
  fbclid?: string | undefined;
  deviceType: DeviceType;
  issues: DiagnosticIssue[];
}

export type DiagnosticIssue =
  | "utm_ausente"
  | "identificador_duplicado"
  | "origem_desconhecida"
  | "falha_associacao"
  | "conversao_sem_campanha"
  | "parametros_incompletos";

export const DIAGNOSTIC_ISSUE_LABEL: Record<DiagnosticIssue, string> = {
  utm_ausente: "UTM ausente",
  identificador_duplicado: "Identificador de clique duplicado",
  origem_desconhecida: "Origem desconhecida",
  falha_associacao: "Falha de associação com lead",
  conversao_sem_campanha: "Conversão sem campanha vinculada",
  parametros_incompletos: "Parâmetros de rastreamento incompletos",
};

export type CreativeFormat = "imagem" | "video" | "carrossel" | "texto";

export const CREATIVE_FORMAT_LABEL: Record<CreativeFormat, string> = {
  imagem: "Imagem",
  video: "Vídeo",
  carrossel: "Carrossel",
  texto: "Somente texto",
};

export type CreativeStatus = "ativo" | "pausado" | "em_analise" | "reprovado";

export const CREATIVE_STATUS_LABEL: Record<CreativeStatus, string> = {
  ativo: "Ativo",
  pausado: "Pausado",
  em_analise: "Em análise",
  reprovado: "Reprovado",
};

export interface Creative {
  id: string;
  name: string;
  channel: TrafficChannel;
  format: CreativeFormat;
  campaign: string;
  message: string;
  cta: string;
  status: CreativeStatus;
  periodStart: string;
  periodEnd?: string | undefined;
  impressions: number;
  clicks: number;
  ctr: number;
  leads: number;
  cpl: number;
  notes?: string | undefined;
  version: number;
}

export type ExperimentStatus = "planejado" | "em_andamento" | "concluido" | "pausado";

export const EXPERIMENT_STATUS_LABEL: Record<ExperimentStatus, string> = {
  planejado: "Planejado",
  em_andamento: "Em andamento",
  concluido: "Concluído",
  pausado: "Pausado",
};

export interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  page: string;
  variable: string;
  variantA: string;
  variantB: string;
  primaryMetric: string;
  periodStart: string;
  periodEnd?: string | undefined;
  status: ExperimentStatus;
  result?: string | undefined;
  variantAConversion?: number | undefined;
  variantBConversion?: number | undefined;
  winner?: "A" | "B" | "inconclusivo" | undefined;
}

export interface MediaIntegrationCard {
  id: string;
  channel: TrafficChannel;
  name: string;
  status: "conectada" | "aguardando_configuracao" | "erro" | "sincronizando";
  lastSyncAt?: string | undefined;
  accountsConnected: number;
  notes?: string | undefined;
}

export interface TrafficReport {
  id: string;
  title: string;
  description: string;
  generatedAt: string;
  periodStart: string;
  periodEnd: string;
  format: "pdf" | "csv" | "xlsx";
}
