import {
  MOCK_ACTIVITIES,
  MOCK_AUDIT,
  MOCK_CAMPAIGNS,
  MOCK_FEATURE_FLAGS,
  MOCK_INTEGRATIONS,
  MOCK_LEADS,
  MOCK_SERVICE_STATUS,
  MOCK_SETTINGS,
  MOCK_TASKS,
  MOCK_USERS,
  MOCK_WEBHOOK_LOGS,
  ROLE_DEFINITIONS,
  permissionsForRole,
} from "@/mocks/data";
import { ApiError } from "@/services/http";
import type { ServiceRegistry } from "@/services/contracts";
import { INITIAL_TESTIMONIALS, INITIAL_UNIT_SECTION } from "@/content/siteContent";
import type {
  Activity,
  AppSettings,
  AuthUser,
  Campaign,
  CampaignDetail,
  DashboardOverview,
  FeatureFlag,
  Integration,
  Lead,
  LeadFilters,
  LeadStage,
  MetricSummary,
  PaginatedResponse,
  ReportTable,
  SeriesPoint,
  Session,
  Task,
  WebhookLog,
} from "@/types";
import { LEAD_STAGES, LEAD_STAGE_LABEL, LOSS_REASON_LABEL } from "@/types";

const delay = (ms = 320) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const leads: Lead[] = clone(MOCK_LEADS);
const activities: Activity[] = clone(MOCK_ACTIVITIES);
const tasks: Task[] = clone(MOCK_TASKS);
const users: AuthUser[] = clone(MOCK_USERS);
const integrations: Integration[] = clone(MOCK_INTEGRATIONS);
const flags: FeatureFlag[] = clone(MOCK_FEATURE_FLAGS);
const webhooks: WebhookLog[] = clone(MOCK_WEBHOOK_LOGS);
let settings: AppSettings = clone(MOCK_SETTINGS);
const unitSectionContent = clone(INITIAL_UNIT_SECTION);
const siteTestimonials = clone(INITIAL_TESTIMONIALS);

const SESSION_KEY = "rz.demo.session";

const buildSession = (user: AuthUser): Session => ({
  user,
  token: `demo.${user.id}.${Date.now()}`,
  expiresAt: new Date(Date.now() + 8 * 3600000).toISOString(),
});

const readStoredSession = (): Session | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
};

const writeStoredSession = (session: Session | null) => {
  if (typeof window === "undefined") return;
  if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else window.localStorage.removeItem(SESSION_KEY);
};

