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
 * Conector para o sistema SGA / Hinova.
 * A API real, autenticação por gestor/consultor e escopos de acesso
 * dependem de contratação e documentação técnica do fornecedor — esta
 * implementação é totalmente simulada.
 */
export class SgaHinovaConnector implements AssociationSystemConnector {
  async testConnection(config: ConnectorConfig): Promise<ConnectionTestResult> {
    await delay(500);
    return {
      sucesso: true,
      status: "conectada",
      mensagem: `Conexão simulada com o SGA/Hinova (${config.ambiente}) estabelecida com sucesso.`,
      latenciaMs: 210,
      testadoEm: new Date().toISOString(),
      detalhes: ["Escopo de gestor validado", "Endpoint de veículos respondeu corretamente"],
    };
  }

  async getCapabilities(): Promise<ConnectorCapabilities> {
    await delay(120);
    return {
      fornecedor: "sga_hinova",
      suportaImportacao: true,
      suportaExportacao: true,
      suportaWebhook: true,
      suportaTesteDeConexao: true,
      entidadesSuportadas: [
        "associados",
        "veiculos",
        "consultores",
        "vistorias",
        "situacao_financeira",
      ],
      observacoes:
        "Perfis de gestor e consultor possuem escopos distintos definidos pelo fornecedor.",
    };
  }

  async getFieldDefinitions(entidade?: SyncEntity): Promise<ExternalFieldDefinition[]> {
    await delay(150);
    const fields: ExternalFieldDefinition[] = [
      {
        campo: "id_gestor",
        rotulo: "Identificador do gestor",
        tipo: "texto",
        obrigatorio: true,
        entidade: "consultores",
      },
      {
        campo: "id_consultor",
        rotulo: "Identificador do consultor",
        tipo: "texto",
        obrigatorio: true,
        entidade: "consultores",
      },
      {
        campo: "matricula_associado",
        rotulo: "Matrícula do associado",
        tipo: "texto",
        obrigatorio: true,
        entidade: "associados",
      },
      {
        campo: "placa_veiculo",
        rotulo: "Placa do veículo",
        tipo: "texto",
        obrigatorio: true,
        entidade: "veiculos",
      },
      {
        campo: "modelo_veiculo",
        rotulo: "Modelo do veículo",
        tipo: "texto",
        obrigatorio: false,
        entidade: "veiculos",
      },
      {
        campo: "cod_vistoria",
        rotulo: "Código da vistoria",
        tipo: "texto",
        obrigatorio: true,
        entidade: "vistorias",
      },
      {
        campo: "resultado_vistoria",
        rotulo: "Resultado da vistoria",
        tipo: "enumerado",
        obrigatorio: true,
        entidade: "vistorias",
        opcoes: ["aprovada", "pendente", "reprovada"],
      },
      {
        campo: "saldo_devedor",
        rotulo: "Saldo devedor",
        tipo: "numero",
        obrigatorio: false,
        entidade: "situacao_financeira",
      },
    ];
    return entidade ? fields.filter((f) => f.entidade === entidade) : fields;
  }

  async importAssociates(config: ConnectorConfig): Promise<SyncResult> {
    await delay(850);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "associados",
      direction: "import",
      seedKey: `${config.id}-associados-sga`,
      durationMs: 850,
    });
  }

  async importVehicles(config: ConnectorConfig): Promise<SyncResult> {
    await delay(750);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "veiculos",
      direction: "import",
      seedKey: `${config.id}-veiculos-sga`,
      durationMs: 750,
    });
  }

  async importMemberships(config: ConnectorConfig): Promise<SyncResult> {
    await delay(700);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "adesoes",
      direction: "import",
      seedKey: `${config.id}-adesoes-sga`,
      durationMs: 700,
    });
  }

  async importOccurrences(config: ConnectorConfig): Promise<SyncResult> {
    await delay(600);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "vistorias",
      direction: "import",
      seedKey: `${config.id}-vistorias-sga`,
      durationMs: 600,
    });
  }

  async importFinancialSummary(config: ConnectorConfig): Promise<SyncResult> {
    await delay(700);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "situacao_financeira",
      direction: "import",
      seedKey: `${config.id}-financeiro-sga`,
      durationMs: 700,
    });
  }

  async exportLead(config: ConnectorConfig, leadId: string): Promise<SyncResult> {
    await delay(400);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "leads",
      direction: "export",
      seedKey: `${config.id}-lead-sga-${leadId}`,
      durationMs: 400,
    });
  }

  async exportMembership(
    config: ConnectorConfig,
    request: MembershipExportRequest,
  ): Promise<SyncResult> {
    await delay(450);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "adesoes",
      direction: "export",
      seedKey: `${config.id}-sga-${request.membershipId}`,
      durationMs: 450,
    });
  }

  async syncStatus(config: ConnectorConfig, entidade: SyncEntity): Promise<SyncResult> {
    await delay(300);
    return buildSyncResult({
      connectorId: config.id,
      entidade,
      direction: "import",
      seedKey: `${config.id}-status-sga-${entidade}`,
      durationMs: 300,
    });
  }

  async retryOperation(config: ConnectorConfig, correlationId: string): Promise<SyncResult> {
    await delay(400);
    return buildSyncResult({
      connectorId: config.id,
      entidade: "veiculos",
      direction: "import",
      seedKey: `retry-sga-${correlationId}`,
      durationMs: 400,
    });
  }
}
