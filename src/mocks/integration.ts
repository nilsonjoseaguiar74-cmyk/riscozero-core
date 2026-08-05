import type {
  ConnectorConfig,
  ConnectorSummary,
  FieldMapping,
  MediaIntegrationCard,
  SyncConflict,
  SyncEntityConfig,
  SyncLog,
  WebhookDelivery,
  WebhookEvent,
} from "@/types/integration";

function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}
const rand = seeded(918273645);
const pick = <T,>(list: readonly T[], r = rand()): T => list[Math.floor(r * list.length)]!;
const isoDaysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

function makeEntities(entities: SyncEntityConfig["entity"][], base: number): SyncEntityConfig[] {
  return entities.map((entity, i) => ({
    entity,
    habilitada: rand() > 0.15,
    direction: pick(["import", "export", "bidirectional"] as const),
    frequencia: { mode: pick(["manual", "agendada", "webhook"] as const), everyMinutes: 60 },
    campoIdentificador: `${entity}_id`,
    ultimaSincronizacaoAt: isoDaysAgo(i + base),
    resultado: pick(["sucesso", "parcial", "falha"] as const),
    registrosProcessados: 50 + Math.floor(rand() * 400),
    erros: Math.floor(rand() * 4),
    pendencias: Math.floor(rand() * 6),
  }));
}

export const MOCK_CONNECTORS: ConnectorConfig[] = [
  {
    id: "conn-siprov-1",
    nomeConexao: "SIPROV - Produção",
    fornecedor: "siprov",
    ambiente: "producao",
    baseUrl: "https://api.siprov.exemplo.com.br",
    associationId: "assoc-001",
    authMode: "api_key",
    usuarioTecnico: "integracao.siprov",
    secretMasked: "••••7F2A",
    direction: "bidirectional",
    schedule: { mode: "agendada", everyMinutes: 60, nextRunAt: isoDaysAgo(-0.04) },
    entidades: makeEntities(["associados", "beneficios", "ocorrencias", "cobrancas"], 1),
    timeoutMs: 15000,
    retryPolicy: { maxAttempts: 3, backoffSeconds: 30 },
    status: "conectada",
    criadaEm: isoDaysAgo(120),
    atualizadaEm: isoDaysAgo(1),
  },
  {
    id: "conn-sga-1",
    nomeConexao: "SGA/Hinova - Sandbox",
    fornecedor: "sga_hinova",
    ambiente: "sandbox",
    baseUrl: "https://sandbox.hinova.exemplo.com.br",
    associationId: "assoc-001",
    authMode: "oauth",
    usuarioTecnico: "gestor.integracao",
    secretMasked: "••••91BC",
    direction: "import",
    schedule: { mode: "manual" },
    entidades: makeEntities(["associados", "veiculos", "consultores", "vistorias", "situacao_financeira"], 2),
    timeoutMs: 20000,
    retryPolicy: { maxAttempts: 2, backoffSeconds: 45 },
    status: "conectada_com_alertas",
    criadaEm: isoDaysAgo(90),
    atualizadaEm: isoDaysAgo(3),
  },
  {
    id: "conn-generic-1",
    nomeConexao: "API do parceiro comercial",
    fornecedor: "generic_api",
    ambiente: "producao",
    baseUrl: "https://api.parceiro.exemplo.com",
    authMode: "token",
    secretMasked: "••••22D1",
    direction: "export",
    schedule: { mode: "manual" },
    entidades: makeEntities(["leads"], 5),
    timeoutMs: 10000,
    retryPolicy: { maxAttempts: 3, backoffSeconds: 20 },
    status: "pronta_para_teste",
    criadaEm: isoDaysAgo(30),
    atualizadaEm: isoDaysAgo(10),
  },
  {
    id: "conn-webhook-1",
    nomeConexao: "Webhook de eventos de adesão",
    fornecedor: "webhook",
    ambiente: "producao",
    authMode: "token",
    secretMasked: "••••00A9",
    direction: "import",
    schedule: { mode: "webhook" },
    entidades: makeEntities(["status_adesao", "ocorrencias"], 0),
    timeoutMs: 8000,
    retryPolicy: { maxAttempts: 5, backoffSeconds: 15 },
    status: "erro",
    criadaEm: isoDaysAgo(60),
    atualizadaEm: isoDaysAgo(0.5),
  },
  {
    id: "conn-csv-import-1",
    nomeConexao: "Importação mensal de associados",
    fornecedor: "csv_import",
    ambiente: "producao",
    authMode: "none",
    direction: "import",
    schedule: { mode: "manual" },
    entidades: makeEntities(["associados", "veiculos"], 15),
    timeoutMs: 5000,
    retryPolicy: { maxAttempts: 1, backoffSeconds: 0 },
    status: "pausada",
    criadaEm: isoDaysAgo(200),
    atualizadaEm: isoDaysAgo(15),
  },
  {
    id: "conn-csv-export-1",
    nomeConexao: "Exportação de leads para financeiro",
    fornecedor: "csv_export",
    ambiente: "producao",
    authMode: "none",
    direction: "export",
    schedule: { mode: "manual" },
    entidades: makeEntities(["leads"], 8),
    timeoutMs: 5000,
    retryPolicy: { maxAttempts: 1, backoffSeconds: 0 },
    status: "nao_configurada",
    criadaEm: isoDaysAgo(5),
    atualizadaEm: isoDaysAgo(5),
  },
];

