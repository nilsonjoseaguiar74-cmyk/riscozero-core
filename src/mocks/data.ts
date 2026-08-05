import type {
  Activity,
  AppSettings,
  AuditEntry,
  AuthUser,
  Campaign,
  FeatureFlag,
  Integration,
  Lead,
  LeadStage,
  Permission,
  RoleDefinition,
  ServiceStatus,
  Task,
  UserRole,
  WebhookLog,
} from "@/types";
import { LEAD_STAGES } from "@/types";
import { SITE } from "@/config/site";

/** Gerador determinístico para que a demonstração seja estável entre recargas. */
function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

const rand = seeded(20260805);

const pick = <T>(list: readonly T[], r = rand()): T => list[Math.floor(r * list.length)]!;

const ALL_PERMISSIONS: Permission[] = [
  "dashboard.view",
  "crm.view",
  "crm.edit",
  "reports.view",
  "acquisition.view",
  "integrations.manage",
  "users.manage",
  "audit.view",
  "settings.manage",
  "developer.access",
];

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    role: "administrador",
    label: "Administrador",
    description: "Acesso completo à plataforma, usuários, auditoria e configurações.",
    permissions: ALL_PERMISSIONS,
  },
  {
    role: "gestor",
    label: "Gestor",
    description: "Acompanha a operação comercial, relatórios e desempenho da equipe.",
    permissions: [
      "dashboard.view",
      "crm.view",
      "crm.edit",
      "reports.view",
      "acquisition.view",
      "audit.view",
    ],
  },
  {
    role: "comercial",
    label: "Comercial",
    description: "Atende participantes interessados e conduz o funil de adesão.",
    permissions: ["dashboard.view", "crm.view", "crm.edit"],
  },
  {
    role: "gestor_trafego",
    label: "Gestor de tráfego",
    description: "Acompanha campanhas, rastreamento e qualidade da captação.",
    permissions: ["dashboard.view", "reports.view", "acquisition.view", "integrations.manage"],
  },
  {
    role: "desenvolvedor",
    label: "Desenvolvedor",
    description: "Diagnóstico técnico, webhooks, feature flags e status dos serviços.",
    permissions: [
      "dashboard.view",
      "integrations.manage",
      "developer.access",
      "audit.view",
      "reports.view",
    ],
  },
];

export const permissionsForRole = (role: UserRole): Permission[] =>
  ROLE_DEFINITIONS.find((r) => r.role === role)?.permissions ?? ["dashboard.view"];

export const MOCK_USERS: AuthUser[] = [
  {
    id: "u-1",
    name: "Ana Beatriz Corrêa",
    email: "ana.correa@riscozero.demo",
    role: "administrador",
    permissions: permissionsForRole("administrador"),
    status: "ativo",
    lastAccessAt: "2026-08-04T18:40:00.000Z",
  },
  {
    id: "u-2",
    name: "Marcelo Tavares",
    email: "marcelo.tavares@riscozero.demo",
    role: "gestor",
    permissions: permissionsForRole("gestor"),
    status: "ativo",
    lastAccessAt: "2026-08-04T14:05:00.000Z",
  },
  {
    id: "u-3",
    name: "Juliana Bertoldi",
    email: "juliana.bertoldi@riscozero.demo",
    role: "comercial",
    permissions: permissionsForRole("comercial"),
    status: "ativo",
    lastAccessAt: "2026-08-05T00:12:00.000Z",
  },
  {
    id: "u-4",
    name: "Rafael Nunes",
    email: "rafael.nunes@riscozero.demo",
    role: "comercial",
    permissions: permissionsForRole("comercial"),
    status: "ativo",
    lastAccessAt: "2026-08-04T21:33:00.000Z",
  },
  {
    id: "u-5",
    name: "Camila Deschamps",
    email: "camila.deschamps@riscozero.demo",
    role: "gestor_trafego",
    permissions: permissionsForRole("gestor_trafego"),
    status: "ativo",
    lastAccessAt: "2026-08-04T11:20:00.000Z",
  },
  {
    id: "u-6",
    name: "Diego Vasques",
    email: "diego.vasques@riscozero.demo",
    role: "desenvolvedor",
    permissions: permissionsForRole("desenvolvedor"),
    status: "convidado",
  },
];

