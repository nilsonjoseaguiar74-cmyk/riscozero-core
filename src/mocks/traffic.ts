/** Dados mockados e determinísticos do domínio de Aquisição e Tráfego. */

import { MOCK_LEADS } from "@/mocks/data";
import type {
  Ad,
  AdAccount,
  AdSet,
  CampaignDailyPoint,
  Creative,
  Experiment,
  LandingPagePerformance,
  LeadJourney,
  MediaIntegrationCard,
  TouchPoint,
  TrackingEventRow,
  TrafficCampaign,
  TrafficChannel,
  UtmHistoryEntry,
  UtmPreset,
} from "@/types/traffic";

function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

const rand = seeded(75311);
const pick = <T>(list: readonly T[], r = rand()): T => list[Math.floor(r * list.length)]!;

const NOW = new Date("2026-08-05T00:00:00.000Z").getTime();
const DAY = 86400000;
const round2 = (n: number) => Math.round(n * 100) / 100;

export const LANDING_PAGES = [
  { path: "/", title: "Página inicial" },
  { path: "/solicitar-cotacao", title: "Solicitar cotação" },
  { path: "/beneficios", title: "Benefícios" },
  { path: "/como-funciona", title: "Como funciona" },
  { path: "/regioes", title: "Regiões atendidas" },
  { path: "/contato", title: "Contato" },
];

export const MOCK_AD_ACCOUNTS: AdAccount[] = [
  {
    id: "acc-google-1",
    channel: "google_ads",
    name: "Risco Zero - Google Ads Regional",
    currency: "BRL",
    timezone: "America/Sao_Paulo",
    status: "ativa",
    dailyBudget: 420,
    connectedAt: new Date(NOW - 240 * DAY).toISOString(),
  },
  {
    id: "acc-meta-1",
    channel: "meta_ads",
    name: "Risco Zero - Meta Ads Captação",
    currency: "BRL",
    timezone: "America/Sao_Paulo",
    status: "ativa",
    dailyBudget: 360,
    connectedAt: new Date(NOW - 210 * DAY).toISOString(),
  },
  {
    id: "acc-meta-2",
    channel: "meta_ads",
    name: "Risco Zero - Meta Ads Remarketing",
    currency: "BRL",
    timezone: "America/Sao_Paulo",
    status: "pausada",
    dailyBudget: 150,
    connectedAt: new Date(NOW - 150 * DAY).toISOString(),
  },
];

const CAMPAIGN_DEFS: {
  name: string;
  channel: TrafficChannel;
  accountId: string;
  objective: TrafficCampaign["objective"];
  status: TrafficCampaign["status"];
}[] = [
  {
    name: "Search Marca - Grande Fpolis",
    channel: "google_ads",
    accountId: "acc-google-1",
    objective: "conversao",
    status: "ativa",
  },
  {
    name: "Search Proteção Veicular",
    channel: "google_ads",
    accountId: "acc-google-1",
    objective: "geracao_leads",
    status: "ativa",
  },
  {
    name: "Performance Max - Regional",
    channel: "google_ads",
    accountId: "acc-google-1",
    objective: "geracao_leads",
    status: "ativa",
  },
  {
    name: "Search Concorrentes",
    channel: "google_ads",
    accountId: "acc-google-1",
    objective: "conversao",
    status: "pausada",
  },
  {
    name: "Display Remarketing Cotação",
    channel: "google_ads",
    accountId: "acc-google-1",
    objective: "remarketing",
    status: "ativa",
  },
  {
    name: "Search Regiões Atendidas",
    channel: "google_ads",
    accountId: "acc-google-1",
    objective: "trafego",
    status: "encerrada",
  },
  {
    name: "Meta Advantage+ Leads",
    channel: "meta_ads",
    accountId: "acc-meta-1",
    objective: "geracao_leads",
    status: "ativa",
  },
  {
    name: "Meta Feed Benefícios",
    channel: "meta_ads",
    accountId: "acc-meta-1",
    objective: "reconhecimento",
    status: "ativa",
  },
  {
    name: "Meta Stories Cotação Rápida",
    channel: "meta_ads",
    accountId: "acc-meta-1",
    objective: "geracao_leads",
    status: "ativa",
  },
  {
    name: "Meta Reels Como Funciona",
    channel: "meta_ads",
    accountId: "acc-meta-1",
    objective: "trafego",
    status: "ativa",
  },
  {
    name: "Remarketing Cotação",
    channel: "meta_ads",
    accountId: "acc-meta-2",
    objective: "remarketing",
    status: "ativa",
  },
  {
    name: "Meta Lookalike Associados",
    channel: "meta_ads",
    accountId: "acc-meta-1",
    objective: "geracao_leads",
    status: "pausada",
  },
  {
    name: "Meta Instant Experience Regiões",
    channel: "meta_ads",
    accountId: "acc-meta-1",
    objective: "reconhecimento",
    status: "encerrada",
  },
  {
    name: "Meta Carrossel Assistência 24h",
    channel: "meta_ads",
    accountId: "acc-meta-2",
    objective: "conversao",
    status: "ativa",
  },
];

