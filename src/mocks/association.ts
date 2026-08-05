/** Dados determinísticos da Gestão da Associação. */
import { MOCK_LEADS, MOCK_USERS } from "@/mocks/data";
import { CITIES } from "@/config/site";
import type {
  AssociationDocument,
  Assistance,
  AssistanceType,
  Apportionment,
  Benefit,
  Billing,
  Consultant,
  DelinquencyRow,
  DocumentCategory,
  ExternalSystem,
  FinancialSituation,
  Inspection,
  InspectionQuickStatus,
  Member,
  MemberStatus,
  Membership,
  MembershipStage,
  Occurrence,
  OccurrenceType,
  Provider,
  Vehicle,
} from "@/types/association";
import type { VehicleType } from "@/types";

function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

const rand = seeded(48120026);
const pick = <T>(list: readonly T[], r = rand()): T => list[Math.floor(r * list.length)]!;
const int = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));

const NOW = new Date("2026-08-05T00:00:00.000Z").getTime();
const DAY = 86400000;
const CITY_LIST = [...CITIES];
const SISTEMAS: ExternalSystem[] = ["siprov", "sga", "interno", "csv"];
const FIRST = [
  "Ana",
  "Beatriz",
  "Caio",
  "Daniela",
  "Elias",
  "Fabiana",
  "Gabriel",
  "Heloísa",
  "Ivan",
  "Jaqueline",
  "Kauê",
  "Larissa",
  "Marcos",
  "Natália",
  "Otávio",
  "Priscila",
  "Renato",
  "Sabrina",
  "Thiago",
  "Ursula",
  "Vitor",
  "Wagner",
  "Yasmin",
  "Zeca",
];
const LAST = [
  "Almeida",
  "Barcelos",
  "Cordeiro",
  "Duarte",
  "Espíndola",
  "Farias",
  "Godinho",
  "Hess",
  "Inácio",
  "Jantsch",
  "Klein",
  "Lopes",
  "Medeiros",
  "Nogueira",
  "Osório",
  "Pacheco",
];
const STREETS = [
  "Rua das Palmeiras",
  "Av. Central",
  "Rua Beira Mar",
  "Rua das Acácias",
  "Av. das Torres",
];
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function plate(): string {
  const l = () => LETTERS[Math.floor(rand() * 26)]!;
  const d = () => Math.floor(rand() * 10);
  return `${l()}${l()}${l()}${d()}${l()}${d()}${d()}`;
}

function cpf(): { masked: string; full: string } {
  const n = () => int(0, 9);
  const digits = Array.from({ length: 9 }, n);
  const full = `${digits.slice(0, 3).join("")}.${digits.slice(3, 6).join("")}.${digits
    .slice(6, 9)
    .join("")}-${int(10, 99)}`;
  const masked = `${digits.slice(0, 3).join("")}.***.***-**`;
  return { masked, full };
}

/* ---------------------------- Consultores ---------------------------- */

const CONSULTANT_USERS = MOCK_USERS.filter((u) => u.role === "comercial" || u.role === "gestor");
export const MOCK_CONSULTANTS: Consultant[] = Array.from({ length: 6 }, (_, i) => {
  const base = CONSULTANT_USERS[i % CONSULTANT_USERS.length]!;
  return {
    id: `consultor-${i + 1}`,
    userId: base.id,
    nome: i < CONSULTANT_USERS.length ? base.name : `${pick(FIRST)} ${pick(LAST)}`,
    cidade: pick(CITY_LIST),
    adesoesMes: int(6, 24),
    adesoesAno: int(60, 210),
    tempoMedioConversaoDias: int(3, 21),
    carteiraAtiva: int(40, 180),
    taxaConversao: Number((int(18, 42) + rand()).toFixed(1)),
  } satisfies Consultant;
});

/* ---------------------------- Prestadores ---------------------------- */