export const MOCK_FIELD_MAPPINGS: FieldMapping[] = [
  { id: "map-1", connectorId: "conn-siprov-1", entidade: "associados", campoInterno: "whatsapp", rotuloInterno: "Telefone", campoExterno: "telefone_contato", rotuloExterno: "Telefone de contato", obrigatorio: true },
  { id: "map-2", connectorId: "conn-siprov-1", entidade: "associados", campoInterno: "documento", rotuloInterno: "CPF", campoExterno: "cpf_cnpj", rotuloExterno: "CPF/CNPJ", obrigatorio: true },
  { id: "map-3", connectorId: "conn-siprov-1", entidade: "veiculos", campoInterno: "plate", rotuloInterno: "Placa", campoExterno: "placa_veiculo", rotuloExterno: "Placa do veículo", obrigatorio: true },
  { id: "map-4", connectorId: "conn-siprov-1", entidade: "associados", campoInterno: "city", rotuloInterno: "Cidade", campoExterno: "municipio", rotuloExterno: "Município", obrigatorio: false },
  { id: "map-5", connectorId: "conn-siprov-1", entidade: "ocorrencias", campoInterno: "status", rotuloInterno: "Status", campoExterno: "status_ocorrencia", rotuloExterno: "Status da ocorrência", obrigatorio: true, transformacao: "mapa_de_valores" },
  { id: "map-6", connectorId: "conn-sga-1", entidade: "consultores", campoInterno: "ownerName", rotuloInterno: "Consultor", campoExterno: "id_consultor", rotuloExterno: "Identificador do consultor", obrigatorio: true },
  { id: "map-7", connectorId: "conn-sga-1", entidade: "associados", campoInterno: "id", rotuloInterno: "Código externo", campoExterno: "matricula_associado", rotuloExterno: "Matrícula do associado", obrigatorio: true },
  { id: "map-8", connectorId: "conn-sga-1", entidade: "adesoes", campoInterno: "protocol", rotuloInterno: "Protocolo", campoExterno: "codigo_proposta", rotuloExterno: "Código da proposta", obrigatorio: true },
  { id: "map-9", connectorId: "conn-sga-1", entidade: "situacao_financeira", campoInterno: "status", rotuloInterno: "Situação financeira", campoExterno: "saldo_devedor", rotuloExterno: "Saldo devedor", obrigatorio: false },
  { id: "map-10", connectorId: "conn-generic-1", entidade: "leads", campoInterno: "whatsapp", rotuloInterno: "Telefone", campoExterno: "phone", rotuloExterno: "Phone", obrigatorio: true },
];

const OPERACOES = ["Importação de associados", "Importação de veículos", "Exportação de leads", "Sincronização de status", "Importação de ocorrências", "Atualização de situação financeira"];
const ENTIDADES: SyncLog["entidade"][] = ["associados", "veiculos", "leads", "status_adesao", "ocorrencias", "situacao_financeira", "adesoes", "cobrancas"];
const RESULTADOS: SyncLog["resultado"][] = ["sucesso", "sucesso", "sucesso", "parcial", "falha"];

export const MOCK_SYNC_LOGS: SyncLog[] = Array.from({ length: 82 }, (_, i) => {
  const connector = pick(MOCK_CONNECTORS);
  const lidos = 10 + Math.floor(rand() * 300);
  const criados = Math.floor(lidos * rand() * 0.2);
  const atualizados = Math.floor(lidos * rand() * 0.4);
  const ignorados = Math.max(0, lidos - criados - atualizados);
  const resultado = pick(RESULTADOS);
  return {
    id: `log-${i + 1}`,
    connectorId: connector.id,
    fornecedor: connector.fornecedor,
    operacao: pick(OPERACOES),
    entidade: pick(ENTIDADES),
    direction: pick(["import", "export", "bidirectional"] as const),
    iniciadoEm: isoDaysAgo(rand() * 60),
    duracaoMs: 200 + Math.floor(rand() * 4000),
    registrosLidos: lidos,
    registrosCriados: criados,
    registrosAtualizados: atualizados,
    registrosIgnorados: ignorados,
    erros: resultado === "falha" ? 1 + Math.floor(rand() * 5) : resultado === "parcial" ? 1 + Math.floor(rand() * 2) : 0,
    resultado,
    correlationId: `corr-${1000 + i}`,
  };
});