const accountNameById = Object.fromEntries(MOCK_AD_ACCOUNTS.map((a) => [a.id, a.name]));

export const MOCK_TRAFFIC_CAMPAIGNS: TrafficCampaign[] = CAMPAIGN_DEFS.map((def, i) => {
  const investment = 1600 + i * 780 + Math.floor(rand() * 500);
  const impressions = investment * (24 + Math.floor(rand() * 30));
  const clicks = Math.round(impressions * (0.015 + rand() * 0.02));
  const sessions = Math.round(clicks * (0.85 + rand() * 0.1));
  const leads = Math.round(sessions * (0.08 + rand() * 0.06));
  const qualifiedLeads = Math.round(leads * (0.55 + rand() * 0.2));
  const adhesions = Math.round(qualifiedLeads * (0.25 + rand() * 0.2));
  const revenue = adhesions * 1290;
  return {
    id: `tcamp-${i + 1}`,
    channel: def.channel,
    accountId: def.accountId,
    accountName: accountNameById[def.accountId] ?? "",
    name: def.name,
    status: def.status,
    objective: def.objective,
    budget: Math.round(investment * 1.15),
    investment,
    impressions,
    reach: Math.round(impressions * 0.68),
    clicks,
    sessions,
    leads,
    qualifiedLeads,
    cpl: leads ? round2(investment / leads) : 0,
    adhesions,
    cpa: adhesions ? round2(investment / adhesions) : 0,
    attributedRevenue: revenue,
    roas: investment ? round2(revenue / investment) : 0,
    updatedAt: new Date(NOW - (i % 5) * DAY).toISOString(),
  } satisfies TrafficCampaign;
});

export const MOCK_AD_SETS: AdSet[] = MOCK_TRAFFIC_CAMPAIGNS.flatMap((camp, ci) =>
  Array.from({ length: 2 }, (_, si) => {
    const investment = Math.round(camp.investment / 2.2);
    const clicks = Math.round(camp.clicks / 2.1);
    const leads = Math.round(camp.leads / 2.1);
    return {
      id: `adset-${ci + 1}-${si + 1}`,
      campaignId: camp.id,
      name: `${camp.name} - Conjunto ${si + 1}`,
      status: camp.status,
      budget: Math.round(camp.budget / 2),
      investment,
      clicks,
      leads,
      targeting: pick([
        "Interesses: seguros e proteção veicular",
        "Público semelhante a associados",
        "Localização: Grande Florianópolis, 25-55 anos",
        "Remarketing: visitantes da página de cotação",
      ]),
    } satisfies AdSet;
  }),
);

export const MOCK_ADS: Ad[] = MOCK_AD_SETS.flatMap((adSet, i) =>
  Array.from({ length: 2 }, (_, ai) => {
    const investment = Math.round(adSet.investment / 2.2);
    const clicks = Math.round(adSet.clicks / 2.1);
    const leads = Math.round(adSet.leads / 2.1);
    return {
      id: `ad-${i + 1}-${ai + 1}`,
      adSetId: adSet.id,
      campaignId: adSet.campaignId,
      name: `${adSet.name} - Anúncio ${ai + 1}`,
      status: adSet.status,
      format: pick(["Imagem única", "Vídeo curto", "Carrossel"]),
      investment,
      clicks,
      leads,
      ctr: clicks && investment ? round2((clicks / (investment * 22)) * 100) : 0,
    } satisfies Ad;
  }),
);

export function buildDailySeries(campaign: TrafficCampaign, days = 90): CampaignDailyPoint[] {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(NOW - (days - 1 - i) * DAY);
    const factor = 0.7 + rand() * 0.6;
    const investment = round2((campaign.investment / days) * factor);
    const impressions = Math.round((campaign.impressions / days) * factor);
    const clicks = Math.round((campaign.clicks / days) * factor);
    const sessions = Math.round((campaign.sessions / days) * factor);
    const leads = Math.round((campaign.leads / days) * factor);
    const qualifiedLeads = Math.round(leads * 0.6);
    const adhesions = i % 6 === 0 ? Math.round(leads * 0.2) : 0;
    return {
      date: date.toISOString().slice(0, 10),
      investment,
      impressions,
      clicks,
      sessions,
      leads,
      qualifiedLeads,
      adhesions,
      revenue: adhesions * 1290,
    } satisfies CampaignDailyPoint;
  });
}