const PROVIDER_TYPES: Provider["tipo"][] = [
  "guincho",
  "oficina",
  "chaveiro",
  "borracharia",
  "vidraçaria",
  "outro",
];
const PROVIDER_NAMES = [
  "Guincho Litoral",
  "Auto Center Fontana",
  "Chaveiro 24h São José",
  "Borracharia Vieira",
  "Vidraçaria Costa Sul",
  "Guincho Express SC",
  "Oficina Mecânica Kobrasol",
  "Chaveiro Rápido Palhoça",
  "Borracharia Continente",
  "Vidros & Cia Biguaçu",
  "Guincho Grande Fpolis",
  "Oficina Autoserv",
];
export const MOCK_PROVIDERS: Provider[] = PROVIDER_NAMES.map(
  (nome, i) =>
    ({
      id: `prestador-${i + 1}`,
      nome,
      tipo: PROVIDER_TYPES[i % PROVIDER_TYPES.length]!,
      cidade: pick(CITY_LIST),
      atendimentosMes: int(5, 60),
      avaliacaoMedia: Number((3.6 + rand() * 1.4).toFixed(1)),
      ativo: rand() > 0.12,
    }) satisfies Provider,
);

/* ------------------------------- Benefícios ---------------------------- */

export const MOCK_BENEFITS: Benefit[] = [
  {
    id: "beneficio-1",
    nome: "Assistência 24 horas",
    categoria: "Assistência",
    descricao: "Reboque, pane elétrica e mecânica em todo o território nacional.",
    ativo: true,
    utilizacoesMes: 68,
  },
  {
    id: "beneficio-2",
    nome: "Carro reserva",
    categoria: "Mobilidade",
    descricao: "Veículo reserva em caso de sinistro com reparo prolongado.",
    ativo: true,
    utilizacoesMes: 22,
  },
  {
    id: "beneficio-3",
    nome: "Chaveiro emergencial",
    categoria: "Assistência",
    descricao: "Atendimento para perda ou quebra de chaves.",
    ativo: true,
    utilizacoesMes: 14,
  },
  {
    id: "beneficio-4",
    nome: "Descontos em oficinas parceiras",
    categoria: "Convênio",
    descricao: "Descontos em revisões e peças na rede credenciada.",
    ativo: true,
    utilizacoesMes: 41,
  },
  {
    id: "beneficio-5",
    nome: "Proteção contra roubo e furto",
    categoria: "Proteção",
    descricao: "Cobertura mutualista para roubo, furto e incêndio.",
    ativo: true,
    utilizacoesMes: 9,
  },
  {
    id: "beneficio-6",
    nome: "Vidros e faróis",
    categoria: "Proteção",
    descricao: "Reparo e reposição de vidros e faróis danificados.",
    ativo: true,
    utilizacoesMes: 17,
  },
  {
    id: "beneficio-7",
    nome: "Indicação premiada",
    categoria: "Relacionamento",
    descricao: "Bonificação para associados que indicam novos participantes.",
    ativo: false,
    utilizacoesMes: 3,
  },
  {
    id: "beneficio-8",
    nome: "Telemedicina para motoristas",
    categoria: "Convênio",
    descricao: "Atendimento médico remoto para condutores associados.",
    ativo: true,
    utilizacoesMes: 12,
  },
];

/* -------------------------------- Associados ---------------------------- */

const MEMBER_STATUS_WEIGHTS: MemberStatus[] = [
  "ativo",
  "ativo",
  "ativo",
  "ativo",
  "ativo",
  "em_analise",
  "em_analise",
  "inadimplente",
  "inadimplente",
  "suspenso",
  "inativo",
];

