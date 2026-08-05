/** Contratos de domínio da plataforma Risco Zero. */

export type UUID = string;

export type UserRole =
  | "comercial"
  | "gestor"
  | "gestor_trafego"
  | "desenvolvedor"
  | "administrador";

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  comercial: "Comercial",
  gestor: "Gestor",
  gestor_trafego: "Gestor de tráfego",
  desenvolvedor: "Desenvolvedor",
  administrador: "Administrador",
};

export type Permission =
  | "dashboard.view"
  | "crm.view"
  | "crm.edit"
  | "reports.view"
  | "acquisition.view"
  | "integrations.manage"
  | "users.manage"
  | "audit.view"
  | "settings.manage"
  | "developer.access";

export interface AuthUser {
  id: UUID;
  name: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  avatarUrl?: string | undefined;
  lastAccessAt?: string | undefined;
  status: "ativo" | "inativo" | "convidado";
}

export interface Session {
  user: AuthUser;
  token: string;
  expiresAt: string;
}

export type LeadStage =
  | "novo_contato"
  | "contato_iniciado"
  | "perfil_identificado"
  | "opcoes_apresentadas"
  | "proposta_adesao"
  | "documentacao_pendente"
  | "adesao_concluida"
  | "nao_convertido";

export const LEAD_STAGES: { id: LeadStage; label: string }[] = [
  { id: "novo_contato", label: "Novo contato" },
  { id: "contato_iniciado", label: "Contato iniciado" },
  { id: "perfil_identificado", label: "Perfil identificado" },
  { id: "opcoes_apresentadas", label: "Opções apresentadas" },
  { id: "proposta_adesao", label: "Proposta de adesão" },
  { id: "documentacao_pendente", label: "Documentação pendente" },
  { id: "adesao_concluida", label: "Adesão concluída" },
  { id: "nao_convertido", label: "Não convertido" },
];

export const LEAD_STAGE_LABEL = Object.fromEntries(
  LEAD_STAGES.map((s) => [s.id, s.label]),
) as Record<LeadStage, string>;

export type LossReason =
  | "sem_retorno"
  | "sem_interesse"
  | "valor"
  | "veiculo_fora_perfil"
  | "regiao_nao_atendida"
  | "outra_alternativa"
  | "documentacao_incompleta"
  | "outro";

export const LOSS_REASON_LABEL: Record<LossReason, string> = {
  sem_retorno: "Sem retorno",
  sem_interesse: "Sem interesse",
  valor: "Valor",
  veiculo_fora_perfil: "Veículo fora do perfil",
  regiao_nao_atendida: "Região não atendida",
  outra_alternativa: "Escolheu outra alternativa",
  documentacao_incompleta: "Documentação incompleta",
  outro: "Outro",
};

export type Priority = "baixa" | "media" | "alta";
export type ContactPreference = "whatsapp" | "ligacao" | "qualquer";
export type VehicleType = "carro" | "moto" | "caminhonete" | "utilitario" | "caminhao";

export interface TrackingContext {
  utmSource?: string | undefined;
  utmMedium?: string | undefined;
  utmCampaign?: string | undefined;
  utmTerm?: string | undefined;
  utmContent?: string | undefined;
  referrer?: string | undefined;
  landingPage?: string | undefined;
  gclid?: string | undefined;
  gbraid?: string | undefined;
  wbraid?: string | undefined;
  fbclid?: string | undefined;
  deviceType?: "desktop" | "tablet" | "mobile" | undefined;
  browser?: string | undefined;
  operatingSystem?: string | undefined;
  firstVisitAt?: string | undefined;
  conversionPage?: string | undefined;
  conversionCta?: string | undefined;
  consentVersion?: string | undefined;
}

export interface Lead {
  id: UUID;
  name: string;
  whatsapp: string;
  plate: string;
  city: string;
  vehicleType: VehicleType;
  vehicleYear: string;
  bestTime: string;
  contactPreference: ContactPreference;
  consent: boolean;
  stage: LeadStage;
  priority: Priority;
  ownerId: UUID | null;
  ownerName?: string | undefined;
  source: string;
  campaign?: string | undefined;
  tags: string[];
  lossReason?: LossReason | undefined;
  notes?: string | undefined;
  tracking: TrackingContext;
  createdAt: string;
  updatedAt: string;
  stageChangedAt: string;
}

export interface CreateLeadRequest {
  name: string;
  whatsapp: string;
  plate: string;
  city: string;
  vehicleType: VehicleType;
  vehicleYear: string;
  bestTime: string;
  contactPreference: ContactPreference;
  consent: boolean;
  tracking?: TrackingContext | undefined;
}

export type UpdateLeadRequest = Partial<
  Pick<
    Lead,
    | "name"
    | "whatsapp"
    | "plate"
    | "city"
    | "vehicleType"
    | "vehicleYear"
    | "priority"
    | "tags"
    | "notes"
    | "lossReason"
  >
>;