export const MOCK_LANDING_PAGES: LandingPagePerformance[] = LANDING_PAGES.map((lp, i) => {
  const sessions = 900 + i * 340 + Math.floor(rand() * 400);
  const formsStarted = Math.round(sessions * (0.18 + rand() * 0.1));
  const leads = Math.round(formsStarted * (0.45 + rand() * 0.25));
  const whatsappClicks = Math.round(sessions * (0.05 + rand() * 0.05));
  return {
    path: lp.path,
    title: lp.title,
    sessions,
    formsStarted,
    leads,
    conversionRate: sessions ? round2((leads / sessions) * 100) : 0,
    whatsappClicks,
    abandonmentRate: formsStarted ? round2(((formsStarted - leads) / formsStarted) * 100) : 0,
    topDevice: pick(["mobile", "mobile", "desktop", "tablet"] as const),
    topSource: pick(["Google Ads", "Meta Ads", "Orgânico"]),
    topCampaign: pick(MOCK_TRAFFIC_CAMPAIGNS).name,
    topCta: pick(["hero_form", "cta_final", "whatsapp_flutuante", "menu_cotacao"]),
  } satisfies LandingPagePerformance;
});

export const MOCK_CREATIVES: Creative[] = Array.from({ length: 24 }, (_, i) => {
  const campaign = pick(MOCK_TRAFFIC_CAMPAIGNS);
  const impressions = 8000 + i * 900 + Math.floor(rand() * 4000);
  const clicks = Math.round(impressions * (0.015 + rand() * 0.02));
  const leads = Math.round(clicks * (0.08 + rand() * 0.08));
  const investment = Math.round(clicks * (1.6 + rand() * 1.2));
  return {
    id: `creative-${i + 1}`,
    name: `Criativo ${i + 1} - ${campaign.name}`,
    channel: campaign.channel,
    format: pick(["imagem", "video", "carrossel", "texto"] as const),
    campaign: campaign.name,
    message: pick([
      "Proteção veicular com mensalidades acessíveis e assistência 24 horas.",
      "Solicite sua cotação em menos de 2 minutos, sem compromisso.",
      "Conheça os benefícios de fazer parte da nossa associação de proteção.",
      "Assistência 24 horas em toda a Grande Florianópolis.",
    ]),
    cta: pick(["Solicitar cotação", "Saiba mais", "Fale conosco", "Ver benefícios"]),
    status: pick(["ativo", "ativo", "pausado", "em_analise", "reprovado"] as const),
    periodStart: new Date(NOW - (60 - i) * DAY).toISOString(),
    periodEnd: i % 4 === 0 ? new Date(NOW - (10 - (i % 10)) * DAY).toISOString() : undefined,
    impressions,
    clicks,
    ctr: impressions ? round2((clicks / impressions) * 100) : 0,
    leads,
    cpl: leads ? round2(investment / leads) : 0,
    notes: i % 5 === 0 ? "Criativo com melhor desempenho no público de remarketing." : undefined,
    version: 1 + (i % 3),
  } satisfies Creative;
});

