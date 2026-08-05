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
 * Conector de eventos via webhook (entrada e saída). A URL de destino real,
 * assinatura de payload e política de reentrega dependem do sistema
 * contratado; aqui simulamos apenas o comportamento de recebimento/retry.
 */
export class WebhookConnector implements AssociationSystemConnector {
  async testConnection(config: ConnectorConfig): Promise<ConnectionTestResult> {
    await delay(300);
    return {
      sucesso: true,
      status: "conectada",
      mensagem: `Endpoint de webhook para ${config.nomeConexao} simulado como ativo.`,
      latenciaMs: 90,
      testadoEm: new Date().toISOString(),
    };
  }

  async getCapabilities(): Promise<ConnectorCapabilities> {
    await delay(100);
    return {
      fornecedor: "webhook",
      suportaImportacao: true,
      suportaExportacao: false,
      suportaWebhook: true,
      suportaTesteDeConexao: true,
      entidadesSuportadas: ["leads", "status_adesao", "ocorrencias"],
      observacoes:
        "Eventos são recebidos de forma assíncrona; reentrega segue política de tentativas.",
    };
  }

  async getFieldDefinitions(entidade?: SyncEntity): Promise<ExternalFieldDefinition[]> {
    await delay(90);
    const fields: ExternalFieldDefinition[] = [
      {
        campo: "event_type",
        rotulo: "Tipo de evento",
        tipo: "texto",
        obrigatorio: true,
        entidade: "leads",
      },
      {
        campo: "payload",
        rotulo: "Corpo do evento",
        tipo: "texto",
        obrigatorio: true,
        entidade: "leads",
      },
    ];
    return entidade ? fields.filter((f) => f.entidade === entidade) : fields;
  }

  async importAssociates(config: ConnectorConfig): Promise<SyncResult> {
    await delay(300);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "associados",
      direction: "import",
      seedKey: `${config.id}-webhook-associados`,
      durationMs: 300,
    });
  }

  async importVehicles(config: ConnectorConfig): Promise<SyncResult> {
    await delay(300);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "veiculos",
      direction: "import",
      seedKey: `${config.id}-webhook-veiculos`,
      durationMs: 300,
    });
  }

  async importMemberships(config: ConnectorConfig): Promise<SyncResult> {
    await delay(300);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "adesoes",
      direction: "import",
      seedKey: `${config.id}-webhook-adesoes`,
      durationMs: 300,
    });
  }

  async importOccurrences(config: ConnectorConfig): Promise<SyncResult> {
    await delay(280);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "ocorrencias",
      direction: "import",
      seedKey: `${config.id}-webhook-ocorrencias`,
      durationMs: 280,
    });
  }

  async importFinancialSummary(config: ConnectorConfig): Promise<SyncResult> {
    await delay(280);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "situacao_financeira",
      direction: "import",
      seedKey: `${config.id}-webhook-financeiro`,
      durationMs: 280,
    });
  }

  async exportLead(config: ConnectorConfig, leadId: string): Promise<SyncResult> {
    await delay(250);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "leads",
      direction: "export",
      seedKey: `${config.id}-webhook-lead-${leadId}`,
      durationMs: 250,
    });
  }

  async exportMembership(
    config: ConnectorConfig,
    request: MembershipExportRequest,
  ): Promise<SyncResult> {
    await delay(250);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "adesoes",
      direction: "export",
      seedKey: `${config.id}-webhook-${request.membershipId}`,
      durationMs: 250,
    });
  }

  async syncStatus(config: ConnectorConfig, entidade: SyncEntity): Promise<SyncResult> {
    await delay(200);
    return buildSyncResult({
      connectorId: config.id,
      entidade,
      direction: "import",
      seedKey: `${config.id}-webhook-status-${entidade}`,
      durationMs: 200,
    });
  }

  async retryOperation(config: ConnectorConfig, correlationId: string): Promise<SyncResult> {
    await delay(250);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "status_adesao",
      direction: "import",
      seedKey: `retry-webhook-${correlationId}`,
      durationMs: 250,
    });
  }
}