export interface LeadFilters {
  search?: string | undefined;
  stage?: LeadStage | "todas" | undefined;
  city?: string | undefined;
  source?: string | undefined;
  campaign?: string | undefined;
  ownerId?: string | undefined;
  vehicleType?: VehicleType | "todos" | undefined;
  from?: string | undefined;
  to?: string | undefined;
  page?: number | undefined;
  pageSize?: number | undefined;
  sortBy?: "createdAt" | "updatedAt" | "name" | undefined;
  sortDir?: "asc" | "desc" | undefined;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export type ActivityType =
  | "whatsapp"
  | "ligacao"
  | "mensagem"
  | "observacao"
  | "etapa"
  | "responsavel"
  | "sistema";

export interface Activity {
  id: UUID;
  leadId: UUID;
  type: ActivityType;
  title: string;
  description?: string | undefined;
  authorName: string;
  createdAt: string;
}

export interface CreateActivityRequest {
  type: ActivityType;
  title: string;
  description?: string | undefined;
}

export type TaskStatus = "pendente" | "concluida" | "atrasada";

export interface Task {
  id: UUID;
  leadId: UUID;
  leadName: string;
  title: string;
  dueAt: string;
  status: TaskStatus;
  ownerName: string;
}

export interface CreateTaskRequest {
  leadId: UUID;
  title: string;
  dueAt: string;
}

export interface AnalyticsFilters {
  from?: string | undefined;
  to?: string | undefined;
  city?: string | undefined;
  source?: string | undefined;
  campaign?: string | undefined;
  ownerId?: string | undefined;
  stage?: LeadStage | "todas" | undefined;
  vehicleType?: VehicleType | "todos" | undefined;
}

export interface MetricSummary {
  key: string;
  label: string;
  value: number;
  format: "number" | "percent" | "duration" | "currency";
  deltaPercent: number;
  helper?: string | undefined;
}

export interface SeriesPoint {
  label: string;
  value: number;
  secondary?: number | undefined;
}

export interface DashboardOverview {
  metrics: MetricSummary[];
  leadsOverTime: SeriesPoint[];
  funnel: SeriesPoint[];
  bySource: SeriesPoint[];
  byCampaign: SeriesPoint[];
  byCity: SeriesPoint[];
  byOwner: SeriesPoint[];
  conversionByChannel: SeriesPoint[];
  conversionByDevice: SeriesPoint[];
  lossReasons: SeriesPoint[];
  byHour: SeriesPoint[];
  conversionOverTime: SeriesPoint[];
}

export interface ReportRow {
  id: string;
  [key: string]: string | number;
}

export interface ReportTable {
  title: string;
  columns: { key: string; label: string; format?: "number" | "percent" | "currency" }[];
  rows: ReportRow[];
}

export type CampaignChannel = "google_ads" | "meta_ads";

export interface Campaign {
  id: UUID;
  name: string;
  channel: CampaignChannel;
  status: "ativa" | "pausada" | "encerrada";
  investment: number;
  impressions: number;
  reach: number;
  clicks: number;
  leads: number;
  qualifiedLeads: number;
  adhesions: number;
  attributedRevenue: number;
  updatedAt: string;
}

export interface CampaignDailyPoint {
  date: string;
  investment: number;
  clicks: number;
  leads: number;
  adhesions: number;
}

export interface CampaignDetail extends Campaign {
  daily: CampaignDailyPoint[];
  funnel: SeriesPoint[];
  byDevice: SeriesPoint[];
  byLandingPage: SeriesPoint[];
}

export type IntegrationStatus =
  | "nao_configurada"
  | "aguardando_configuracao"
  | "conectada"
  | "erro"
  | "sincronizando"
  | "acao_necessaria";

export const INTEGRATION_STATUS_LABEL: Record<IntegrationStatus, string> = {
  nao_configurada: "Não configurada",
  aguardando_configuracao: "Aguardando configuração",
  conectada: "Conectada",
  erro: "Erro",
  sincronizando: "Sincronizando",
  acao_necessaria: "Ação necessária",
};

export interface Integration {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
  lastSyncAt?: string | undefined;
  category: "aquisicao" | "atendimento" | "analytics" | "desenvolvedor";
}

export interface WebhookLog {
  id: UUID;
  event: string;
  endpoint: string;
  status: number;
  attempts: number;
  durationMs: number;
  createdAt: string;
  responseBody: string;
}

export interface FeatureFlag {
  key: string;
  label: string;
  enabled: boolean;
  description: string;
}

export interface ServiceStatus {
  name: string;
  status: "operacional" | "degradado" | "indisponivel";
  latencyMs: number;
}

export interface AuditEntry {
  id: UUID;
  userName: string;
  action: string;
  resource: string;
  createdAt: string;
  result: "sucesso" | "falha";
  maskedIp: string;
  device: string;
  before?: string | undefined;
  after?: string | undefined;
}

export interface AppSettings {
  general: {
    companyName: string;
    whatsapp: string;
    address: string;
    serviceHours: string;
    defaultMessage: string;
  };
  commercial: {
    pipeline: string[];
    lossReasons: string[];
    distribution: "round_robin" | "manual" | "por_regiao";
    monthlyGoal: number;
  };
  tracking: {
    utmRequired: boolean;
    consentVersion: string;
    conversionEvents: string[];
  };
  privacy: {
    privacyPolicyUrl: string;
    termsUrl: string;
    cookieBannerEnabled: boolean;
  };
  notifications: {
    newLeadEmail: boolean;
    dailyDigest: boolean;
    taskReminders: boolean;
  };
}

export interface RoleDefinition {
  role: UserRole;
  label: string;
  description: string;
  permissions: Permission[];
}

export type TrackingEventName =
  | "page_view"
  | "form_view"
  | "form_start"
  | "form_submit"
  | "form_success"
  | "form_error"
  | "whatsapp_click"
  | "phone_click"
  | "location_click"
  | "faq_open"
  | "cta_click";

export interface TrackingEvent {
  name: TrackingEventName;
  payload?: Record<string, string | number | boolean | undefined> | undefined;
  occurredAt: string;
}
