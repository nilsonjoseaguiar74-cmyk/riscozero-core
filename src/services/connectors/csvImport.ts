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
 * Conector de importação via arquivo CSV. Não depende de rede real: o
 * arquivo é fornecido pelo usuário e processado localmente na simulação.
 */
export class CsvImportConnector implements AssociationSystemConnector {
  async testConnection(config: ConnectorConfig): Promise<ConnectionTestResult> {
    await delay(150);
    return {
      sucesso: true,
      status: "pronta_para_teste",
      mensagem: `Importador de CSV para ${config.nomeConexao} pronto para receber arquivos.`,
      latenciaMs: 20,
      testadoEm: new Date().toISOString(),
    };
  }

  async getCapabilities(): Promise<ConnectorCapabilities> {
    await delay(80);
    return {
      fornecedor: "csv_import",
      suportaImportacao: true,
      suportaExportacao: false,
      suportaWebhook: false,
      suportaTesteDeConexao: true,
      entidadesSuportadas: ["associados", "veiculos", "adesoes"],
      observacoes: "Formato de colunas depende do modelo de planilha acordado com a associação.",
    };
  }

  async getFieldDefinitions(entidade?: SyncEntity): Promise<ExternalFieldDefinition[]> {
    await delay(80);
    const fields: ExternalFieldDefinition[] = [
      { campo: "nome", rotulo: "Nome", tipo: "texto", obrigatorio: true, entidade: "associados" },
      { campo: "cpf", rotulo: "CPF", tipo: "texto", obrigatorio: true, entidade: "associados" },
      { campo: "placa", rotulo: "Placa", tipo: "texto", obrigatorio: true, entidade: "veiculos" },
    ];
    return entidade ? fields.filter((f) => f.entidade === entidade) : fields;
  }

  async importAssociates(config: ConnectorConfig): Promise<SyncResult> {
    await delay(500);
    return buildSyncResult({ connectorId: config.id, entidade: "associados", direction: "import", seedKey: `${config.id}-csv-associados`, durationMs: 500 });
  }

  async importVehicles(config: ConnectorConfig): Promise<SyncResult> {
    await delay(500);
    return buildSyncResult({ connectorId: config.id, entidade: "veiculos", direction: "import", seedKey: `${config.id}-csv-veiculos`, durationMs: 500 });
  }

  async importMemberships(config: ConnectorConfig): Promise<SyncResult> {
    await delay(500);
    return buildSyncResult({ connectorId: config.id, entidade: "adesoes", direction: "import", seedKey: `${config.id}-csv-adesoes`, durationMs: 500 });
  }

  async importOccurrences(config: ConnectorConfig): Promise<SyncResult> {
    await delay(400);
    return buildSyncResult({ connectorId: config.id, entidade: "ocorrencias", direction: "import", seedKey: `${config.id}-csv-ocorrencias`, durationMs: 400 });
  }

  async importFinancialSummary(config: ConnectorConfig): Promise<SyncResult> {
    await delay(400);
    return buildSyncResult({ connectorId: config.id, entidade: "situacao_financeira", direction: "import", seedKey: `${config.id}-csv-financeiro`, durationMs: 400 });
  }

  async exportLead(config: ConnectorConfig, leadId: string): Promise<SyncResult> {
    await delay(200);
    return buildSyncResult({ connectorId: config.id, entidade: "leads", direction: "export", seedKey: `${config.id}-csv-lead-${leadId}`, durationMs: 200 });
  }

  async exportMembership(config: ConnectorConfig, request: MembershipExportRequest): Promise<SyncResult> {
    await delay(200);
    return buildSyncResult({ connectorId: config.id, entidade: "adesoes", direction: "export", seedKey: `${config.id}-csv-${request.membershipId}`, durationMs: 200 });
  }

  async syncStatus(config: ConnectorConfig, entidade: SyncEntity): Promise<SyncResult> {
    await delay(180);
    return buildSyncResult({ connectorId: config.id, entidade, direction: "import", seedKey: `${config.id}-csv-status-${entidade}`, durationMs: 180 });
  }

  async retryOperation(config: ConnectorConfig, correlationId: string): Promise<SyncResult> {
    await delay(250);
    return buildSyncResult({ connectorId: config.id, entidade: "associados", direction: "import", seedKey: `retry-csv-${correlationId}`, durationMs: 250 });
  }
}
