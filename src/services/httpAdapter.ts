import { httpRequest, setAccessToken } from "@/services/http";
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
    async signIn(email, password) {
      const session = await httpRequest<Session>("/auth/sign-in", {
        method: "POST",
        body: { email, password },
      });
      setAccessToken(session.token);
      return session;
    },
    async signOut() {
      await httpRequest<void>("/auth/sign-out", { method: "POST" });
      setAccessToken(null);
    },
    async currentSession() {
      try {
        const session = await httpRequest<Session>("/auth/refresh", { method: "POST" });
        setAccessToken(session.token);
        return session;
      } catch {
        setAccessToken(null);
        return null;
      }
    },
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
    updateUnitSection: (payload) =>
      httpRequest<UnitSectionContent>("/site-content/unit", { method: "PATCH", body: payload }),
    getTestimonials: () => httpRequest<SiteTestimonial[]>("/site-content/testimonials"),
    createTestimonial: (payload) =>
      httpRequest<SiteTestimonial>("/site-content/testimonials", { method: "POST", body: payload }),
    updateTestimonial: (id, payload) =>
      httpRequest<SiteTestimonial>(`/site-content/testimonials/${id}`, {
        method: "PATCH",
        body: payload,
      }),
    deleteTestimonial: (id) =>
      httpRequest<void>(`/site-content/testimonials/${id}`, { method: "DELETE" }),
    reorderTestimonials: (items) =>
      httpRequest<SiteTestimonial[]>("/site-content/testimonials/order", {
        method: "PATCH",
        body: { items },
      }),
    setTestimonialAvatar: (id, file) => {
      const body = new FormData();
      body.append("file", file);
      return httpRequest<SiteTestimonial>(`/site-content/testimonials/${id}/avatar`, {
        method: "POST",
        body,
      });
    },
    createMedia: (payload, file) => {
      const body = new FormData();
      body.append("file", file);
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined) body.append(key, String(value));
      });
      return httpRequest(`/site-content/media`, { method: "POST", body });
    },
    updateMedia: (id, payload) =>
      httpRequest(`/site-content/media/${id}`, { method: "PATCH", body: payload }),
    deleteMedia: (id) => httpRequest<void>(`/site-content/media/${id}`, { method: "DELETE" }),
    reorderMedia: (items) =>
      httpRequest("/site-content/media/order", { method: "PATCH", body: { items } }),
    setPrimaryMedia: (id) => httpRequest(`/site-content/media/${id}/primary`, { method: "PATCH" }),
  },
};