const FIRST = [
  "Bruno",
  "Carla",
  "Eduardo",
  "Fernanda",
  "Gustavo",
  "Helena",
  "Igor",
  "Joana",
  "Leonardo",
  "Mariana",
  "Nathan",
  "Patrícia",
  "Rodrigo",
  "Simone",
  "Tiago",
  "Vanessa",
];
const LAST = [
  "Machado",
  "Fontana",
  "Amorim",
  "Schmitt",
  "Peixoto",
  "Bittencourt",
  "Cardoso",
  "Rebelo",
  "Koerich",
  "Vieira",
  "Lemos",
  "Farias",
];
const CITY_LIST = ["São José", "Florianópolis", "Palhoça", "Biguaçu"];
const SOURCE_LIST = ["Google Ads", "Meta Ads", "Orgânico", "Indicação", "WhatsApp"];
const CAMPAIGN_LIST = [
  "Search Marca - Grande Fpolis",
  "Search Proteção Veicular",
  "Performance Max - Regional",
  "Meta Advantage+ Leads",
  "Remarketing Cotação",
];
const VEHICLES = ["carro", "moto", "caminhonete", "utilitario"] as const;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function plate(): string {
  const l = () => LETTERS[Math.floor(rand() * 26)]!;
  const d = () => Math.floor(rand() * 10);
  return `${l()}${l()}${l()}${d()}${l()}${d()}${d()}`;
}

const STAGE_WEIGHTS: LeadStage[] = [
  "novo_contato",
  "novo_contato",
  "novo_contato",
  "contato_iniciado",
  "contato_iniciado",
  "perfil_identificado",
  "perfil_identificado",
  "opcoes_apresentadas",
  "opcoes_apresentadas",
  "proposta_adesao",
  "documentacao_pendente",
  "adesao_concluida",
  "adesao_concluida",
  "nao_convertido",
  "nao_convertido",
];

const NOW = new Date("2026-08-05T00:00:00.000Z").getTime();
const DAY = 86400000;

