import { httpRequest } from "@/services/http";
import type { ServiceRegistry } from "@/services/contracts";
import type {
  Activity,
  AppSettings,
  AuditEntry,
  AuthUser,
  Campaign,
  CampaignDetail,
  DashboardOverview,
  FeatureFlag,
  Integration,
  Lead,
  PaginatedResponse,
  ReportTable,
  RoleDefinition,
  ServiceStatus,
  Session,
  Task,
  WebhookLog,
  SiteTestimonial,
  UnitSectionContent,
} from "@/types";

/**
 * Adaptador preparado para a API REST que será construída em NestJS.
 * Mantém exatamente os mesmos contratos do MockAdapter, permitindo a troca
 * por configuração (VITE_USE_MOCK_API) sem alterar páginas ou componentes.
 */
export const httpAdapter: ServiceRegistry = {
  auth: {
    signIn: (email, password) =>
      httpRequest<Session>("/auth/sign-in", { method: "POST", body: { email, password } }),
    signOut: () => httpRequest<void>("/auth/sign-out", { method: "POST" }),
    currentSession: () => httpRequest<Session | null>("/auth/session"),
    requestPasswordReset: (email) =>
      httpRequest<void>("/auth/password-reset", { method: "POST", body: { email } }),
    resetPassword: (token, password) =>
      httpRequest<void>("/auth/password-reset/confirm", {
        method: "POST",
        body: { token, password },
      }),
    verifyAccessCode: (code) =>
      httpRequest<void>("/auth/verify", { method: "POST", body: { code } }),
    switchDemoRole: (role) =>
      httpRequest<Session>("/auth/demo-role", { method: "POST", body: { role } }),
  },

  leads: {
    list: (filters) =>
      httpRequest<PaginatedResponse<Lead>>("/leads", {
        query: filters as Record<string, string | number | boolean | undefined>,
      }),
    getById: (id) => httpRequest<Lead>(`/leads/${id}`),
    create: (payload) => httpRequest<Lead>("/leads", { method: "POST", body: payload }),
    update: (id, payload) => httpRequest<Lead>(`/leads/${id}`, { method: "PATCH", body: payload }),
    assign: (id, userId) =>
      httpRequest<Lead>(`/leads/${id}/assign`, { method: "PATCH", body: { userId } }),
    changeStage: (id, stage) =>
      httpRequest<Lead>(`/leads/${id}/stage`, { method: "PATCH", body: { stage } }),
    addActivity: (id, payload) =>
      httpRequest<Activity>(`/leads/${id}/activities`, { method: "POST", body: payload }),
    exportCsv: (filters) =>
      httpRequest<string>("/leads/export", {
        query: filters as Record<string, string | number | boolean | undefined>,
      }),
  },

  activities: {
    listByLead: (leadId) => httpRequest<Activity[]>(`/leads/${leadId}/activities`),
    listRecent: (limit) => httpRequest<Activity[]>("/activities", { query: { limit } }),
  },

  tasks: {
    listByLead: (leadId) => httpRequest<Task[]>(`/leads/${leadId}/tasks`),
    list: () => httpRequest<Task[]>("/tasks"),
    create: (payload) => httpRequest<Task>("/tasks", { method: "POST", body: payload }),
    complete: (id) => httpRequest<Task>(`/tasks/${id}/complete`, { method: "PATCH" }),
  },

  analytics: {
    overview: (filters) =>
      httpRequest<DashboardOverview>("/analytics/overview", {
        query: filters as Record<string, string | number | boolean | undefined>,
      }),
    report: (kind, filters) =>
      httpRequest<ReportTable>(`/analytics/reports/${kind}`, {
        query: filters as Record<string, string | number | boolean | undefined>,
      }),
  },

  campaigns: {
    list: () => httpRequest<Campaign[]>("/campaigns"),
    getById: (id) => httpRequest<CampaignDetail>(`/campaigns/${id}`),
  },

  integrations: {
    list: () => httpRequest<Integration[]>("/integrations"),
    getById: (id) => httpRequest<Integration>(`/integrations/${id}`),
    requestConfiguration: (id) =>
      httpRequest<Integration>(`/integrations/${id}/request-configuration`, { method: "POST" }),
    webhookLogs: () => httpRequest<WebhookLog[]>("/integrations/webhooks/logs"),
    resendWebhook: (id) =>
      httpRequest<WebhookLog>(`/integrations/webhooks/logs/${id}/resend`, { method: "POST" }),
    featureFlags: () => httpRequest<FeatureFlag[]>("/feature-flags"),
    toggleFeatureFlag: (key, enabled) =>
      httpRequest<FeatureFlag>(`/feature-flags/${key}`, { method: "PATCH", body: { enabled } }),
    serviceStatus: () => httpRequest<ServiceStatus[]>("/status"),
  },

  users: {
    list: () => httpRequest<AuthUser[]>("/users"),
    getById: (id) => httpRequest<AuthUser>(`/users/${id}`),
    invite: (email, role) =>
      httpRequest<AuthUser>("/users/invite", { method: "POST", body: { email, role } }),
    update: (id, payload) =>
      httpRequest<AuthUser>(`/users/${id}`, { method: "PATCH", body: payload }),
    setStatus: (id, status) =>
      httpRequest<AuthUser>(`/users/${id}/status`, { method: "PATCH", body: { status } }),
    roles: () => httpRequest<RoleDefinition[]>("/roles"),
  },

  audit: {
    list: (search) => httpRequest<AuditEntry[]>("/audit", { query: { search } }),
  },

  settings: {
    get: () => httpRequest<AppSettings>("/settings"),
    update: (payload) => httpRequest<AppSettings>("/settings", { method: "PATCH", body: payload }),
  },

  siteContent: {
    getUnitSection: () => httpRequest<UnitSectionContent>("/site-content/unit"),
    getTestimonials: () => httpRequest<SiteTestimonial[]>("/site-content/testimonials"),
  },
};
