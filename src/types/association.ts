/** Contratos de domínio da Gestão da Associação. */
import type { MetricSummary, SeriesPoint, VehicleType } from "@/types";

export type ExternalSystem = "siprov" | "sga" | "interno" | "csv";

export interface ExternalRef {
  system: string;
  id: string;
  protocol?: string | undefined;
}

export interface Syncable {
  externalRef?: ExternalRef | undefined;
  lastSyncAt?: string | undefined;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface BasePeriodFilter {
  from?: string | undefined;
  to?: string | undefined;
  page?: number | undefined;
  pageSize?: number | undefined;
  sortBy?: string | undefined;
  sortDir?: "asc" | "desc" | undefined;
  search?: string | undefined;
  city?: string | undefined;
  consultantId?: string | undefined;
  sistemaOrigem?: ExternalSystem | undefined;
}

/* ------------------------------- Associado ------------------------------- */

export type MemberStatus = "ativo" | "em_analise" | "inadimplente" | "suspenso" | "inativo";

export const MEMBER_STATUS_LABEL: Record<MemberStatus, string> = {
  ativo: "Ativo",
  em_analise: "Em análise",
  inadimplente: "Inadimplente",
  suspenso: "Suspenso",
  inativo: "Inativo",
};

export type FinancialSituation = "em_dia" | "atrasado" | "negociacao";

export const FINANCIAL_SITUATION_LABEL: Record<FinancialSituation, string> = {
  em_dia: "Em dia",
  atrasado: "Atrasado",
  negociacao: "Em negociação",
};

export interface MemberConsent {
  tipo: "lgpd" | "termos_adesao" | "comunicacao";
  aceitoEm: string;
  versao: string;
}

export interface MemberTimelineEntry {
  id: string;
  tipo: "nota" | "status" | "atendimento" | "documento" | "sincronizacao" | "financeiro";
  titulo: string;
  descricao?: string | undefined;
  autor: string;
  createdAt: string;
}

export interface Member extends Syncable {
  id: string;
  codigoInterno: string;
  codigoExterno?: string | undefined;
  nome: string;
  cpfMasked: string;
  cpfFull: string;
  whatsapp: string;
  email: string;
  cidade: string;
  endereco: string;
  status: MemberStatus;
  dataAdesao: string;
  veiculoIds: string[];
  consultorId?: string | undefined;
  consultorNome?: string | undefined;
  situacaoFinanceira: FinancialSituation;
  sistemaOrigem: ExternalSystem;
  ultimaSincronizacaoAt?: string | undefined;
  consentimentos: MemberConsent[];
  timeline: MemberTimelineEntry[];
}

export interface MemberFilters extends BasePeriodFilter {
  status?: MemberStatus | "todos" | undefined;
  situacaoFinanceira?: FinancialSituation | "todas" | undefined;
  vehicleType?: VehicleType | "todos" | undefined;
}

/* -------------------------------- Veículo -------------------------------- */

export type VehicleStatus = "ativo" | "em_analise" | "suspenso" | "removido";

export const VEHICLE_STATUS_LABEL: Record<VehicleStatus, string> = {
  ativo: "Ativo",
  em_analise: "Em análise",
  suspenso: "Suspenso",
  removido: "Removido",
};

export type InspectionQuickStatus = "pendente" | "aprovada" | "reprovada" | "nao_exigida";

export const INSPECTION_QUICK_STATUS_LABEL: Record<InspectionQuickStatus, string> = {
  pendente: "Pendente",
  aprovada: "Aprovada",
  reprovada: "Reprovada",
  nao_exigida: "Não exigida",
};

export interface VehicleDivergence {
  campo: string;
  valorInterno: string;
  valorExterno: string;
  detectadoEm: string;
}

export interface Vehicle extends Syncable {
  id: string;
  placa: string;
  memberId: string;
  marca: string;
  modelo: string;
  ano: number;
  categoria: VehicleType;
  status: VehicleStatus;
  vistoriaStatus: InspectionQuickStatus;
  rastreador: boolean;
  opcaoProtecao: string;
  codigoExterno?: string | undefined;
  sistemaOrigem: ExternalSystem;
  ultimaSincronizacaoAt?: string | undefined;
  fotos: string[];
  divergencias: VehicleDivergence[];
}

export interface VehicleFilters extends BasePeriodFilter {
  status?: VehicleStatus | "todos" | undefined;
  categoria?: VehicleType | "todos" | undefined;
  vistoriaStatus?: InspectionQuickStatus | "todas" | undefined;
  memberId?: string | undefined;
}

/* ------------------------------- Adesão ----------------------------------- */

export type MembershipStage =
  | "iniciada"
  | "documentacao_pendente"
  | "em_analise"
  | "vistoria_pendente"
  | "aguardando_assinatura"
  | "aguardando_integracao"
  | "enviada_erp"
  | "ativa"
  | "recusada"
  | "cancelada";

export const MEMBERSHIP_STAGES: { id: MembershipStage; label: string }[] = [
  { id: "iniciada", label: "Iniciada" },
  { id: "documentacao_pendente", label: "Documentação pendente" },
  { id: "em_analise", label: "Em análise" },
  { id: "vistoria_pendente", label: "Vistoria pendente" },
  { id: "aguardando_assinatura", label: "Aguardando assinatura" },
  { id: "aguardando_integracao", label: "Aguardando integração" },
  { id: "enviada_erp", label: "Enviada ao ERP" },
  { id: "ativa", label: "Ativa" },
  { id: "recusada", label: "Recusada" },
  { id: "cancelada", label: "Cancelada" },
];

export const MEMBERSHIP_STAGE_LABEL = Object.fromEntries(
  MEMBERSHIP_STAGES.map((s) => [s.id, s.label]),
) as Record<MembershipStage, string>;

export interface MembershipTimelineEntry {
  id: string;
  titulo: string;
  descricao?: string | undefined;
  autor: string;
  createdAt: string;
}

export interface Membership extends Syncable {
  id: string;
  leadId?: string | undefined;
  memberId?: string | undefined;
  candidatoNome: string;
  candidatoWhatsapp: string;
  cidade: string;
  veiculoResumo: string;
  consultorId?: string | undefined;
  consultorNome?: string | undefined;
  stage: MembershipStage;
  iniciadaEm: string;
  atualizadaEm: string;
  ativadaEm?: string | undefined;
  documentosPendentes: string[];
  timeline: MembershipTimelineEntry[];
}

export interface MembershipFilters extends BasePeriodFilter {
  stage?: MembershipStage | "todas" | undefined;
}

/* ------------------------------ Ocorrência -------------------------------- */

export type OccurrenceStatus =
  | "comunicada"
  | "documentacao_pendente"
  | "em_analise"
  | "aguardando_terceiro"
  | "aguardando_orcamento"
  | "em_reparo"
  | "concluida"
  | "indeferida"
  | "cancelada";

export const OCCURRENCE_STATUS_LABEL: Record<OccurrenceStatus, string> = {
  comunicada: "Comunicada",
  documentacao_pendente: "Documentação pendente",
  em_analise: "Em análise",
  aguardando_terceiro: "Aguardando terceiro",
  aguardando_orcamento: "Aguardando orçamento",
  em_reparo: "Em reparo",
  concluida: "Concluída",
  indeferida: "Indeferida",
  cancelada: "Cancelada",
};

export type OccurrenceType = "colisao" | "furto" | "roubo" | "incendio" | "avaria" | "outro";

export const OCCURRENCE_TYPE_LABEL: Record<OccurrenceType, string> = {
  colisao: "Colisão",
  furto: "Furto",
  roubo: "Roubo",
  incendio: "Incêndio",
  avaria: "Avaria",
  outro: "Outro",
};

export interface OccurrenceChecklistItem {
  documento: string;
  recebido: boolean;
}

export interface OccurrenceTimelineEntry {
  id: string;
  titulo: string;
  descricao?: string | undefined;
  autor: string;
  createdAt: string;
}

export interface Occurrence extends Syncable {
  id: string;
  protocolo: string;
  memberId: string;
  vehicleId: string;
  tipo: OccurrenceType;
  status: OccurrenceStatus;
  local: string;
  descricao: string;
  custoEstimado: number;
  custoAprovado?: number | undefined;
  comunicadaEm: string;
  atualizadaEm: string;
  checklist: OccurrenceChecklistItem[];
  timeline: OccurrenceTimelineEntry[];
}

export interface OccurrenceFilters extends BasePeriodFilter {
  status?: OccurrenceStatus | "todos" | undefined;
  tipo?: OccurrenceType | "todos" | undefined;
  memberId?: string | undefined;
}

/* ------------------------------ Assistência -------------------------------- */

export type AssistanceType =
  "reboque" | "pane" | "chaveiro" | "pneu" | "bateria" | "pane_seca" | "carro_reserva" | "outro";

export const ASSISTANCE_TYPE_LABEL: Record<AssistanceType, string> = {
  reboque: "Reboque",
  pane: "Pane mecânica",
  chaveiro: "Chaveiro",
  pneu: "Troca de pneu",
  bateria: "Bateria",
  pane_seca: "Pane seca",
  carro_reserva: "Carro reserva",
  outro: "Outro",
};

export type AssistanceStatus = "solicitada" | "em_atendimento" | "concluida" | "cancelada";

export const ASSISTANCE_STATUS_LABEL: Record<AssistanceStatus, string> = {
  solicitada: "Solicitada",
  em_atendimento: "Em atendimento",
  concluida: "Concluída",
  cancelada: "Cancelada",
};

export interface Assistance extends Syncable {
  id: string;
  protocolo: string;
  memberId: string;
  vehicleId: string;
  tipo: AssistanceType;
  status: AssistanceStatus;
  local: string;
  providerId?: string | undefined;
  solicitadaEm: string;
  concluidaEm?: string | undefined;
  custo: number;
}

export interface AssistanceFilters extends BasePeriodFilter {
  status?: AssistanceStatus | "todos" | undefined;
  tipo?: AssistanceType | "todos" | undefined;
  memberId?: string | undefined;
}

/* ------------------------------- Vistoria ---------------------------------- */

export type InspectionStatus =
  | "solicitada"
  | "agendada"
  | "em_andamento"
  | "enviada"
  | "em_analise"
  | "aprovada"
  | "correcao_necessaria"
  | "recusada";

export const INSPECTION_STATUS_LABEL: Record<InspectionStatus, string> = {
  solicitada: "Solicitada",
  agendada: "Agendada",
  em_andamento: "Em andamento",
  enviada: "Enviada",
  em_analise: "Em análise",
  aprovada: "Aprovada",
  correcao_necessaria: "Correção necessária",
  recusada: "Recusada",
};

export interface InspectionChecklistItem {
  item: string;
  ok: boolean;
}

export interface InspectionGeolocation {
  latitude: number;
  longitude: number;
  precisaoMetros: number;
}

export interface Inspection extends Syncable {
  id: string;
  memberId: string;
  vehicleId: string;
  status: InspectionStatus;
  agendadaPara?: string | undefined;
  realizadaEm?: string | undefined;
  checklist: InspectionChecklistItem[];
  fotos: string[];
  geolocalizacao?: InspectionGeolocation | undefined;
  observacoes?: string | undefined;
}

export interface InspectionFilters extends BasePeriodFilter {
  status?: InspectionStatus | "todas" | undefined;
  memberId?: string | undefined;
}

/* -------------------------------- Finanças --------------------------------- */

export interface FinanceSummary {
  valorPrevisto: number;
  valorRecebido: number;
  taxaInadimplencia: number;
  cobrancasEmitidas: number;
  cobrancasPagas: number;
  cobrancasVencidas: number;
}

export type BillingStatus = "emitida" | "paga" | "vencida" | "cancelada";

export const BILLING_STATUS_LABEL: Record<BillingStatus, string> = {
  emitida: "Emitida",
  paga: "Paga",
  vencida: "Vencida",
  cancelada: "Cancelada",
};

export interface Billing extends Syncable {
  id: string;
  memberId: string;
  referencia: string;
  competencia: string;
  valor: number;
  status: BillingStatus;
  emitidaEm: string;
  vencimento: string;
  pagaEm?: string | undefined;
  referenciaExterna?: string | undefined;
}

export interface BillingFilters extends BasePeriodFilter {
  status?: BillingStatus | "todas" | undefined;
  memberId?: string | undefined;
}

export interface Apportionment {
  id: string;
  competencia: string;
  descricao: string;
  valorTotal: number;
  quantidadeAssociados: number;
  valorPorAssociado: number;
  createdAt: string;
}

export interface DelinquencyRow {
  memberId: string;
  memberName: string;
  cidade: string;
  diasAtraso: number;
  valorEmAberto: number;
  situacao: FinancialSituation;
}

/* -------------------------------- Benefícios -------------------------------- */

export interface Benefit {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  ativo: boolean;
  utilizacoesMes: number;
}

/* ------------------------------- Consultores -------------------------------- */

export interface Consultant {
  id: string;
  userId: string;
  nome: string;
  cidade: string;
  adesoesMes: number;
  adesoesAno: number;
  tempoMedioConversaoDias: number;
  carteiraAtiva: number;
  taxaConversao: number;
}

export type ConsultantFilters = BasePeriodFilter;

/* -------------------------------- Prestadores -------------------------------- */

export interface Provider {
  id: string;
  nome: string;
  tipo: "guincho" | "oficina" | "chaveiro" | "borracharia" | "vidraçaria" | "outro";
  cidade: string;
  atendimentosMes: number;
  avaliacaoMedia: number;
  ativo: boolean;
}

export interface ProviderFilters extends BasePeriodFilter {
  tipo?: Provider["tipo"] | "todos" | undefined;
}

/* -------------------------------- Documentos --------------------------------- */

export type DocumentCategory =
  | "cnh"
  | "crlv"
  | "comprovante_residencia"
  | "termo_adesao"
  | "laudo_vistoria"
  | "boletim_ocorrencia"
  | "outro";

export const DOCUMENT_CATEGORY_LABEL: Record<DocumentCategory, string> = {
  cnh: "CNH",
  crlv: "CRLV",
  comprovante_residencia: "Comprovante de residência",
  termo_adesao: "Termo de adesão",
  laudo_vistoria: "Laudo de vistoria",
  boletim_ocorrencia: "Boletim de ocorrência",
  outro: "Outro",
};

export type DocumentStatus = "pendente" | "recebido" | "aprovado" | "rejeitado" | "vencido";

export const DOCUMENT_STATUS_LABEL: Record<DocumentStatus, string> = {
  pendente: "Pendente",
  recebido: "Recebido",
  aprovado: "Aprovado",
  rejeitado: "Rejeitado",
  vencido: "Vencido",
};

export interface AssociationDocument extends Syncable {
  id: string;
  categoria: DocumentCategory;
  status: DocumentStatus;
  memberId?: string | undefined;
  vehicleId?: string | undefined;
  occurrenceId?: string | undefined;
  nomeArquivo: string;
  validade?: string | undefined;
  enviadoEm: string;
}

export interface DocumentFilters extends BasePeriodFilter {
  categoria?: DocumentCategory | "todas" | undefined;
  status?: DocumentStatus | "todos" | undefined;
  memberId?: string | undefined;
}

/* -------------------------------- Dashboard --------------------------------- */

export interface AssociationDashboard {
  metrics: MetricSummary[];
  associadosAoLongoTempo: SeriesPoint[];
  adesoesPorPeriodo: SeriesPoint[];
  veiculosPorCategoria: SeriesPoint[];
  ocorrenciasPorCategoria: SeriesPoint[];
  ocorrenciasPorStatus: SeriesPoint[];
  assistenciasPorTipo: SeriesPoint[];
  inadimplenciaPorPeriodo: SeriesPoint[];
  arrecadacaoPorPeriodo: SeriesPoint[];
  adesoesPorConsultor: SeriesPoint[];
  associadosPorCidade: SeriesPoint[];
  origemDosAssociados: SeriesPoint[];
  conversaoLeadAssociado: SeriesPoint[];
  dadosSincronizadosPorSistema: SeriesPoint[];
}

export interface AssociationDashboardFilters {
  from?: string | undefined;
  to?: string | undefined;
  city?: string | undefined;
  consultantId?: string | undefined;
}
