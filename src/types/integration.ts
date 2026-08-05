/**
 * Camada de integrações independente de fornecedor.
 * Todos os tipos aqui descrevem contratos genéricos; nenhum dado real de
 * credencial, URL de produção ou token é armazenado nestes tipos.
 */

export type ConnectorProvider =
  | "siprov"
  | "sga_hinova"
  | "generic_api"
  | "webhook"
  | "csv_import"
  | "csv_export"
  | "google_ads"
  | "meta_ads"
  | "ga4"
  | "gtm"
  | "whatsapp"
  | "offline_conversions";

export const CONNECTOR_PROVIDER_LABEL: Record<ConnectorProvider, string> = {
  siprov: "SIPROV",
  sga_hinova: "SGA / Hinova",
  generic_api: "API genérica",
  webhook: "Webhook",
  csv_import: "Importação de CSV",
  csv_export: "Exportação de CSV",
  google_ads: "Google Ads",
  meta_ads: "Meta Ads",
  ga4: "Google Analytics 4",
  gtm: "Google Tag Manager",
  whatsapp: "WhatsApp Business",
  offline_conversions: "Conversões offline",
};

export type ConnectorEnvironment = "sandbox" | "producao";

export const CONNECTOR_ENVIRONMENT_LABEL: Record<ConnectorEnvironment, string> = {
  sandbox: "Sandbox",
  producao: "Produção",
};

export type AuthMode = "none" | "api_key" | "oauth" | "basic" | "token";

export const AUTH_MODE_LABEL: Record<AuthMode, string> = {
  none: "Sem autenticação",
  api_key: "Chave de API",
  oauth: "OAuth 2.0",
  basic: "Usuário e senha",
  token: "Token de acesso",
};

export type SyncDirection = "import" | "export" | "bidirectional";

export const SYNC_DIRECTION_LABEL: Record<SyncDirection, string> = {
  import: "Importação",
  export: "Exportação",
  bidirectional: "Bidirecional",
};

export type SyncMode = "manual" | "agendada" | "webhook";

export const SYNC_MODE_LABEL: Record<SyncMode, string> = {
  manual: "Manual",
  agendada: "Agendada",
  webhook: "Via webhook",
};

export interface SyncSchedule {
  mode: SyncMode;
  cronExpression?: string | undefined;
  everyMinutes?: number | undefined;
  nextRunAt?: string | undefined;
}

export type SyncEntity =
  | "leads"
  | "associados"
  | "veiculos"
  | "adesoes"
  | "status_adesao"
  | "consultores"
  | "ocorrencias"
  | "assistencias"
  | "vistorias"
  | "cobrancas"
  | "situacao_financeira"
  | "beneficios"
  | "documentos"
  | "prestadores";

export const SYNC_ENTITY_LABEL: Record<SyncEntity, string> = {
  leads: "Leads",
  associados: "Associados",
  veiculos: "Veículos",
  adesoes: "Adesões",
  status_adesao: "Status de adesão",
  consultores: "Consultores",
  ocorrencias: "Ocorrências",
  assistencias: "Assistências",
  vistorias: "Vistorias",
  cobrancas: "Cobranças",
  situacao_financeira: "Situação financeira",
  beneficios: "Benefícios",
  documentos: "Documentos",
  prestadores: "Prestadores",
};

export type SyncResultStatus = "sucesso" | "parcial" | "falha";

export const SYNC_RESULT_STATUS_LABEL: Record<SyncResultStatus, string> = {
  sucesso: "Sucesso",
  parcial: "Parcial",
  falha: "Falha",
};

export interface RetryPolicy {
  maxAttempts: number;
  backoffSeconds: number;
  currentAttempt?: number | undefined;
}

export interface SyncEntityConfig {
  entity: SyncEntity;
  habilitada: boolean;
  direction: SyncDirection;
  frequencia: SyncSchedule;
  campoIdentificador: string;
  ultimaSincronizacaoAt?: string | undefined;
  resultado?: SyncResultStatus | undefined;
  registrosProcessados: number;
  erros: number;
  pendencias: number;
}

export type ConnectorStatus =
  | "nao_configurada"
  | "aguardando_credenciais"
  | "configuracao_incompleta"
  | "pronta_para_teste"
  | "conectada"
  | "sincronizando"
  | "conectada_com_alertas"
  | "erro"
  | "pausada";

export const CONNECTOR_STATUS_LABEL: Record<ConnectorStatus, string> = {
  nao_configurada: "Não configurada",
  aguardando_credenciais: "Aguardando credenciais",
  configuracao_incompleta: "Configuração incompleta",
  pronta_para_teste: "Pronta para teste",
  conectada: "Conectada",
  sincronizando: "Sincronizando",
  conectada_com_alertas: "Conectada com alertas",
  erro: "Erro",
  pausada: "Pausada",
};

export interface ConnectorConfig {
  id: string;
  nomeConexao: string;
  fornecedor: ConnectorProvider;
  ambiente: ConnectorEnvironment;
  baseUrl?: string | undefined;
  associationId?: string | undefined;
  authMode: AuthMode;
  usuarioTecnico?: string | undefined;
  /** Representação mascarada do segredo (ex.: "••••4F2A"). Nunca o valor real. */
  secretMasked?: string | undefined;
  direction: SyncDirection;
  schedule: SyncSchedule;
  entidades: SyncEntityConfig[];
  timeoutMs: number;
  retryPolicy: RetryPolicy;
  status: ConnectorStatus;
  criadaEm: string;
  atualizadaEm: string;
}