const MEMBER_COUNT = 120;
export const MOCK_MEMBERS: Member[] = Array.from({ length: MEMBER_COUNT }, (_, i) => {
  const status = pick(MEMBER_STATUS_WEIGHTS);
  const dataAdesao = new Date(NOW - int(30, 900) * DAY);
  const consultant = pick(MOCK_CONSULTANTS);
  const sistemaOrigem = pick(SISTEMAS);
  const { masked, full } = cpf();
  const situacaoFinanceira: FinancialSituation =
    status === "inadimplente"
      ? pick(["atrasado", "negociacao"] as const)
      : status === "suspenso"
        ? "atrasado"
        : "em_dia";
  const nome = `${pick(FIRST)} ${pick(LAST)}`;
  return {
    id: `assoc-${String(i + 1).padStart(4, "0")}`,
    codigoInterno: `RZ-${String(1000 + i)}`,
    codigoExterno:
      sistemaOrigem !== "interno" ? `${sistemaOrigem.toUpperCase()}-${20000 + i}` : undefined,
    nome,
    cpfMasked: masked,
    cpfFull: full,
    whatsapp: `(48) 9${int(1000, 9999)}-${int(1000, 9999)}`,
    email: `${nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, ".")}@exemplo.com`,
    cidade: pick(CITY_LIST),
    endereco: `${pick(STREETS)}, ${int(10, 2400)}`,
    status,
    dataAdesao: dataAdesao.toISOString(),
    veiculoIds: [],
    consultorId: consultant.id,
    consultorNome: consultant.nome,
    situacaoFinanceira,
    sistemaOrigem,
    ultimaSincronizacaoAt:
      sistemaOrigem !== "interno" ? new Date(NOW - int(0, 20) * DAY).toISOString() : undefined,
    externalRef:
      sistemaOrigem !== "interno" ? { system: sistemaOrigem, id: `${20000 + i}` } : undefined,
    lastSyncAt:
      sistemaOrigem !== "interno" ? new Date(NOW - int(0, 20) * DAY).toISOString() : undefined,
    consentimentos: [
      { tipo: "lgpd", aceitoEm: dataAdesao.toISOString(), versao: "v1.0" },
      { tipo: "termos_adesao", aceitoEm: dataAdesao.toISOString(), versao: "v1.0" },
    ],
    timeline: [
      {
        id: `tl-${i}-0`,
        tipo: "status",
        titulo: "Adesão confirmada",
        autor: "Plataforma",
        createdAt: dataAdesao.toISOString(),
      },
    ],
  } satisfies Member;
});

/* -------------------------------- Veículos ------------------------------- */

const VEHICLE_CATEGORIES: VehicleType[] = [
  "carro",
  "moto",
  "caminhonete",
  "utilitario",
  "caminhao",
];
const BRANDS: Record<VehicleType, [string, string][]> = {
  carro: [
    ["Chevrolet", "Onix"],
    ["Volkswagen", "Gol"],
    ["Fiat", "Argo"],
    ["Hyundai", "HB20"],
  ],
  moto: [
    ["Honda", "CG 160"],
    ["Yamaha", "Fazer"],
    ["Honda", "Biz"],
  ],
  caminhonete: [
    ["Fiat", "Toro"],
    ["Chevrolet", "S10"],
    ["Volkswagen", "Saveiro"],
  ],
  utilitario: [
    ["Fiat", "Fiorino"],
    ["Renault", "Kangoo"],
  ],
  caminhao: [
    ["Volkswagen", "Delivery"],
    ["Mercedes-Benz", "Accelo"],
  ],
};