function applyFilters(list: Lead[], filters: LeadFilters): Lead[] {
  const search = filters.search?.trim().toLowerCase();
  return list.filter((lead) => {
    if (search) {
      const haystack =
        `${lead.name} ${lead.plate} ${lead.whatsapp} ${lead.city} ${lead.campaign ?? ""}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    if (filters.stage && filters.stage !== "todas" && lead.stage !== filters.stage) return false;
    if (filters.city && lead.city !== filters.city) return false;
    if (filters.source && lead.source !== filters.source) return false;
    if (filters.campaign && lead.campaign !== filters.campaign) return false;
    if (filters.ownerId && lead.ownerId !== filters.ownerId) return false;
    if (
      filters.vehicleType &&
      filters.vehicleType !== "todos" &&
      lead.vehicleType !== filters.vehicleType
    )
      return false;
    if (filters.from && lead.createdAt < filters.from) return false;
    if (filters.to && lead.createdAt > filters.to) return false;
    return true;
  });
}

const count = (list: Lead[], predicate: (lead: Lead) => boolean) => list.filter(predicate).length;

const STAGE_ORDER = LEAD_STAGES.map((s) => s.id);

const reachedStage = (lead: Lead, stage: LeadStage) => {
  if (lead.stage === "nao_convertido") {
    return STAGE_ORDER.indexOf(stage) <= 1;
  }
  return STAGE_ORDER.indexOf(lead.stage) >= STAGE_ORDER.indexOf(stage);
};

function groupBy(list: Lead[], key: (lead: Lead) => string | undefined): SeriesPoint[] {
  const map = new Map<string, number>();
  list.forEach((lead) => {
    const label = key(lead);
    if (!label) return;
    map.set(label, (map.get(label) ?? 0) + 1);
  });
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}

function overview(filters: Parameters<ServiceRegistry["analytics"]["overview"]>[0]) {
  const filtered = applyFilters(leads, {
    ...filters,
    stage: filters.stage ?? "todas",
    vehicleType: filters.vehicleType ?? "todos",
  });
  const total = filtered.length;
  const adhesions = count(filtered, (l) => l.stage === "adesao_concluida");
  const conversion = total ? (adhesions / total) * 100 : 0;

  const metrics: MetricSummary[] = [
    { key: "leads", label: "Leads recebidos", value: total, format: "number", deltaPercent: 12.4 },
    {
      key: "novos",
      label: "Novos contatos",
      value: count(filtered, (l) => l.stage === "novo_contato"),
      format: "number",
      deltaPercent: 6.1,
    },
    {
      key: "iniciados",
      label: "Contatos iniciados",
      value: count(filtered, (l) => reachedStage(l, "contato_iniciado")),
      format: "number",
      deltaPercent: 4.8,
    },
    {
      key: "opcoes",
      label: "Opções apresentadas",
      value: count(filtered, (l) => reachedStage(l, "opcoes_apresentadas")),
      format: "number",
      deltaPercent: -2.3,
    },
    {
      key: "propostas",
      label: "Propostas de adesão",
      value: count(filtered, (l) => reachedStage(l, "proposta_adesao")),
      format: "number",
      deltaPercent: 9.7,
    },
    {
      key: "adesoes",
      label: "Adesões concluídas",
      value: adhesions,
      format: "number",
      deltaPercent: 14.2,
    },
    {
      key: "conversao",
      label: "Taxa de conversão",
      value: Number(conversion.toFixed(1)),
      format: "percent",
      deltaPercent: 1.9,
    },
    {
      key: "tempo",
      label: "Tempo médio de atendimento",
      value: 41,
      format: "duration",
      deltaPercent: -8.5,
      helper: "Minutos entre o primeiro contato e a apresentação das opções",
    },
  ];

  const days = 14;
  const leadsOverTime: SeriesPoint[] = Array.from({ length: days }, (_, i) => {
    const day = new Date(Date.now() - (days - 1 - i) * 86400000);
    const label = day.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    const value = filtered.filter(
      (l) => new Date(l.createdAt).toDateString() === day.toDateString(),
    ).length;
    return { label, value };
  });

  const funnel: SeriesPoint[] = LEAD_STAGES.filter((s) => s.id !== "nao_convertido").map((s) => ({
    label: s.label,
    value: count(filtered, (l) => reachedStage(l, s.id)),
  }));

  const conversionOverTime: SeriesPoint[] = leadsOverTime.map((point, i) => ({
    label: point.label,
    value: Number((10 + ((i * 7) % 13) + (point.value % 5)).toFixed(1)),
  }));

  const result: DashboardOverview = {
    metrics,
    leadsOverTime,
    funnel,
    bySource: groupBy(filtered, (l) => l.source),
    byCampaign: groupBy(filtered, (l) => l.campaign),
    byCity: groupBy(filtered, (l) => l.city),
    byOwner: groupBy(filtered, (l) => l.ownerName ?? "Sem responsável"),
    conversionByChannel: groupBy(filtered, (l) => l.tracking.utmMedium ?? "direct"),
    conversionByDevice: groupBy(filtered, (l) => l.tracking.deviceType ?? "desconhecido"),
    lossReasons: groupBy(filtered, (l) =>
      l.lossReason ? LOSS_REASON_LABEL[l.lossReason] : undefined,
    ),
    byHour: Array.from({ length: 12 }, (_, i) => {
      const hour = i + 8;
      return {
        label: `${String(hour).padStart(2, "0")}h`,
        value: filtered.filter((l) => new Date(l.createdAt).getHours() === hour).length,
      };
    }),
    conversionOverTime,
  };
  return result;
}

export const mockAdapter: ServiceRegistry = {
  auth: {
    async signIn(email) {
      await delay(500);
      if (!email.includes("@")) throw new ApiError("validacao", "Informe um e-mail válido.");
      const user = users.find((u) => u.email === email) ?? users[0]!;
      const session = buildSession(user);
      writeStoredSession(session);
      return session;
    },
    async signOut() {
      await delay(120);
      writeStoredSession(null);
    },
    async currentSession() {
      await delay(80);
      return readStoredSession();
    },
  },

  leads: {
    async list(filters) {
      await delay();
      const filtered = applyFilters(leads, filters);
      const sortBy = filters.sortBy ?? "createdAt";
      const dir = filters.sortDir === "asc" ? 1 : -1;
      filtered.sort((a, b) => (a[sortBy] > b[sortBy] ? dir : -dir));
      const page = filters.page ?? 1;
      const pageSize = filters.pageSize ?? 20;
      const start = (page - 1) * pageSize;
      const response: PaginatedResponse<Lead> = {
        items: filtered.slice(start, start + pageSize),
        page,
        pageSize,
        total: filtered.length,
        totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
      };
      return response;
    },
    async getById(id) {
      await delay(220);
      const lead = leads.find((l) => l.id === id);
      if (!lead) throw new ApiError("nao_encontrado", "Lead não encontrado.", 404);
      return lead;
    },
    async create(payload) {
      await delay(600);
      const lead: Lead = {
        id: `lead-${Date.now()}`,
        name: payload.name,
        whatsapp: payload.whatsapp,
        plate: payload.plate,
        city: payload.city,
        vehicleType: payload.vehicleType ?? "carro",
        vehicleYear: payload.vehicleYear ?? "",
        bestTime: payload.bestTime ?? "",
        contactPreference: payload.contactPreference ?? "qualquer",
        consent: payload.consent,
        stage: "novo_contato",
        priority: "media",
        ownerId: null,
        source: payload.tracking?.utmSource === "google" ? "Google Ads" : "Site",
        tags: [],
        tracking: payload.tracking ?? {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stageChangedAt: new Date().toISOString(),
      };
      leads.unshift(lead);
      activities.unshift({
        id: `act-${lead.id}-0`,
        leadId: lead.id,
        type: "sistema",
        title: "Solicitação recebida pelo site",
        authorName: "Plataforma",
        createdAt: lead.createdAt,
      });
      return lead;
    },
    async update(id, payload) {
      await delay(300);
      const lead = leads.find((l) => l.id === id);
      if (!lead) throw new ApiError("nao_encontrado", "Lead não encontrado.", 404);
      Object.assign(lead, payload, { updatedAt: new Date().toISOString() });
      return lead;
    },
    async assign(id, userId) {
      await delay(260);
      const lead = leads.find((l) => l.id === id);
      if (!lead) throw new ApiError("nao_encontrado", "Lead não encontrado.", 404);
      const user = users.find((u) => u.id === userId);
      lead.ownerId = userId;
      lead.ownerName = user?.name ?? "Equipe comercial";
      lead.updatedAt = new Date().toISOString();
      activities.unshift({
        id: `act-${id}-${Date.now()}`,
        leadId: id,
        type: "responsavel",
        title: `Responsável alterado para ${lead.ownerName}`,
        authorName: "Plataforma",
        createdAt: lead.updatedAt,
      });
      return lead;
    },
    async changeStage(id, stage) {
      await delay(240);
      const lead = leads.find((l) => l.id === id);
      if (!lead) throw new ApiError("nao_encontrado", "Lead não encontrado.", 404);
      lead.stage = stage;
      lead.stageChangedAt = new Date().toISOString();
      lead.updatedAt = lead.stageChangedAt;
      activities.unshift({
        id: `act-${id}-${Date.now()}`,
        leadId: id,
        type: "etapa",
        title: `Etapa alterada para ${LEAD_STAGE_LABEL[stage]}`,
        authorName: "Plataforma",
        createdAt: lead.updatedAt,
      });
      return lead;
    },
    async addActivity(id, payload) {
      await delay(240);
      const activity: Activity = {
        id: `act-${id}-${Date.now()}`,
        leadId: id,
        type: payload.type,
        title: payload.title,
        ...(payload.description ? { description: payload.description } : {}),
        authorName: "Equipe comercial",
        createdAt: new Date().toISOString(),
      };
      activities.unshift(activity);
      return activity;
    },
    async exportCsv(filters) {
      await delay(700);
      const rows = applyFilters(leads, filters);
      const header = "nome;whatsapp;placa;cidade;etapa;origem;responsavel;criado_em";
      const body = rows
        .map((l) =>
          [
            l.name,
            l.whatsapp,
            l.plate,
            l.city,
            LEAD_STAGE_LABEL[l.stage],
            l.source,
            l.ownerName ?? "",
            l.createdAt,
          ].join(";"),
        )
        .join("\n");
      return `${header}\n${body}`;
    },
  },

  activities: {
    async listByLead(leadId) {
      await delay(200);
      return activities
        .filter((a) => a.leadId === leadId)
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    },
    async listRecent(limit = 20) {
      await delay(220);
      return [...activities].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, limit);
    },
  },

  tasks: {
    async listByLead(leadId) {
      await delay(180);
      return tasks.filter((t) => t.leadId === leadId);
    },
    async list() {
      await delay(260);
      return [...tasks].sort((a, b) => (a.dueAt > b.dueAt ? 1 : -1));
    },
    async create(payload) {
      await delay(280);
      const lead = leads.find((l) => l.id === payload.leadId);
      const task: Task = {
        id: `task-${Date.now()}`,
        leadId: payload.leadId,
        leadName: lead?.name ?? "Lead",
        title: payload.title,
        dueAt: payload.dueAt,
        status: "pendente",
        ownerName: lead?.ownerName ?? "Equipe comercial",
      };
      tasks.unshift(task);
      return task;
    },
    async complete(id) {
      await delay(200);
      const task = tasks.find((t) => t.id === id);
      if (!task) throw new ApiError("nao_encontrado", "Tarefa não encontrada.", 404);
      task.status = "concluida";
      return task;
    },
  },

  analytics: {
    async overview(filters) {
      await delay(420);
      return overview(filters);
    },
    async report(kind, filters) {
      await delay(420);
      const data = overview(filters);
      const tables: Record<string, ReportTable> = {
        commercial: {
          title: "Funil comercial",
          columns: [
            { key: "etapa", label: "Etapa" },
            { key: "leads", label: "Leads", format: "number" },
            { key: "participacao", label: "Participação", format: "percent" },
          ],
          rows: data.funnel.map((row, i) => ({
            id: `f-${i}`,
            etapa: row.label,
            leads: row.value,
            participacao: data.funnel[0]?.value
              ? Number(((row.value / data.funnel[0].value) * 100).toFixed(1))
              : 0,
          })),
        },
        acquisition: {
          title: "Desempenho por origem",
          columns: [
            { key: "origem", label: "Origem" },
            { key: "leads", label: "Leads", format: "number" },
          ],
          rows: data.bySource.map((row, i) => ({
            id: `a-${i}`,
            origem: row.label,
            leads: row.value,
          })),
        },
        productivity: {
          title: "Produtividade por consultor",
          columns: [
            { key: "consultor", label: "Consultor" },
            { key: "leads", label: "Leads em atendimento", format: "number" },
          ],
          rows: data.byOwner.map((row, i) => ({
            id: `p-${i}`,
            consultor: row.label,
            leads: row.value,
          })),
        },
        regional: {
          title: "Distribuição por cidade",
          columns: [
            { key: "cidade", label: "Cidade" },
            { key: "leads", label: "Leads", format: "number" },
          ],
          rows: data.byCity.map((row, i) => ({
            id: `r-${i}`,
            cidade: row.label,
            leads: row.value,
          })),
        },
      };
      const table = tables[kind];
      if (!table) throw new ApiError("nao_encontrado", "Relatório não disponível.", 404);
      return table;
    },
  },

  campaigns: {
    async list() {
      await delay(320);
      return clone(MOCK_CAMPAIGNS);
    },
    async getById(id) {
      await delay(320);
      const campaign: Campaign | undefined = MOCK_CAMPAIGNS.find((c) => c.id === id);
      if (!campaign) throw new ApiError("nao_encontrado", "Campanha não encontrada.", 404);
      const detail: CampaignDetail = {
        ...clone(campaign),
        daily: Array.from({ length: 14 }, (_, i) => {
          const date = new Date(Date.now() - (13 - i) * 86400000);
          return {
            date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
            investment: Math.round(campaign.investment / 14 + ((i * 37) % 90)),
            clicks: Math.round(campaign.clicks / 14 + ((i * 13) % 24)),
            leads: Math.round(campaign.leads / 14 + (i % 4)),
            adhesions: Math.max(0, Math.round(campaign.adhesions / 14) + (i % 2 === 0 ? 1 : 0)),
          };
        }),
        funnel: [
          { label: "Cliques", value: campaign.clicks },
          { label: "Leads", value: campaign.leads },
          { label: "Leads qualificados", value: campaign.qualifiedLeads },
          { label: "Adesões", value: campaign.adhesions },
        ],
        byDevice: [
          { label: "Mobile", value: Math.round(campaign.leads * 0.68) },
          { label: "Desktop", value: Math.round(campaign.leads * 0.24) },
          { label: "Tablet", value: Math.round(campaign.leads * 0.08) },
        ],
        byLandingPage: [
          { label: "/", value: Math.round(campaign.leads * 0.46) },
          { label: "/solicitar-cotacao", value: Math.round(campaign.leads * 0.39) },
          { label: "/beneficios", value: Math.round(campaign.leads * 0.15) },
        ],
      };
      return detail;
    },
  },

  integrations: {
    async list() {
      await delay(260);
      return integrations;
    },
    async getById(id) {
      await delay(200);
      const integration = integrations.find((i) => i.id === id);
      if (!integration) throw new ApiError("nao_encontrado", "Integração não encontrada.", 404);
      return integration;
    },
    async requestConfiguration(id) {
      await delay(500);
      const integration = integrations.find((i) => i.id === id);
      if (!integration) throw new ApiError("nao_encontrado", "Integração não encontrada.", 404);
      integration.status = "aguardando_configuracao";
      return integration;
    },
    async webhookLogs() {
      await delay(240);
      return webhooks;
    },
    async resendWebhook(id) {
      await delay(600);
      const log = webhooks.find((w) => w.id === id);
      if (!log) throw new ApiError("nao_encontrado", "Registro não encontrado.", 404);
      log.attempts += 1;
      log.status = 200;
      log.responseBody = '{"received":true}';
      return log;
    },
    async featureFlags() {
      await delay(180);
      return flags;
    },
    async toggleFeatureFlag(key, enabled) {
      await delay(200);
      const flag = flags.find((f) => f.key === key);
      if (!flag) throw new ApiError("nao_encontrado", "Recurso não encontrado.", 404);
      flag.enabled = enabled;
      return flag;
    },
    async serviceStatus() {
      await delay(220);
      return clone(MOCK_SERVICE_STATUS);
    },
  },

  users: {
    async list() {
      await delay(260);
      return users;
    },
    async getById(id) {
      await delay(200);
      const user = users.find((u) => u.id === id);
      if (!user) throw new ApiError("nao_encontrado", "Usuário não encontrado.", 404);
      return user;
    },
    async invite(email, role) {
      await delay(520);
      const user: AuthUser = {
        id: `u-${Date.now()}`,
        name: email.split("@")[0] ?? "Novo usuário",
        email,
        role,
        permissions: permissionsForRole(role),
        status: "convidado",
      };
      users.push(user);
      return user;
    },
    async update(id, payload) {
      await delay(280);
      const user = users.find((u) => u.id === id);
      if (!user) throw new ApiError("nao_encontrado", "Usuário não encontrado.", 404);
      Object.assign(user, payload);
      if (payload.role) user.permissions = permissionsForRole(payload.role);
      return user;
    },
    async setStatus(id, status) {
      await delay(240);
      const user = users.find((u) => u.id === id);
      if (!user) throw new ApiError("nao_encontrado", "Usuário não encontrado.", 404);
      user.status = status;
      return user;
    },
    async roles() {
      await delay(160);
      return ROLE_DEFINITIONS;
    },
  },

  audit: {
    async list(search) {
      await delay(300);
      if (!search) return MOCK_AUDIT;
      const term = search.toLowerCase();
      return MOCK_AUDIT.filter((entry) =>
        `${entry.userName} ${entry.action} ${entry.resource}`.toLowerCase().includes(term),
      );
    },
  },

  settings: {
    async get() {
      await delay(220);
      return settings;
    },
    async update(payload) {
      await delay(420);
      settings = { ...settings, ...payload };
      return settings;
    },
  },

  siteContent: {
    async getUnitSection() {
      await delay(180);
      return clone(unitSectionContent);
    },
    async getTestimonials() {
      await delay(180);
      return clone(siteTestimonials);
    },
    async updateUnitSection(payload) {
      await delay(250);
      Object.assign(unitSectionContent, payload);
      return clone(unitSectionContent);
    },
    async createTestimonial(payload) {
      await delay(250);
      const item = { id: crypto.randomUUID(), ...payload };
      siteTestimonials.push(item);
      return clone(item);
    },
    async updateTestimonial(id, payload) {
      await delay(250);
      const item = siteTestimonials.find((entry) => entry.id === id);
      if (!item) throw new ApiError("nao_encontrado", "Depoimento não encontrado.", 404);
      Object.assign(item, payload);
      return clone(item);
    },
    async deleteTestimonial(id) {
      await delay(250);
      const index = siteTestimonials.findIndex((entry) => entry.id === id);
      if (index < 0) throw new ApiError("nao_encontrado", "Depoimento não encontrado.", 404);
      siteTestimonials.splice(index, 1);
    },
    async reorderTestimonials(items) {
      items.forEach(({ id, order }) => {
        const item = siteTestimonials.find((entry) => entry.id === id);
        if (item) item.order = order;
      });
      return clone(siteTestimonials);
    },
    async setTestimonialAvatar(id, file) {
      const item = siteTestimonials.find((entry) => entry.id === id);
      if (!item) throw new ApiError("nao_encontrado", "Depoimento não encontrado.", 404);
      item.avatarUrl = URL.createObjectURL(file);
      return clone(item);
    },
    async createMedia(payload, file) {
      const item = {
        id: crypto.randomUUID(),
        section: "unit" as const,
        imageUrl: URL.createObjectURL(file),
        active: true,
        ...payload,
      };
      if (item.position === "primary")
        unitSectionContent.media.forEach((entry) => {
          if (entry.position === "primary") entry.position = "secondary";
        });
      unitSectionContent.media.push(item);
      return clone(item);
    },
    async updateMedia(id, payload) {
      const item = unitSectionContent.media.find((entry) => entry.id === id);
      if (!item) throw new ApiError("nao_encontrado", "Imagem não encontrada.", 404);
      if (payload.position === "primary")
        unitSectionContent.media.forEach((entry) => {
          if (entry.id !== id && entry.position === "primary") entry.position = "secondary";
        });
      Object.assign(item, payload);
      return clone(item);
    },
    async deleteMedia(id) {
      const index = unitSectionContent.media.findIndex((entry) => entry.id === id);
      if (index < 0) throw new ApiError("nao_encontrado", "Imagem não encontrada.", 404);
      unitSectionContent.media.splice(index, 1);
    },
    async reorderMedia(items) {
      items.forEach(({ id, order }) => {
        const item = unitSectionContent.media.find((entry) => entry.id === id);
        if (item) item.order = order;
      });
      return clone(unitSectionContent.media);
    },
    async setPrimaryMedia(id) {
      const item = unitSectionContent.media.find((entry) => entry.id === id);
      if (!item) throw new ApiError("nao_encontrado", "Imagem não encontrada.", 404);
      unitSectionContent.media.forEach((entry) => {
        entry.position =
          entry.id === id ? "primary" : entry.position === "primary" ? "secondary" : entry.position;
      });
      return clone(item);
    },
  },
};