export interface ConnectorCapabilities {
  fornecedor: ConnectorProvider;
  suportaImportacao: boolean;
  suportaExportacao: boolean;
  suportaWebhook: boolean;
  suportaTesteDeConexao: boolean;
  entidadesSuportadas: SyncEntity[];
  observacoes?: string | undefined;
}

export interface ExternalFieldDefinition {
  campo: string;
  rotulo: string;
  tipo: "texto" | "numero" | "data" | "booleano" | "enumerado";
  obrigatorio: boolean;
  entidade: SyncEntity;
  opcoes?: string[] | undefined;
}

export interface FieldMapping {
  id: string;
  connectorId: string;
  entidade: SyncEntity;
  campoInterno: string;
  rotuloInterno: string;
  campoExterno: string;
  rotuloExterno: string;
  transformacao?: string | undefined;
  obrigatorio: boolean;
}

export interface ExternalReference {
  entidade: SyncEntity;
  idInterno: string;
  idExterno: string;
  fornecedor: ConnectorProvider;
  sincronizadoEm: string;
}

export interface ConnectionTestResult {
  sucesso: boolean;
  status: ConnectorStatus;
  mensagem: string;
  latenciaMs: number;
  testadoEm: string;
  detalhes?: string[] | undefined;
}

export interface SyncParams {
  connectorId: string;
  entidade: SyncEntity;
  direction: SyncDirection;
  disparadaPor?: string | undefined;
  filtros?: Record<string, string> | undefined;
}

export interface SyncError {
  registroId?: string | undefined;
  campo?: string | undefined;
  mensagem: string;
}

export interface SyncConflict {
  id: string;
  connectorId: string;
  entidade: SyncEntity;
  registroId: string;
  campo: string;
  valorInterno: string;
  valorExterno: string;
  severidade: "baixa" | "media" | "alta";
  sugestao: string;
  status: "pendente" | "resolvido" | "ignorado";
  detectadoEm: string;
}

export type ConflictResolution = "manter_interno" | "aceitar_externo" | "mesclar" | "ignorar";

export const CONFLICT_RESOLUTION_LABEL: Record<ConflictResolution, string> = {
  manter_interno: "Manter valor interno",
  aceitar_externo: "Aceitar valor externo",
  mesclar: "Mesclar valores",
  ignorar: "Ignorar conflito",
};

export interface SyncResult {
  id: string;
  connectorId: string;
  entidade: SyncEntity;
  direction: SyncDirection;
  status: SyncResultStatus;
  iniciadoEm: string;
  concluidoEm: string;
  duracaoMs: number;
  registrosLidos: number;
  registrosCriados: number;
  registrosAtualizados: number;
  registrosIgnorados: number;
  erros: SyncError[];
  correlationId: string;
}

export interface SyncLog {
  id: string;
  connectorId: string;
  fornecedor: ConnectorProvider;
  operacao: string;
  entidade: SyncEntity;
  direction: SyncDirection;
  iniciadoEm: string;
  duracaoMs: number;
  registrosLidos: number;
  registrosCriados: number;
  registrosAtualizados: number;
  registrosIgnorados: number;
  erros: number;
  resultado: SyncResultStatus;
  correlationId: string;
}

export interface SyncLogFilters {
  connectorId?: string | undefined;
  fornecedor?: ConnectorProvider | undefined;
  entidade?: SyncEntity | undefined;
  resultado?: SyncResultStatus | undefined;
  direction?: SyncDirection | undefined;
  from?: string | undefined;
  to?: string | undefined;
  search?: string | undefined;
  page?: number | undefined;
  pageSize?: number | undefined;
}

export type WebhookEventStatus = "recebido" | "processado" | "falha" | "ignorado";

export const WEBHOOK_EVENT_STATUS_LABEL: Record<WebhookEventStatus, string> = {
  recebido: "Recebido",
  processado: "Processado",
  falha: "Falha",
  ignorado: "Ignorado",
};

export interface WebhookEvent {
  id: string;
  connectorId: string;
  fornecedor: ConnectorProvider;
  evento: string;
  entidade: SyncEntity;
  status: WebhookEventStatus;
  recebidoEm: string;
  payloadResumo: string;
}

export interface WebhookDelivery {
  id: string;
  eventId: string;
  destino: string;
  status: number;
  tentativas: number;
  duracaoMs: number;
  enviadoEm: string;
  sucesso: boolean;
}

export interface MembershipExportRequest {
  connectorId: string;
  associadoId: string;
  membershipId: string;
  dados: Record<string, string>;
}

export interface ConnectorSummary {
  connectorId: string;
  nomeConexao: string;
  fornecedor: ConnectorProvider;
  status: ConnectorStatus;
  ambiente: ConnectorEnvironment;
  ultimaSincronizacaoAt?: string | undefined;
  proximaSincronizacaoAt?: string | undefined;
  entidadesAtivas: number;
  alertasAbertos: number;
  taxaSucesso7dPercent: number;
}

export interface CsvPreview {
  nomeArquivo: string;
  colunas: string[];
  amostraLinhas: string[][];
  totalLinhasEstimado: number;
}

export interface CsvValidationIssue {
  linha: number;
  coluna: string;
  mensagem: string;
  severidade: "aviso" | "erro";
}

export interface CsvValidationResult {
  valido: boolean;
  totalLinhas: number;
  totalErros: number;
  totalAvisos: number;
  issues: CsvValidationIssue[];
}

export interface MediaIntegrationCard {
  fornecedor: ConnectorProvider;
  nome: string;
  descricao: string;
  status: ConnectorStatus;
  categoria: "aquisicao" | "mensageria" | "analytics" | "conversao";
}