export const MOCK_EXPERIMENTS: Experiment[] = [
  {
    id: "exp-1",
    name: "Formulário curto vs. formulário completo",
    hypothesis: "Reduzir o número de campos aumenta a taxa de envio do formulário.",
    page: "/solicitar-cotacao",
    variable: "Quantidade de campos do formulário",
    variantA: "Formulário completo (7 campos)",
    variantB: "Formulário curto (4 campos)",
    primaryMetric: "Taxa de conversão em leads",
    periodStart: new Date(NOW - 60 * DAY).toISOString(),
    periodEnd: new Date(NOW - 30 * DAY).toISOString(),
    status: "concluido",
    result:
      "A variante B aumentou a conversão em 18% sem perda perceptível de qualidade dos leads.",
    variantAConversion: 9.4,
    variantBConversion: 11.1,
    winner: "B",
  },
  {
    id: "exp-2",
    name: "CTA hero: Solicitar cotação vs. Fale com um consultor",
    hypothesis: "Um CTA mais consultivo aumenta a confiança e o clique no herói da página inicial.",
    page: "/",
    variable: "Texto do botão principal",
    variantA: "Solicitar cotação",
    variantB: "Fale com um consultor",
    primaryMetric: "Taxa de clique no CTA",
    periodStart: new Date(NOW - 45 * DAY).toISOString(),
    periodEnd: new Date(NOW - 20 * DAY).toISOString(),
    status: "concluido",
    result: "Sem diferença estatística relevante entre as variantes.",
    variantAConversion: 6.2,
    variantBConversion: 6.4,
    winner: "inconclusivo",
  },
  {
    id: "exp-3",
    name: "Ordem das seções de benefícios",
    hypothesis: "Apresentar a assistência 24 horas antes reduz a taxa de abandono.",
    page: "/beneficios",
    variable: "Ordem das seções",
    variantA: "Ordem atual",
    variantB: "Assistência 24h em destaque",
    primaryMetric: "Taxa de rolagem até o formulário",
    periodStart: new Date(NOW - 25 * DAY).toISOString(),
    status: "em_andamento",
    variantAConversion: 32.1,
    variantBConversion: 35.8,
  },
  {
    id: "exp-4",
    name: "Prova social na página de contato",
    hypothesis: "Depoimentos aumentam a taxa de envio de mensagens pelo WhatsApp.",
    page: "/contato",
    variable: "Presença de depoimentos",
    variantA: "Sem depoimentos",
    variantB: "Com depoimentos de associados",
    primaryMetric: "Cliques no WhatsApp",
    periodStart: new Date(NOW - 10 * DAY).toISOString(),
    status: "em_andamento",
  },
  {
    id: "exp-5",
    name: "Vídeo explicativo em Como Funciona",
    hypothesis: "Um vídeo curto aumenta o tempo na página e a taxa de conversão.",
    page: "/como-funciona",
    variable: "Presença de vídeo explicativo",
    variantA: "Somente texto",
    variantB: "Texto com vídeo de 40 segundos",
    primaryMetric: "Taxa de conversão em leads",
    periodStart: new Date(NOW - 90 * DAY).toISOString(),
    periodEnd: new Date(NOW - 70 * DAY).toISOString(),
    status: "concluido",
    result:
      "A variante com vídeo aumentou o tempo médio na página, sem impacto direto na conversão.",
    variantAConversion: 7.8,
    variantBConversion: 8.0,
    winner: "inconclusivo",
  },
  {
    id: "exp-6",
    name: "Botão flutuante de WhatsApp",
    hypothesis: "Um botão fixo aumenta os cliques para atendimento imediato.",
    page: "/regioes",
    variable: "Posição do botão de WhatsApp",
    variantA: "Botão no rodapé",
    variantB: "Botão flutuante fixo",
    primaryMetric: "Cliques no WhatsApp",
    periodStart: new Date(NOW - 5 * DAY).toISOString(),
    status: "planejado",
  },
];

export const MOCK_MEDIA_INTEGRATIONS: MediaIntegrationCard[] = [
  {
    id: "mi-google-ads",
    channel: "google_ads",
    name: "Google Ads",
    status: "aguardando_configuracao",
    accountsConnected: 1,
    notes: "Conclua a autenticação para sincronizar automaticamente o investimento diário.",
  },
  {
    id: "mi-meta-ads",
    channel: "meta_ads",
    name: "Meta Ads",
    status: "sincronizando",
    lastSyncAt: new Date(NOW - 1800000).toISOString(),
    accountsConnected: 2,
  },
];

const UTM_SOURCES = ["google", "meta"];
const UTM_MEDIUMS = ["cpc", "paid_social"];

export const MOCK_UTM_PRESETS: UtmPreset[] = MOCK_TRAFFIC_CAMPAIGNS.slice(0, 8).map((c, i) => ({
  id: `utm-preset-${i + 1}`,
  name: c.name,
  utmSource: c.channel === "google_ads" ? "google" : "meta",
  utmMedium: c.channel === "google_ads" ? "cpc" : "paid_social",
  utmCampaign: c.name.toLowerCase().replace(/\s+/g, "_"),
  utmTerm: c.channel === "google_ads" ? "protecao_veicular_sc" : undefined,
  utmContent: c.channel === "meta_ads" ? pick(["criativo_a", "criativo_b"]) : undefined,
  createdAt: new Date(NOW - (i + 1) * 12 * DAY).toISOString(),
}));