function buildLeads(count: number): Lead[] {
  const leads: Lead[] = [];
  for (let i = 0; i < count; i += 1) {
    const stage = pick(STAGE_WEIGHTS);
    const owner = rand() > 0.15 ? pick(MOCK_USERS.filter((u) => u.role === "comercial")) : null;
    const createdAt = new Date(NOW - Math.floor(rand() * 60) * DAY - Math.floor(rand() * DAY));
    const stageChangedAt = new Date(
      createdAt.getTime() + Math.floor(rand() * 6) * DAY + 3600000,
    );
    const source = pick(SOURCE_LIST);
    const paid = source === "Google Ads" || source === "Meta Ads";
    leads.push({
      id: `lead-${String(i + 1).padStart(4, "0")}`,
      name: `${pick(FIRST)} ${pick(LAST)}`,
      whatsapp: `(48) 9${Math.floor(1000 + rand() * 8999)}-${Math.floor(1000 + rand() * 8999)}`,
      plate: plate(),
      city: pick(CITY_LIST),
      vehicleType: pick(VEHICLES),
      vehicleYear: String(2008 + Math.floor(rand() * 18)),
      bestTime: pick(["Manhã", "Tarde", "Noite"]),
      contactPreference: pick(["whatsapp", "ligacao", "qualquer"] as const),
      consent: true,
      stage,
      priority: pick(["baixa", "media", "alta"] as const),
      ownerId: owner?.id ?? null,
      ownerName: owner?.name,
      source,
      campaign: paid ? pick(CAMPAIGN_LIST) : undefined,
      tags: rand() > 0.7 ? ["Retorno agendado"] : [],
      lossReason:
        stage === "nao_convertido"
          ? pick(["sem_retorno", "valor", "sem_interesse", "outra_alternativa"] as const)
          : undefined,
      notes:
        rand() > 0.6
          ? "Participante interessado em conhecer as opções de proteção e assistência disponíveis."
          : undefined,
      tracking: {
        utmSource: paid ? (source === "Google Ads" ? "google" : "meta") : "direct",
        utmMedium: paid ? "cpc" : "organic",
        utmCampaign: paid ? pick(CAMPAIGN_LIST) : undefined,
        utmContent: paid ? pick(["anuncio_a", "anuncio_b", "criativo_video"]) : undefined,
        utmTerm: paid ? pick(["proteção veicular sc", "proteção veicular são josé"]) : undefined,
        referrer: paid ? "https://www.google.com/" : "",
        landingPage: pick(["/", "/solicitar-cotacao", "/beneficios"]),
        gclid: source === "Google Ads" ? `gclid-${i}${Math.floor(rand() * 999)}` : undefined,
        fbclid: source === "Meta Ads" ? `fbclid-${i}${Math.floor(rand() * 999)}` : undefined,
        deviceType: pick(["mobile", "mobile", "desktop", "tablet"] as const),
        browser: pick(["Chrome", "Safari", "Edge"]),
        operatingSystem: pick(["Android", "iOS", "Windows"]),
        firstVisitAt: createdAt.toISOString(),
        conversionPage: "/solicitar-cotacao",
        conversionCta: pick(["hero_form", "cta_final", "whatsapp_flutuante"]),
        consentVersion: SITE.consentVersion,
      },
      createdAt: createdAt.toISOString(),
      updatedAt: stageChangedAt.toISOString(),
      stageChangedAt: stageChangedAt.toISOString(),
    });
  }
  return leads.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export const MOCK_LEADS: Lead[] = buildLeads(180);

const ACTIVITY_SEEDS: { type: Activity["type"]; title: string }[] = [
  { type: "sistema", title: "Solicitação recebida pelo site" },
  { type: "whatsapp", title: "Mensagem enviada pelo WhatsApp" },
  { type: "ligacao", title: "Ligação realizada" },
  { type: "etapa", title: "Etapa atualizada" },
  { type: "observacao", title: "Observação registrada" },
];

export const MOCK_ACTIVITIES: Activity[] = MOCK_LEADS.flatMap((lead, index) => {
  const total = 2 + (index % 3);
  return Array.from({ length: total }, (_, i) => {
    const seed = ACTIVITY_SEEDS[(index + i) % ACTIVITY_SEEDS.length]!;
    return {
      id: `act-${lead.id}-${i}`,
      leadId: lead.id,
      type: seed.type,
      title: seed.title,
      description:
        seed.type === "observacao"
          ? "Participante solicitou retorno para apresentação das opções disponíveis."
          : undefined,
      authorName: lead.ownerName ?? "Equipe comercial",
      createdAt: new Date(new Date(lead.createdAt).getTime() + i * 7200000).toISOString(),
    } satisfies Activity;
  });
});

export const MOCK_TASKS: Task[] = MOCK_LEADS.slice(0, 42).map((lead, i) => {
  const dueAt = new Date(NOW + (i % 9 === 0 ? -1 : 1) * (i % 6) * DAY + 3 * 3600000);
  return {
    id: `task-${i + 1}`,
    leadId: lead.id,
    leadName: lead.name,
    title: pick(
      [
        "Retornar contato pelo WhatsApp",
        "Apresentar opções de proteção",
        "Conferir documentação de adesão",
        "Agendar vistoria do veículo",
      ],
      (i % 4) / 4 + 0.01,
    ),
    dueAt: dueAt.toISOString(),
    status: dueAt.getTime() < NOW ? "atrasada" : i % 5 === 0 ? "concluida" : "pendente",
    ownerName: lead.ownerName ?? "Equipe comercial",
  } satisfies Task;
});

export const MOCK_CAMPAIGNS: Campaign[] = CAMPAIGN_LIST.map((name, i) => {
  const investment = 1800 + i * 940;
  const clicks = 620 + i * 210;
  const leads = 74 + i * 19;
  return {
    id: `camp-${i + 1}`,
    name,
    channel: i < 3 ? "google_ads" : "meta_ads",
    status: i === 4 ? "pausada" : "ativa",
    investment,
    impressions: clicks * (18 + i),
    reach: clicks * (11 + i),
    clicks,
    leads,
    qualifiedLeads: Math.round(leads * 0.62),
    adhesions: Math.round(leads * 0.17),
    attributedRevenue: Math.round(leads * 0.17) * 1290,
    updatedAt: new Date(NOW - i * DAY).toISOString(),
  } satisfies Campaign;
});

export const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: "google-ads",
    name: "Google Ads",
    description: "Importação de investimento, cliques e conversões offline por campanha.",
    status: "aguardando_configuracao",
    category: "aquisicao",
  },
  {
    id: "meta-ads",
    name: "Meta Ads",
    description: "Sincronização de campanhas, conjuntos e formulários de captação.",
    status: "nao_configurada",
    category: "aquisicao",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Envio de mensagens e registro automático de atendimentos no CRM.",
    status: "acao_necessaria",
    category: "atendimento",
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Envio de eventos de página, formulário e conversão para análise.",
    status: "sincronizando",
    lastSyncAt: new Date(NOW - 3600000).toISOString(),
    category: "analytics",
  },
  {
    id: "webhooks",
    name: "Webhooks",
    description: "Notificações de eventos da plataforma para sistemas externos.",
    status: "conectada",
    lastSyncAt: new Date(NOW - 900000).toISOString(),
    category: "desenvolvedor",
  },
];

