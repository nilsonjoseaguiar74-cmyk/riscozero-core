import { PrismaClient, UserRole } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();
const ASSOCIATION_ID = "00000000-0000-4000-8000-000000000001";
const ids = {
  admin: "00000000-0000-4000-8000-000000000101", manager: "00000000-0000-4000-8000-000000000102",
  sales: "00000000-0000-4000-8000-000000000103", traffic: "00000000-0000-4000-8000-000000000104",
  developer: "00000000-0000-4000-8000-000000000105",
};

const required = (name: string): string => {
  const value = process.env[name];
  if (!value || value.length < 8) throw new Error(`${name} deve ser definida com pelo menos 8 caracteres.`);
  return value;
};

async function user(id: string, name: string, email: string, role: UserRole, password: string) {
  return prisma.user.upsert({ where: { id }, update: { name, email, role, passwordHash: await argon2.hash(password) },
    create: { id, associationId: ASSOCIATION_ID, name, email, role, passwordHash: await argon2.hash(password) } });
}

async function main() {
  await prisma.association.upsert({ where: { id: ASSOCIATION_ID }, update: {}, create: { id: ASSOCIATION_ID, name: "Risco Zero — Demonstração" } });
  await user(ids.admin, "Ana Administradora", "admin@riscozero.demo", "administrador", required("DEMO_ADMIN_PASSWORD"));
  await user(ids.manager, "Marcelo Gestor", "gestor@riscozero.demo", "gestor", required("DEMO_MANAGER_PASSWORD"));
  await user(ids.sales, "Juliana Comercial", "comercial@riscozero.demo", "comercial", required("DEMO_SALES_PASSWORD"));
  await user(ids.traffic, "Camila Tráfego", "trafego@riscozero.demo", "gestor_trafego", required("DEMO_TRAFFIC_PASSWORD"));
  await user(ids.developer, "Diego Desenvolvedor", "dev@riscozero.demo", "desenvolvedor", required("DEMO_DEVELOPER_PASSWORD"));

  const leadSeeds = [
    ["00000000-0000-4000-8000-000000001001", "Bruno Machado", "5548991111001", "ABC1D23", "São José", "novo_contato", "Google", "protecao-sc"],
    ["00000000-0000-4000-8000-000000001002", "Carla Fontana", "5548991111002", "DEF2E34", "Florianópolis", "contato_iniciado", "Meta", "cotacao-agosto"],
    ["00000000-0000-4000-8000-000000001003", "Eduardo Amorim", "5548991111003", "GHI3F45", "Palhoça", "opcoes_apresentadas", "Google", "protecao-sc"],
    ["00000000-0000-4000-8000-000000001004", "Fernanda Schmitt", "5548991111004", "JKL4G56", "Biguaçu", "proposta_adesao", "Meta", "cotacao-agosto"],
    ["00000000-0000-4000-8000-000000001005", "Gustavo Peixoto", "5548991111005", "MNO5H67", "São José", "adesao_concluida", "Indicação", null],
    ["00000000-0000-4000-8000-000000001006", "Helena Cardoso", "5548991111006", "PQR6I78", "Florianópolis", "nao_convertido", "Direto", null],
  ] as const;
  for (let index = 0; index < leadSeeds.length; index += 1) {
    const [id, name, whatsapp, plate, city, stage, source, campaign] = leadSeeds[index];
    await prisma.lead.upsert({ where: { id }, update: {}, create: { id, associationId: ASSOCIATION_ID, name, whatsapp, plate, city,
      vehicleType: "carro", vehicleYear: String(2018 + index), contactPreference: "whatsapp", stage, source, campaign,
      ownerId: index === 0 ? null : ids.sales, lossReason: stage === "nao_convertido" ? "sem_interesse" : null,
      consent: { create: { associationId: ASSOCIATION_ID, granted: true, version: "v1.0" } },
      tracking: { create: { associationId: ASSOCIATION_ID, utmSource: source, utmMedium: source === "Direto" ? null : "cpc", utmCampaign: campaign, landingPage: "/solicitar-cotacao", deviceType: index % 2 ? "mobile" : "desktop", conversionCta: "pagina_cotacao" } },
      stageHistory: { create: { associationId: ASSOCIATION_ID, toStage: stage } } } });
  }
  await prisma.leadActivity.upsert({ where: { id: "00000000-0000-4000-8000-000000002001" }, update: {}, create: { id: "00000000-0000-4000-8000-000000002001", associationId: ASSOCIATION_ID, leadId: leadSeeds[1][0], authorId: ids.sales, type: "ligacao", title: "Primeiro contato realizado", description: "Cliente pediu retorno no período da tarde." } });
  await prisma.leadTask.upsert({ where: { id: "00000000-0000-4000-8000-000000003001" }, update: {}, create: { id: "00000000-0000-4000-8000-000000003001", associationId: ASSOCIATION_ID, leadId: leadSeeds[2][0], ownerId: ids.sales, title: "Retornar com opções", dueAt: new Date("2026-08-06T12:00:00Z") } });

  const members = [
    ["00000000-0000-4000-8000-000000004001", "RZ-DEMO-001", "Gustavo Peixoto", "***.111.111-**", "5548991111005", "gustavo@example.test", "São José"],
    ["00000000-0000-4000-8000-000000004002", "RZ-DEMO-002", "Mariana Vieira", "***.222.222-**", "5548992222002", "mariana@example.test", "Florianópolis"],
  ] as const;
  for (const [id, code, name, cpfMasked, whatsapp, email, city] of members) await prisma.member.upsert({ where: { id }, update: {}, create: { id, associationId: ASSOCIATION_ID, code, name, cpfMasked, whatsapp, email, city, address: "Endereço fictício para demonstração", status: "ativo", joinedAt: new Date("2026-01-15T12:00:00Z"), financialSituation: "em_dia" } });
  await prisma.vehicle.upsert({ where: { id: "00000000-0000-4000-8000-000000005001" }, update: {}, create: { id: "00000000-0000-4000-8000-000000005001", associationId: ASSOCIATION_ID, memberId: members[0][0], plate: "MNO5H67", brand: "Volkswagen", model: "Polo", year: 2021, category: "carro", status: "ativo", inspectionStatus: "aprovada", tracker: true, protectionOption: "Plano demonstração" } });
  await prisma.vehicle.upsert({ where: { id: "00000000-0000-4000-8000-000000005002" }, update: {}, create: { id: "00000000-0000-4000-8000-000000005002", associationId: ASSOCIATION_ID, memberId: members[1][0], plate: "TST2D34", brand: "Honda", model: "City", year: 2020, category: "carro", status: "ativo", inspectionStatus: "aprovada", tracker: false, protectionOption: "Plano demonstração" } });
  await prisma.membership.upsert({ where: { id: "00000000-0000-4000-8000-000000006001" }, update: {}, create: { id: "00000000-0000-4000-8000-000000006001", associationId: ASSOCIATION_ID, leadId: leadSeeds[4][0], memberId: members[0][0], candidateName: members[0][2], candidateWhatsapp: members[0][4], city: members[0][6], vehicleSummary: "Volkswagen Polo 2021", stage: "ativa", startedAt: new Date("2026-01-10T12:00:00Z"), activatedAt: new Date("2026-01-15T12:00:00Z") } });

  const campaigns = [
    ["00000000-0000-4000-8000-000000007001", "protecao-sc", "Proteção SC — demonstração", "google_ads"],
    ["00000000-0000-4000-8000-000000007002", "cotacao-agosto", "Cotação Agosto — demonstração", "meta_ads"],
  ] as const;
  for (const [id, externalKey, name, channel] of campaigns) {
    await prisma.campaign.upsert({ where: { id }, update: {}, create: { id, associationId: ASSOCIATION_ID, externalKey, name, channel, status: "ativa", objective: "geracao_leads", metrics: { create: [{ associationId: ASSOCIATION_ID, date: new Date("2026-08-01T00:00:00Z"), investment: channel === "google_ads" ? 850 : 640, impressions: channel === "google_ads" ? 28000 : 35000, clicks: channel === "google_ads" ? 620 : 510 }] } } });
  }

  const integrations = [
    ["siprov", "SIPROV", "Sistema associativo", "atendimento"], ["sga_hinova", "SGA / Hinova", "Sistema associativo", "atendimento"],
    ["generic_api", "API genérica", "Integração sob contrato", "desenvolvedor"], ["csv", "CSV", "Importação e exportação planejadas", "desenvolvedor"],
    ["webhook", "Webhooks", "Eventos externos planejados", "desenvolvedor"], ["whatsapp", "WhatsApp", "Mensageria futura", "atendimento"],
    ["google_ads", "Google Ads", "Mídia futura", "aquisicao"], ["meta_ads", "Meta Ads", "Mídia futura", "aquisicao"],
  ] as const;
  for (let i = 0; i < integrations.length; i += 1) { const [provider, name, description, category] = integrations[i]; const id = `00000000-0000-4000-8000-${String(8000 + i).padStart(12, "0")}`; await prisma.integrationCatalogItem.upsert({ where: { id }, update: {}, create: { id, associationId: ASSOCIATION_ID, provider, name, description, category, status: "planejada" } }); }
}

main().finally(() => prisma.$disconnect());