const VEHICLE_COUNT = 150;
export const MOCK_VEHICLES: Vehicle[] = Array.from({ length: VEHICLE_COUNT }, (_, i) => {
  const member = pick(MOCK_MEMBERS);
  const categoria = pick(VEHICLE_CATEGORIES);
  const [marca, modelo] = pick(BRANDS[categoria]);
  const sistemaOrigem = pick(SISTEMAS);
  const vistoriaStatus: InspectionQuickStatus = pick([
    "pendente",
    "aprovada",
    "aprovada",
    "reprovada",
    "nao_exigida",
  ] as const);
  const hasDivergence = rand() > 0.85;
  return {
    id: `veiculo-${String(i + 1).padStart(4, "0")}`,
    placa: plate(),
    memberId: member.id,
    marca,
    modelo,
    ano: int(2006, 2025),
    categoria,
    status: rand() > 0.9 ? "em_analise" : "ativo",
    vistoriaStatus,
    rastreador: rand() > 0.55,
    opcaoProtecao: pick(["Básica", "Intermediária", "Completa"]),
    codigoExterno:
      sistemaOrigem !== "interno" ? `${sistemaOrigem.toUpperCase()}-V${30000 + i}` : undefined,
    sistemaOrigem,
    ultimaSincronizacaoAt:
      sistemaOrigem !== "interno" ? new Date(NOW - int(0, 15) * DAY).toISOString() : undefined,
    externalRef:
      sistemaOrigem !== "interno" ? { system: sistemaOrigem, id: `${30000 + i}` } : undefined,
    lastSyncAt:
      sistemaOrigem !== "interno" ? new Date(NOW - int(0, 15) * DAY).toISOString() : undefined,
    fotos: ["foto-frontal.jpg", "foto-lateral.jpg", "foto-traseira.jpg"],
    divergencias: hasDivergence
      ? [
          {
            campo: "cor",
            valorInterno: "Prata",
            valorExterno: "Cinza",
            detectadoEm: new Date(NOW - int(1, 10) * DAY).toISOString(),
          },
        ]
      : [],
  } satisfies Vehicle;
});

MOCK_VEHICLES.forEach((vehicle) => {
  const member = MOCK_MEMBERS.find((m) => m.id === vehicle.memberId);
  if (member) member.veiculoIds.push(vehicle.id);
});

/* -------------------------------- Adesões -------------------------------- */

const STAGE_LIST: MembershipStage[] = [
  "iniciada",
  "documentacao_pendente",
  "em_analise",
  "vistoria_pendente",
  "aguardando_assinatura",
  "aguardando_integracao",
  "enviada_erp",
  "ativa",
  "ativa",
  "ativa",
  "recusada",
  "cancelada",
];

const convertedLeads = MOCK_LEADS.filter((l) => l.stage === "adesao_concluida").slice(0, 70);
const MEMBERSHIP_COUNT = 140;

export const MOCK_MEMBERSHIPS: Membership[] = Array.from({ length: MEMBERSHIP_COUNT }, (_, i) => {
  const lead = i < convertedLeads.length ? convertedLeads[i] : undefined;
  const stage = lead ? pick(["ativa", "ativa", "enviada_erp"] as const) : pick(STAGE_LIST);
  const iniciadaEm = new Date(lead ? new Date(lead.createdAt).getTime() : NOW - int(1, 400) * DAY);
  const atualizadaEm = new Date(iniciadaEm.getTime() + int(1, 25) * DAY);
  const consultant = pick(MOCK_CONSULTANTS);
  const member = stage === "ativa" && !lead ? pick(MOCK_MEMBERS) : undefined;
  return {
    id: `adesao-${String(i + 1).padStart(4, "0")}`,
    leadId: lead?.id,
    memberId: member?.id,
    candidatoNome: lead?.name ?? `${pick(FIRST)} ${pick(LAST)}`,
    candidatoWhatsapp: lead?.whatsapp ?? `(48) 9${int(1000, 9999)}-${int(1000, 9999)}`,
    cidade: lead?.city ?? pick(CITY_LIST),
    veiculoResumo: `${pick(VEHICLE_CATEGORIES)} ${int(2008, 2025)}`,
    consultorId: consultant.id,
    consultorNome: consultant.nome,
    stage,
    iniciadaEm: iniciadaEm.toISOString(),
    atualizadaEm: atualizadaEm.toISOString(),
    ativadaEm: stage === "ativa" ? atualizadaEm.toISOString() : undefined,
    documentosPendentes:
      stage === "documentacao_pendente" ? ["CNH", "Comprovante de residência"] : [],
    timeline: [
      {
        id: `adesao-${i}-tl-0`,
        titulo: "Adesão iniciada",
        autor: consultant.nome,
        createdAt: iniciadaEm.toISOString(),
      },
    ],
    externalRef:
      stage === "enviada_erp" || stage === "ativa"
        ? { system: "sga", id: `erp-${5000 + i}` }
        : undefined,
    lastSyncAt:
      stage === "enviada_erp" || stage === "ativa" ? atualizadaEm.toISOString() : undefined,
  } satisfies Membership;
});

