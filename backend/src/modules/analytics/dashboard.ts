import type { Prisma } from "@prisma/client";

export type AnalyticsLead = Prisma.LeadGetPayload<{
  include: { owner: true; tracking: true; stageHistory: true };
}>;

const STAGES = [
  "novo_contato", "contato_iniciado", "perfil_identificado", "opcoes_apresentadas",
  "proposta_adesao", "documentacao_pendente", "adesao_concluida", "nao_convertido",
];

export function buildDashboardOverview(leads: AnalyticsLead[]) {
  const series = (values: string[], picker: (lead: AnalyticsLead) => string) =>
    values.map((label) => ({ label, value: leads.filter((lead) => picker(lead) === label).length }));
  const byDay = new Map<string, number>();
  leads.forEach((lead) => {
    const key = lead.createdAt.toISOString().slice(0, 10);
    byDay.set(key, (byDay.get(key) ?? 0) + 1);
  });
  const converted = leads.filter((lead) => lead.stage === "adesao_concluida").length;
  const firstContacts = leads.flatMap((lead) => {
    const entry = lead.stageHistory.find((history) => history.toStage === "contato_iniciado");
    return entry ? [(entry.createdAt.getTime() - lead.createdAt.getTime()) / 60_000] : [];
  });
  const metrics = [
    { key: "total", label: "Leads totais", value: leads.length, format: "number", deltaPercent: 0 },
    { key: "new", label: "Novos contatos", value: leads.filter((lead) => lead.stage === "novo_contato").length, format: "number", deltaPercent: 0 },
    { key: "proposals", label: "Propostas", value: leads.filter((lead) => lead.stage === "proposta_adesao").length, format: "number", deltaPercent: 0 },
    { key: "adhesions", label: "Adesões", value: converted, format: "number", deltaPercent: 0 },
    { key: "conversion", label: "Taxa de conversão", value: leads.length ? converted / leads.length * 100 : 0, format: "percent", deltaPercent: 0 },
    { key: "firstContact", label: "Tempo médio até primeiro contato", value: firstContacts.length ? firstContacts.reduce((sum, value) => sum + value, 0) / firstContacts.length : 0, format: "duration", deltaPercent: 0 },
  ];
  return {
    metrics,
    leadsOverTime: [...byDay].map(([label, value]) => ({ label, value })),
    funnel: series(STAGES, (lead) => lead.stage),
    bySource: series([...new Set(leads.map((lead) => lead.source))], (lead) => lead.source),
    byCampaign: series(leads.map((lead) => lead.campaign).filter((campaign): campaign is string => campaign !== null), (lead) => lead.campaign ?? ""),
    byCity: series([...new Set(leads.map((lead) => lead.city))], (lead) => lead.city),
    byOwner: series([...new Set(leads.map((lead) => lead.owner?.name ?? "Sem responsável"))], (lead) => lead.owner?.name ?? "Sem responsável"),
    conversionByChannel: [], conversionByDevice: [],
    lossReasons: series(leads.map((lead) => lead.lossReason).filter((reason): reason is string => reason !== null), (lead) => lead.lossReason ?? ""),
    byHour: [], conversionOverTime: [],
  };
}
