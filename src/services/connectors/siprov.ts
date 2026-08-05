import type { AssociationSystemConnector } from "@/services/connectors/index";
import { buildSyncResult, delay } from "@/services/connectors/base";
import type {
  ConnectionTestResult,
  ConnectorCapabilities,
  ConnectorConfig,
  ExternalFieldDefinition,
  MembershipExportRequest,
  SyncEntity,
  SyncResult,
} from "@/types/integration";

/**
 * Conector para o sistema SIPROV.
 * Endpoints reais, autenticação e limites de requisição dependem de
 * contratação e da documentação técnica oficial do SIPROV — não incluídos
 * aqui. Esta implementação é totalmente simulada para fins de demonstração.
 */
export class SiprovConnector implements AssociationSystemConnector {
  async testConnection(config: ConnectorConfig): Promise<ConnectionTestResult> {
    await delay(450);
    return {
      sucesso: true,
      status: "conectada",
      mensagem: `Conexão simulada com o SIPROV (${config.ambiente}) estabelecida com sucesso.`,
      latenciaMs: 180,
      testadoEm: new Date().toISOString(),
      detalhes: ["Autenticação validada", "Endpoint de associados respondeu corretamente"],
    };
  }

  async getCapabilities(): Promise<ConnectorCapabilities> {
    await delay(120);
    return {
      fornecedor: "siprov",
      suportaImportacao: true,
      suportaExportacao: true,
      suportaWebhook: false,
      suportaTesteDeConexao: true,
      entidadesSuportadas: ["associados", "beneficios", "ocorrencias", "cobrancas"],
      observacoes: "Contratos com rateio dependem de módulo financeiro habilitado pelo fornecedor.",
    };
  }

  async getFieldDefinitions(entidade?: SyncEntity): Promise<ExternalFieldDefinition[]> {
    await delay(150);
    const fields: ExternalFieldDefinition[] = [
      { campo: "cod_associado", rotulo: "Código do associado", tipo: "texto", obrigatorio: true, entidade: "associados" },
      { campo: "cpf_cnpj", rotulo: "CPF/CNPJ", tipo: "texto", obrigatorio: true, entidade: "associados" },
      { campo: "situacao_cadastral", rotulo: "Situação cadastral", tipo: "enumerado", obrigatorio: true, entidade: "associados", opcoes: ["ativo", "inadimplente", "cancelado"] },
      { campo: "cod_beneficio", rotulo: "Código do benefício", tipo: "texto", obrigatorio: true, entidade: "beneficios" },
      { campo: "descricao_beneficio", rotulo: "Descrição do benefício", tipo: "texto", obrigatorio: false, entidade: "beneficios" },
      { campo: "protocolo_ocorrencia", rotulo: "Protocolo da ocorrência", tipo: "texto", obrigatorio: true, entidade: "ocorrencias" },
      { campo: "status_ocorrencia", rotulo: "Status da ocorrência", tipo: "enumerado", obrigatorio: true, entidade: "ocorrencias", opcoes: ["aberta", "em_analise", "encerrada"] },
      { campo: "cod_boleto", rotulo: "Código do boleto", tipo: "texto", obrigatorio: true, entidade: "cobrancas" },
      { campo: "valor_rateio", rotulo: "Valor de rateio", tipo: "numero", obrigatorio: false, entidade: "cobrancas" },
    ];
    return entidade ? fields.filter((f) => f.entidade === entidade) : fields;
  }

  async importAssociates(config: ConnectorConfig): Promise<SyncResult> {
    await delay(900);
    return buildSyncResult({ connectorId: config.id, entidade: "associados", direction: "import", seedKey: `${config.id}-associados`, durationMs: 900 });
  }

  async importVehicles(config: ConnectorConfig): Promise<SyncResult> {
    await delay(700);
    return buildSyncResult({ connectorId: config.id, entidade: "veiculos", direction: "import", seedKey: `${config.id}-veiculos-siprov`, durationMs: 700 });
  }

  async importMemberships(config: ConnectorConfig): Promise<SyncResult> {
    await delay(800);
    return buildSyncResult({ connectorId: config.id, entidade: "adesoes", direction: "import", seedKey: `${config.id}-adesoes`, durationMs: 800 });
  }

  async importOccurrences(config: ConnectorConfig): Promise<SyncResult> {
    await delay(650);
    return buildSyncResult({ connectorId: config.id, entidade: "ocorrencias", direction: "import", seedKey: `${config.id}-ocorrencias`, durationMs: 650 });
  }

  async importFinancialSummary(config: ConnectorConfig): Promise<SyncResult> {
    await delay(750);
    return buildSyncResult({ connectorId: config.id, entidade: "situacao_financeira", direction: "import", seedKey: `${config.id}-financeiro-siprov`, durationMs: 750 });
  }

  async exportLead(config: ConnectorConfig, leadId: string): Promise<SyncResult> {
    await delay(400);
    return buildSyncResult({ connectorId: config.id, entidade: "leads", direction: "export", seedKey: `${config.id}-lead-${leadId}`, durationMs: 400 });
  }

  async exportMembership(config: ConnectorConfig, request: MembershipExportRequest): Promise<SyncResult> {
    await delay(500);
    return buildSyncResult({ connectorId: config.id, entidade: "adesoes", direction: "export", seedKey: `${config.id}-${request.membershipId}`, durationMs: 500 });
  }

  async syncStatus(config: ConnectorConfig, entidade: SyncEntity): Promise<SyncResult> {
    await delay(300);
    return buildSyncResult({ connectorId: config.id, entidade, direction: "import", seedKey: `${config.id}-status-${entidade}`, durationMs: 300 });
  }

  async retryOperation(config: ConnectorConfig, correlationId: string): Promise<SyncResult> {
    await delay(400);
    return buildSyncResult({ connectorId: config.id, entidade: "associados", direction: "import", seedKey: `retry-${correlationId}`, durationMs: 400 });
  }
}
