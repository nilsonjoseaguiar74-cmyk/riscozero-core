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
 * Conector genérico para APIs REST/JSON de terceiros e integrações de mídia
 * (Google Ads, Meta Ads, GA4, GTM, WhatsApp, conversões offline). Cada
 * fornecedor real possui endpoints e escopos próprios definidos em sua
 * documentação técnica; aqui apenas simulamos o contrato comum.
 */
export class GenericApiConnector implements AssociationSystemConnector {
  async testConnection(config: ConnectorConfig): Promise<ConnectionTestResult> {
    await delay(350);
    return {
      sucesso: true,
      status: "pronta_para_teste",
      mensagem: `Conexão simulada com ${config.nomeConexao} concluída.`,
      latenciaMs: 140,
      testadoEm: new Date().toISOString(),
    };
  }

  async getCapabilities(): Promise<ConnectorCapabilities> {
    await delay(100);
    return {
      fornecedor: "generic_api",
      suportaImportacao: true,
      suportaExportacao: true,
      suportaWebhook: false,
      suportaTesteDeConexao: true,
      entidadesSuportadas: ["leads", "associados"],
      observacoes: "Estrutura genérica; campos variam conforme a API contratada.",
    };
  }

  async getFieldDefinitions(entidade?: SyncEntity): Promise<ExternalFieldDefinition[]> {
    await delay(120);
    const fields: ExternalFieldDefinition[] = [
      {
        campo: "external_id",
        rotulo: "Identificador externo",
        tipo: "texto",
        obrigatorio: true,
        entidade: "leads",
      },
      {
        campo: "full_name",
        rotulo: "Nome completo",
        tipo: "texto",
        obrigatorio: true,
        entidade: "leads",
      },
      { campo: "phone", rotulo: "Telefone", tipo: "texto", obrigatorio: false, entidade: "leads" },
    ];
    return entidade ? fields.filter((f) => f.entidade === entidade) : fields;
  }

  async importAssociates(config: ConnectorConfig): Promise<SyncResult> {
    await delay(600);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "associados",
      direction: "import",
      seedKey: `${config.id}-generic-associados`,
      durationMs: 600,
    });
  }

  async importVehicles(config: ConnectorConfig): Promise<SyncResult> {
    await delay(600);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "veiculos",
      direction: "import",
      seedKey: `${config.id}-generic-veiculos`,
      durationMs: 600,
    });
  }

  async importMemberships(config: ConnectorConfig): Promise<SyncResult> {
    await delay(600);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "adesoes",
      direction: "import",
      seedKey: `${config.id}-generic-adesoes`,
      durationMs: 600,
    });
  }

  async importOccurrences(config: ConnectorConfig): Promise<SyncResult> {
    await delay(500);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "ocorrencias",
      direction: "import",
      seedKey: `${config.id}-generic-ocorrencias`,
      durationMs: 500,
    });
  }

  async importFinancialSummary(config: ConnectorConfig): Promise<SyncResult> {
    await delay(500);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "situacao_financeira",
      direction: "import",
      seedKey: `${config.id}-generic-financeiro`,
      durationMs: 500,
    });
  }

  async exportLead(config: ConnectorConfig, leadId: string): Promise<SyncResult> {
    await delay(350);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "leads",
      direction: "export",
      seedKey: `${config.id}-generic-lead-${leadId}`,
      durationMs: 350,
    });
  }

  async exportMembership(
    config: ConnectorConfig,
    request: MembershipExportRequest,
  ): Promise<SyncResult> {
    await delay(350);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "adesoes",
      direction: "export",
      seedKey: `${config.id}-generic-${request.membershipId}`,
      durationMs: 350,
    });
  }

  async syncStatus(config: ConnectorConfig, entidade: SyncEntity): Promise<SyncResult> {
    await delay(250);
    return buildSyncResult({
      connectorId: config.id,
      entidade,
      direction: "import",
      seedKey: `${config.id}-generic-status-${entidade}`,
      durationMs: 250,
    });
  }

  async retryOperation(config: ConnectorConfig, correlationId: string): Promise<SyncResult> {
    await delay(300);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "leads",
      direction: "export",
      seedKey: `retry-generic-${correlationId}`,
      durationMs: 300,
    });
  }
}