/* ------------------------------- Ocorrências ------------------------------ */

const OCCURRENCE_TYPES: OccurrenceType[] = [
  "colisao",
  "furto",
  "roubo",
  "incendio",
  "avaria",
  "outro",
];
const OCCURRENCE_STATUSES = [
  "comunicada",
  "documentacao_pendente",
  "em_analise",
  "aguardando_terceiro",
  "aguardando_orcamento",
  "em_reparo",
  "concluida",
  "concluida",
  "indeferida",
  "cancelada",
] as const;

const OCCURRENCE_COUNT = 60;
export const MOCK_OCCURRENCES: Occurrence[] = Array.from({ length: OCCURRENCE_COUNT }, (_, i) => {
  const member = pick(MOCK_MEMBERS);
  const memberVehicles = MOCK_VEHICLES.filter((v) => v.memberId === member.id);
  const vehicle = memberVehicles[0] ?? pick(MOCK_VEHICLES);
  const comunicadaEm = new Date(NOW - int(1, 300) * DAY);
  const status = pick(OCCURRENCE_STATUSES);
  const custoEstimado = int(400, 18000);
  return {
    id: `ocorrencia-${String(i + 1).padStart(4, "0")}`,
    protocolo: `OC-${2026}${String(i + 1).padStart(5, "0")}`,
    memberId: member.id,
    vehicleId: vehicle.id,
    tipo: pick(OCCURRENCE_TYPES),
    status,
    local: `${pick(STREETS)}, ${pick(CITY_LIST)}`,
    descricao: "Ocorrência registrada pelo associado com detalhes do evento e local.",
    custoEstimado,
    custoAprovado: status === "concluida" ? Math.round(custoEstimado * 0.9) : undefined,
    comunicadaEm: comunicadaEm.toISOString(),
    atualizadaEm: new Date(comunicadaEm.getTime() + int(1, 20) * DAY).toISOString(),
    checklist: [
      { documento: "Boletim de ocorrência", recebido: rand() > 0.3 },
      { documento: "Fotos do veículo", recebido: rand() > 0.2 },
      { documento: "Laudo de vistoria", recebido: rand() > 0.5 },
    ],
    timeline: [
      {
        id: `ocorrencia-${i}-tl-0`,
        titulo: "Ocorrência comunicada",
        autor: member.nome,
        createdAt: comunicadaEm.toISOString(),
      },
    ],
  } satisfies Occurrence;
});

/* ------------------------------- Assistências ------------------------------ */

const ASSISTANCE_TYPES: AssistanceType[] = [
  "reboque",
  "pane",
  "chaveiro",
  "pneu",
  "bateria",
  "pane_seca",
  "carro_reserva",
  "outro",
];
const ASSISTANCE_STATUSES = [
  "solicitada",
  "em_atendimento",
  "concluida",
  "concluida",
  "cancelada",
] as const;