export const MOCK_UTM_HISTORY: UtmHistoryEntry[] = Array.from({ length: 16 }, (_, i) => {
  const campaign = pick(MOCK_TRAFFIC_CAMPAIGNS);
  const source = pick(UTM_SOURCES);
  return {
    id: `utm-hist-${i + 1}`,
    url: `https://riscozero.com.br${pick(LANDING_PAGES).path}`,
    utmSource: source,
    utmMedium: pick(UTM_MEDIUMS),
    utmCampaign: campaign.name.toLowerCase().replace(/\s+/g, "_"),
    utmTerm: source === "google" ? "protecao_veicular" : undefined,
    utmContent:
      source === "meta" ? pick(["criativo_a", "criativo_b", "criativo_video"]) : undefined,
    createdAt: new Date(NOW - i * 3 * DAY).toISOString(),
    authorName: pick(["Teste Gestão de Tráfego", "Teste Administrativo"]),
  } satisfies UtmHistoryEntry;
});

const EVENT_NAMES = [
  "page_view",
  "form_view",
  "form_start",
  "form_submit",
  "form_success",
  "form_error",
  "whatsapp_click",
  "phone_click",
  "location_click",
  "faq_open",
  "cta_click",
] as const;

export const MOCK_TRACKING_EVENTS: TrackingEventRow[] = Array.from({ length: 200 }, (_, i) => {
  const channel = pick(["google_ads", "meta_ads", "organico", "direto", "indicacao"] as const);
  const isPaid = channel === "google_ads" || channel === "meta_ads";
  const hasUtm = isPaid ? rand() > 0.12 : true;
  const campaign = isPaid ? pick(MOCK_TRAFFIC_CAMPAIGNS) : undefined;
  const issues: TrackingEventRow["issues"] = [];
  if (isPaid && !hasUtm) issues.push("utm_ausente");
  if (i % 37 === 0) issues.push("identificador_duplicado");
  if (channel === "direto" && i % 11 === 0) issues.push("origem_desconhecida");
  if (i % 29 === 0) issues.push("falha_associacao");
  if (isPaid && !campaign && i % 19 === 0) issues.push("conversao_sem_campanha");
  if (isPaid && hasUtm && i % 23 === 0) issues.push("parametros_incompletos");
  return {
    id: `evt-${i + 1}`,
    name: pick(EVENT_NAMES),
    occurredAt: new Date(
      NOW - Math.floor(rand() * 30) * DAY - Math.floor(rand() * DAY),
    ).toISOString(),
    landingPage: pick(LANDING_PAGES).path,
    channel,
    campaign: campaign?.name,
    utmSource: isPaid && hasUtm ? (channel === "google_ads" ? "google" : "meta") : undefined,
    utmMedium: isPaid && hasUtm ? (channel === "google_ads" ? "cpc" : "paid_social") : undefined,
    gclid: channel === "google_ads" && hasUtm ? `gclid-evt-${i}` : undefined,
    fbclid: channel === "meta_ads" && hasUtm ? `fbclid-evt-${i}` : undefined,
    deviceType: pick(["mobile", "mobile", "desktop", "tablet"] as const),
    issues,
  } satisfies TrackingEventRow;
});

function buildTouchpoints(index: number): TouchPoint[] {
  const count = 1 + (index % 3);
  const touches: TouchPoint[] = [];
  for (let i = 0; i < count; i += 1) {
    const channel = pick(["google_ads", "meta_ads", "organico", "direto"] as const);
    const isPaid = channel === "google_ads" || channel === "meta_ads";
    const campaign = isPaid ? pick(MOCK_TRAFFIC_CAMPAIGNS) : undefined;
    touches.push({
      occurredAt: new Date(NOW - (count - i) * 2 * DAY - index * 3600000).toISOString(),
      channel,
      campaign: campaign?.name,
      utmSource: isPaid ? (channel === "google_ads" ? "google" : "meta") : undefined,
      utmMedium: isPaid ? (channel === "google_ads" ? "cpc" : "paid_social") : undefined,
      utmCampaign: campaign?.name,
      gclid: channel === "google_ads" ? `gclid-j-${index}-${i}` : undefined,
      fbclid: channel === "meta_ads" ? `fbclid-j-${index}-${i}` : undefined,
      landingPage: pick(LANDING_PAGES).path,
    });
  }
  return touches;
}

export const MOCK_LEAD_JOURNEYS: LeadJourney[] = MOCK_LEADS.slice(0, 60).map((lead, i) => {
  const touchpoints = buildTouchpoints(i);
  const last = touchpoints[touchpoints.length - 1];
  return {
    leadId: lead.id,
    leadName: lead.name,
    touchpoints,
    convertedAt: lead.stage === "adesao_concluida" ? lead.stageChangedAt : undefined,
    attributedChannel: last?.campaign ?? last?.channel ?? "Orgânico",
  } satisfies LeadJourney;
});
