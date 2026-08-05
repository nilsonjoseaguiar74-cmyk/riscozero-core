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
 * Conector de exportação via arquivo CSV, para envio de leads e adesões a
 * sistemas que ainda não possuem integração via API.
 */
export class CsvExportConnector implements AssociationSystemConnector {
  async testConnection(config: ConnectorConfig): Promise<ConnectionTestResult> {
    await delay(150);
    return {
      sucesso: true,
      status: "pronta_para_teste",
      mensagem: `Exportador de CSV para ${config.nomeConexao} pronto para gerar arquivos.`,
      latenciaMs: 20,
      testadoEm: new Date().toISOString(),
    };
  }

  async getCapabilities(): Promise<ConnectorCapabilities> {
    await delay(80);
    return {
      fornecedor: "csv_export",
      suportaImportacao: false,
      suportaExportacao: true,
      suportaWebhook: false,
      suportaTesteDeConexao: true,
      entidadesSuportadas: ["leads", "adesoes"],
      observacoes: "Layout de exportação é definido junto ao sistema de destino.",
    };
  }

  async getFieldDefinitions(entidade?: SyncEntity): Promise<ExternalFieldDefinition[]> {
    await delay(80);
    const fields: ExternalFieldDefinition[] = [
      { campo: "nome", rotulo: "Nome", tipo: "texto", obrigatorio: true, entidade: "leads" },
      {
        campo: "telefone",
        rotulo: "Telefone",
        tipo: "texto",
        obrigatorio: true,
        entidade: "leads",
      },
      {
        campo: "protocolo_adesao",
        rotulo: "Protocolo de adesão",
        tipo: "texto",
        obrigatorio: true,
        entidade: "adesoes",
      },
    ];
    return entidade ? fields.filter((f) => f.entidade === entidade) : fields;
  }

  async importAssociates(config: ConnectorConfig): Promise<SyncResult> {
    await delay(300);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "associados",
      direction: "export",
      seedKey: `${config.id}-csvexp-associados`,
      durationMs: 300,
    });
  }

  async importVehicles(config: ConnectorConfig): Promise<SyncResult> {
    await delay(300);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "veiculos",
      direction: "export",
      seedKey: `${config.id}-csvexp-veiculos`,
      durationMs: 300,
    });
  }

  async importMemberships(config: ConnectorConfig): Promise<SyncResult> {
    await delay(300);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "adesoes",
      direction: "export",
      seedKey: `${config.id}-csvexp-adesoes`,
      durationMs: 300,
    });
  }

  async importOccurrences(config: ConnectorConfig): Promise<SyncResult> {
    await delay(250);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "ocorrencias",
      direction: "export",
      seedKey: `${config.id}-csvexp-ocorrencias`,
      durationMs: 250,
    });
  }

  async importFinancialSummary(config: ConnectorConfig): Promise<SyncResult> {
    await delay(250);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "situacao_financeira",
      direction: "export",
      seedKey: `${config.id}-csvexp-financeiro`,
      durationMs: 250,
    });
  }

  async exportLead(config: ConnectorConfig, leadId: string): Promise<SyncResult> {
    await delay(300);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "leads",
      direction: "export",
      seedKey: `${config.id}-csvexp-lead-${leadId}`,
      durationMs: 300,
    });
  }

  async exportMembership(
    config: ConnectorConfig,
    request: MembershipExportRequest,
  ): Promise<SyncResult> {
    await delay(300);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "adesoes",
      direction: "export",
      seedKey: `${config.id}-csvexp-${request.membershipId}`,
      durationMs: 300,
    });
  }

  async syncStatus(config: ConnectorConfig, entidade: SyncEntity): Promise<SyncResult> {
    await delay(180);
    return buildSyncResult({
      connectorId: config.id,
      entidade,
      direction: "export",
      seedKey: `${config.id}-csvexp-status-${entidade}`,
      durationMs: 180,
    });
  }

  async retryOperation(config: ConnectorConfig, correlationId: string): Promise<SyncResult> {
    await delay(250);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "leads",
      direction: "export",
      seedKey: `retry-csvexp-${correlationId}`,
      durationMs: 250,
    });
  }
}