const ASSISTANCE_COUNT = 70;
export const MOCK_ASSISTANCES: Assistance[] = Array.from({ length: ASSISTANCE_COUNT }, (_, i) => {
  const member = pick(MOCK_MEMBERS);
  const memberVehicles = MOCK_VEHICLES.filter((v) => v.memberId === member.id);
  const vehicle = memberVehicles[0] ?? pick(MOCK_VEHICLES);
  const provider = pick(MOCK_PROVIDERS);
  const solicitadaEm = new Date(NOW - int(0, 200) * DAY);
  const status = pick(ASSISTANCE_STATUSES);
  return {
    id: `assistencia-${String(i + 1).padStart(4, "0")}`,
    protocolo: `AS-${2026}${String(i + 1).padStart(5, "0")}`,
    memberId: member.id,
    vehicleId: vehicle.id,
    tipo: pick(ASSISTANCE_TYPES),
    status,
    local: `${pick(STREETS)}, ${pick(CITY_LIST)}`,
    providerId: provider.id,
    solicitadaEm: solicitadaEm.toISOString(),
    concluidaEm:
      status === "concluida"
        ? new Date(solicitadaEm.getTime() + int(1, 5) * 3600000).toISOString()
        : undefined,
    custo: int(0, 650),
  } satisfies Assistance;
});

/* -------------------------------- Vistorias -------------------------------- */

const INSPECTION_STATUSES = [
  "solicitada",
  "agendada",
  "em_andamento",
  "enviada",
  "em_analise",
  "aprovada",
  "aprovada",
  "correcao_necessaria",
  "recusada",
] as const;

const INSPECTION_COUNT = 50;
export const MOCK_INSPECTIONS: Inspection[] = Array.from({ length: INSPECTION_COUNT }, (_, i) => {
  const vehicle = pick(MOCK_VEHICLES);
  const status = pick(INSPECTION_STATUSES);
  const agendadaPara = new Date(NOW + int(-20, 20) * DAY);
  return {
    id: `vistoria-${String(i + 1).padStart(4, "0")}`,
    memberId: vehicle.memberId,
    vehicleId: vehicle.id,
    status,
    agendadaPara: agendadaPara.toISOString(),
    realizadaEm:
      status === "aprovada" || status === "recusada" ? agendadaPara.toISOString() : undefined,
    checklist: [
      { item: "Lataria e pintura", ok: rand() > 0.2 },
      { item: "Pneus", ok: rand() > 0.15 },
      { item: "Documentação", ok: rand() > 0.1 },
    ],
    fotos: ["vistoria-frontal.jpg", "vistoria-motor.jpg", "vistoria-chassi.jpg"],
    geolocalizacao: {
      latitude: Number((-27.6 - rand() * 0.3).toFixed(5)),
      longitude: Number((-48.6 - rand() * 0.3).toFixed(5)),
      precisaoMetros: int(5, 40),
    },
    observacoes:
      status === "correcao_necessaria" ? "Foto do chassi ilegível, reenvio necessário." : undefined,
  } satisfies Inspection;
});

/* --------------------------------- Cobranças -------------------------------- */

const BILLING_STATUSES = ["emitida", "paga", "paga", "vencida", "cancelada"] as const;
export const MOCK_BILLINGS: Billing[] = MOCK_MEMBERS.flatMap((member, mi) => {
  const monthsBack = 3;
  return Array.from({ length: monthsBack }, (_, mIdx) => {
    const competenceDate = new Date(NOW - mIdx * 30 * DAY);
    const emitidaEm = new Date(competenceDate.getTime() - 5 * DAY);
    const vencimento = new Date(competenceDate.getTime() + 5 * DAY);
    const status =
      member.status === "inadimplente" && mIdx === 0 ? "vencida" : pick(BILLING_STATUSES);
    return {
      id: `cobranca-${member.id}-${mIdx}`,
      memberId: member.id,
      referencia: `${String(competenceDate.getMonth() + 1).padStart(2, "0")}/${competenceDate.getFullYear()}`,
      competencia: competenceDate.toISOString().slice(0, 7),
      valor: 89 + (mi % 5) * 6,
      status,
      emitidaEm: emitidaEm.toISOString(),
      vencimento: vencimento.toISOString(),
      pagaEm:
        status === "paga"
          ? new Date(vencimento.getTime() - int(0, 4) * DAY).toISOString()
          : undefined,
      referenciaExterna:
        member.sistemaOrigem !== "interno" ? `FIN-${member.codigoInterno}-${mIdx}` : undefined,
      externalRef:
        member.sistemaOrigem !== "interno"
          ? { system: member.sistemaOrigem, id: `${member.id}-${mIdx}` }
          : undefined,
      lastSyncAt: member.sistemaOrigem !== "interno" ? emitidaEm.toISOString() : undefined,
    } satisfies Billing;
  });
});