export const MOCK_WEBHOOK_LOGS: WebhookLog[] = Array.from({ length: 14 }, (_, i) => ({
  id: `hook-${i + 1}`,
  event: pick(["lead.created", "lead.stage_changed", "task.created", "user.invited"], (i % 4) / 4),
  endpoint: "https://api.riscozero.local/webhooks/crm",
  status: i % 7 === 0 ? 500 : i % 5 === 0 ? 422 : 200,
  attempts: i % 7 === 0 ? 3 : 1,
  durationMs: 90 + i * 27,
  createdAt: new Date(NOW - i * 5400000).toISOString(),
  responseBody: i % 7 === 0 ? '{"error":"upstream indisponível"}' : '{"received":true}',
}));

export const MOCK_FEATURE_FLAGS: FeatureFlag[] = [
  {
    key: "crm_kanban_v2",
    label: "Kanban comercial v2",
    enabled: true,
    description: "Nova organização de colunas e cartões do funil de adesão.",
  },
  {
    key: "reports_export",
    label: "Exportações de relatórios",
    enabled: true,
    description: "Exportação simulada em CSV, PDF e XLSX.",
  },
  {
    key: "whatsapp_templates",
    label: "Modelos de mensagem",
    enabled: false,
    description: "Modelos padronizados de primeiro contato.",
  },
  {
    key: "two_factor",
    label: "Verificação em duas etapas",
    enabled: false,
    description: "Preparação visual para autenticação em duas etapas.",
  },
];

export const MOCK_SERVICE_STATUS: ServiceStatus[] = [
  { name: "API de aplicação", status: "operacional", latencyMs: 118 },
  { name: "Fila de eventos", status: "operacional", latencyMs: 62 },
  { name: "Sincronização de campanhas", status: "degradado", latencyMs: 940 },
  { name: "Serviço de mensageria", status: "operacional", latencyMs: 205 },
];

export const MOCK_AUDIT: AuditEntry[] = Array.from({ length: 32 }, (_, i) => {
  const user = MOCK_USERS[i % MOCK_USERS.length]!;
  const actions = [
    { action: "Alterou etapa do lead", resource: "crm/leads" },
    { action: "Exportou relatório comercial", resource: "reports/commercial" },
    { action: "Convidou usuário", resource: "administration/users" },
    { action: "Atualizou configurações de rastreamento", resource: "settings/tracking" },
    { action: "Tentou acessar auditoria", resource: "administration/audit" },
  ];
  const a = actions[i % actions.length]!;
  return {
    id: `audit-${i + 1}`,
    userName: user.name,
    action: a.action,
    resource: a.resource,
    createdAt: new Date(NOW - i * 4300000).toISOString(),
    result: i % 9 === 0 ? "falha" : "sucesso",
    maskedIp: `189.**.**.${40 + (i % 200)}`,
    device: i % 2 === 0 ? "Chrome • Windows" : "Safari • iOS",
    before: a.action.includes("etapa") ? "Contato iniciado" : undefined,
    after: a.action.includes("etapa") ? "Opções apresentadas" : undefined,
  } satisfies AuditEntry;
});

export const MOCK_SETTINGS: AppSettings = {
  general: {
    companyName: SITE.fullName,
    whatsapp: SITE.whatsapp,
    address: SITE.address,
    serviceHours: "",
    defaultMessage:
      "Olá! Gostaria de conhecer as opções de proteção e assistência para o meu veículo.",
  },
  commercial: {
    pipeline: LEAD_STAGES.map((s) => s.label),
    lossReasons: [
      "Sem retorno",
      "Sem interesse",
      "Valor",
      "Veículo fora do perfil",
      "Região não atendida",
      "Escolheu outra alternativa",
      "Documentação incompleta",
      "Outro",
    ],
    distribution: "round_robin",
    monthlyGoal: 60,
  },
  tracking: {
    utmRequired: true,
    consentVersion: SITE.consentVersion,
    conversionEvents: ["form_submit", "form_success", "whatsapp_click"],
  },
  privacy: {
    privacyPolicyUrl: "/politica-de-privacidade",
    termsUrl: "/termos-de-uso",
    cookieBannerEnabled: true,
  },
  notifications: {
    newLeadEmail: true,
    dailyDigest: true,
    taskReminders: false,
  },
};