const CAMPOS_CONFLITO = ["telefone", "cpf", "placa", "cidade", "status", "consultor", "codigo_externo", "protocolo", "situacao_financeira"];

export const MOCK_SYNC_CONFLICTS: SyncConflict[] = Array.from({ length: 25 }, (_, i) => {
  const connector = pick(MOCK_CONNECTORS);
  const campo = pick(CAMPOS_CONFLITO);
  return {
    id: `conf-${i + 1}`,
    connectorId: connector.id,
    entidade: pick(ENTIDADES),
    registroId: `reg-${2000 + i}`,
    campo,
    valorInterno: `valor_interno_${i}`,
    valorExterno: `valor_externo_${i}`,
    severidade: pick(["baixa", "media", "alta"] as const),
    sugestao: `Verificar divergência no campo ${campo} entre o CRM e o sistema associativo.`,
    status: pick(["pendente", "pendente", "resolvido", "ignorado"] as const),
    detectadoEm: isoDaysAgo(rand() * 30),
  };
});

export const MOCK_WEBHOOK_EVENTS: WebhookEvent[] = Array.from({ length: 18 }, (_, i) => {
  const connector = pick(MOCK_CONNECTORS.filter((c) => c.fornecedor === "webhook" || c.fornecedor === "sga_hinova"));
  return {
    id: `wev-${i + 1}`,
    connectorId: connector?.id ?? "conn-webhook-1",
    fornecedor: connector?.fornecedor ?? "webhook",
    evento: pick(["adesao.concluida", "ocorrencia.criada", "status.atualizado", "associado.atualizado"]),
    entidade: pick(["status_adesao", "ocorrencias", "adesoes", "associados"] as const),
    status: pick(["recebido", "processado", "processado", "falha", "ignorado"] as const),
    recebidoEm: isoDaysAgo(rand() * 20),
    payloadResumo: "{ \"id\": \"evt-" + (i + 1) + "\", \"tipo\": \"evento_simulado\" }",
  };
});

export const MOCK_WEBHOOK_DELIVERIES: WebhookDelivery[] = MOCK_WEBHOOK_EVENTS.map((event, i) => ({
  id: `wdl-${i + 1}`,
  eventId: event.id,
  destino: "https://interno.riscozero.exemplo/webhooks/receiver",
  status: pick([200, 200, 200, 500, 429]),
  tentativas: 1 + Math.floor(rand() * 3),
  duracaoMs: 80 + Math.floor(rand() * 500),
  enviadoEm: event.recebidoEm,
  sucesso: rand() > 0.2,
}));

export const MOCK_MEDIA_INTEGRATIONS: MediaIntegrationCard[] = [
  { fornecedor: "google_ads", nome: "Google Ads", descricao: "Importação de campanhas e conversões de aquisição.", status: "nao_configurada", categoria: "aquisicao" },
  { fornecedor: "meta_ads", nome: "Meta Ads", descricao: "Importação de campanhas do Facebook e Instagram.", status: "nao_configurada", categoria: "aquisicao" },
  { fornecedor: "ga4", nome: "Google Analytics 4", descricao: "Eventos de navegação e conversão do site.", status: "aguardando_credenciais", categoria: "analytics" },
  { fornecedor: "gtm", nome: "Google Tag Manager", descricao: "Gerenciamento de tags de rastreamento.", status: "nao_configurada", categoria: "analytics" },
  { fornecedor: "whatsapp", nome: "WhatsApp Business", descricao: "Envio e recebimento de mensagens com associados.", status: "configuracao_incompleta", categoria: "mensageria" },
  { fornecedor: "offline_conversions", nome: "Conversões offline", descricao: "Envio de adesões concluídas para plataformas de mídia.", status: "nao_configurada", categoria: "conversao" },
  { fornecedor: "webhook", nome: "Webhook de eventos", descricao: "Recepção de eventos externos em tempo real.", status: "erro", categoria: "conversao" },
];

export function connectorSummaries(): ConnectorSummary[] {
  return MOCK_CONNECTORS.map((c) => {
    const logs = MOCK_SYNC_LOGS.filter((l) => l.connectorId === c.id);
    const successCount = logs.filter((l) => l.resultado === "sucesso").length;
    return {
      connectorId: c.id,
      nomeConexao: c.nomeConexao,
      fornecedor: c.fornecedor,
      status: c.status,
      ambiente: c.ambiente,
      ultimaSincronizacaoAt: c.entidades[0]?.ultimaSincronizacaoAt,
      proximaSincronizacaoAt: c.schedule.nextRunAt,
      entidadesAtivas: c.entidades.filter((e) => e.habilitada).length,
      alertasAbertos: MOCK_SYNC_CONFLICTS.filter((cf) => cf.connectorId === c.id && cf.status === "pendente").length,
      taxaSucesso7dPercent: logs.length ? Number(((successCount / logs.length) * 100).toFixed(1)) : 100,
    };
  });
}