export const MOCK_APPORTIONMENTS: Apportionment[] = Array.from({ length: 6 }, (_, i) => {
  const competenceDate = new Date(NOW - i * 30 * DAY);
  const quantidadeAssociados = MOCK_MEMBERS.filter((m) => m.status === "ativo").length;
  const valorTotal = int(18000, 42000);
  return {
    id: `rateio-${i + 1}`,
    competencia: competenceDate.toISOString().slice(0, 7),
    descricao: "Rateio de sinistros e despesas administrativas do período",
    valorTotal,
    quantidadeAssociados,
    valorPorAssociado: Number((valorTotal / Math.max(1, quantidadeAssociados)).toFixed(2)),
    createdAt: competenceDate.toISOString(),
  } satisfies Apportionment;
});

export const MOCK_DELINQUENCY: DelinquencyRow[] = MOCK_MEMBERS.filter(
  (m) => m.situacaoFinanceira !== "em_dia",
).map(
  (member) =>
    ({
      memberId: member.id,
      memberName: member.nome,
      cidade: member.cidade,
      diasAtraso: int(5, 120),
      valorEmAberto: int(89, 620),
      situacao: member.situacaoFinanceira,
    }) satisfies DelinquencyRow,
);

/* -------------------------------- Documentos --------------------------------- */

const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  "cnh",
  "crlv",
  "comprovante_residencia",
  "termo_adesao",
  "laudo_vistoria",
  "boletim_ocorrencia",
  "outro",
];
const DOCUMENT_STATUSES = [
  "pendente",
  "recebido",
  "aprovado",
  "aprovado",
  "rejeitado",
  "vencido",
] as const;

const DOCUMENT_COUNT = 60;
export const MOCK_DOCUMENTS: AssociationDocument[] = Array.from(
  { length: DOCUMENT_COUNT },
  (_, i) => {
    const member = pick(MOCK_MEMBERS);
    const categoria = pick(DOCUMENT_CATEGORIES);
    const enviadoEm = new Date(NOW - int(1, 400) * DAY);
    const status = pick(DOCUMENT_STATUSES);
    const vehicle =
      categoria === "crlv" || categoria === "laudo_vistoria"
        ? MOCK_VEHICLES.find((v) => v.memberId === member.id)
        : undefined;
    const occurrence = categoria === "boletim_ocorrencia" ? pick(MOCK_OCCURRENCES) : undefined;
    return {
      id: `documento-${String(i + 1).padStart(4, "0")}`,
      categoria,
      status,
      memberId: member.id,
      vehicleId: vehicle?.id,
      occurrenceId: occurrence?.id,
      nomeArquivo: `${categoria}-${member.codigoInterno}.pdf`,
      validade:
        categoria === "cnh" || categoria === "crlv"
          ? new Date(NOW + int(-30, 400) * DAY).toISOString()
          : undefined,
      enviadoEm: enviadoEm.toISOString(),
      externalRef:
        member.sistemaOrigem !== "interno"
          ? { system: member.sistemaOrigem, id: `doc-${i}` }
          : undefined,
      lastSyncAt: member.sistemaOrigem !== "interno" ? enviadoEm.toISOString() : undefined,
    } satisfies AssociationDocument;
  },
);
