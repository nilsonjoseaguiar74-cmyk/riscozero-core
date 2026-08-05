import type {
  Activity,
  AppSettings,
  AuditEntry,
  AuthUser,
  Campaign,
  CampaignDetail,
  CreateActivityRequest,
  CreateLeadRequest,
  CreateTaskRequest,
  DashboardOverview,
  AnalyticsFilters,
  FeatureFlag,
  Integration,
  Lead,
  LeadFilters,
  LeadStage,
  PaginatedResponse,
  ReportTable,
  RoleDefinition,
  ServiceStatus,
  Session,
  Task,
  TrackingContext,
  TrackingEvent,
  UpdateLeadRequest,
  UserRole,
  WebhookLog,
} from "@/types";

export interface AuthService {
  signIn(email: string, password: string): Promise<Session>;
  signOut(): Promise<void>;
  currentSession(): Promise<Session | null>;
  requestPasswordReset(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
  verifyAccessCode(code: string): Promise<void>;
  switchDemoRole(role: UserRole): Promise<Session>;
}

export interface LeadsService {
  list(filters: LeadFilters): Promise<PaginatedResponse<Lead>>;
  getById(id: string): Promise<Lead>;
  create(payload: CreateLeadRequest): Promise<Lead>;
  update(id: string, payload: UpdateLeadRequest): Promise<Lead>;
  assign(id: string, userId: string): Promise<Lead>;
  changeStage(id: string, stage: LeadStage): Promise<Lead>;
  addActivity(id: string, payload: CreateActivityRequest): Promise<Activity>;
  exportCsv(filters: LeadFilters): Promise<string>;
}

export interface ActivitiesService {
  listByLead(leadId: string): Promise<Activity[]>;
  listRecent(limit?: number): Promise<Activity[]>;
}

export interface TasksService {
  listByLead(leadId: string): Promise<Task[]>;
  list(): Promise<Task[]>;
  create(payload: CreateTaskRequest): Promise<Task>;
  complete(id: string): Promise<Task>;
}

export interface AnalyticsService {
  overview(filters: AnalyticsFilters): Promise<DashboardOverview>;
  report(kind: string, filters: AnalyticsFilters): Promise<ReportTable>;
}

export interface CampaignsService {
  list(): Promise<Campaign[]>;
  getById(id: string): Promise<CampaignDetail>;
}

export interface IntegrationsService {
  list(): Promise<Integration[]>;
  getById(id: string): Promise<Integration>;
  requestConfiguration(id: string): Promise<Integration>;
  webhookLogs(): Promise<WebhookLog[]>;
  resendWebhook(id: string): Promise<WebhookLog>;
  featureFlags(): Promise<FeatureFlag[]>;
  toggleFeatureFlag(key: string, enabled: boolean): Promise<FeatureFlag>;
  serviceStatus(): Promise<ServiceStatus[]>;
}

export interface UsersService {
  list(): Promise<AuthUser[]>;
  getById(id: string): Promise<AuthUser>;
  invite(email: string, role: UserRole): Promise<AuthUser>;
  update(id: string, payload: Partial<AuthUser>): Promise<AuthUser>;
  setStatus(id: string, status: AuthUser["status"]): Promise<AuthUser>;
  roles(): Promise<RoleDefinition[]>;
}

export interface AuditService {
  list(search?: string): Promise<AuditEntry[]>;
}

export interface SettingsService {
  get(): Promise<AppSettings>;
  update(payload: Partial<AppSettings>): Promise<AppSettings>;
}

export interface TrackingService {
  capture(): TrackingContext;
  track(event: TrackingEvent["name"], payload?: TrackingEvent["payload"]): void;
  history(): TrackingEvent[];
}

export interface ServiceRegistry {
  auth: AuthService;
  leads: LeadsService;
  activities: ActivitiesService;
  tasks: TasksService;
  analytics: AnalyticsService;
  campaigns: CampaignsService;
  integrations: IntegrationsService;
  users: UsersService;
  audit: AuditService;
  settings: SettingsService;
}
