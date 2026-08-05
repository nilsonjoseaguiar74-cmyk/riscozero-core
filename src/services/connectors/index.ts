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
 * Contrato único implementado por todos os conectores de sistema associativo
 * (SIPROV, SGA/Hinova, API genérica, webhook, CSV). Nenhuma página deve
 * chamar um conector diretamente — o acesso é sempre via IntegrationService.
 */
export interface AssociationSystemConnector {
  testConnection(config: ConnectorConfig): Promise<ConnectionTestResult>;
  getCapabilities(): Promise<ConnectorCapabilities>;
  getFieldDefinitions(entidade?: SyncEntity): Promise<ExternalFieldDefinition[]>;
  importAssociates(config: ConnectorConfig): Promise<SyncResult>;
  importVehicles(config: ConnectorConfig): Promise<SyncResult>;
  importMemberships(config: ConnectorConfig): Promise<SyncResult>;
  importOccurrences(config: ConnectorConfig): Promise<SyncResult>;
  importFinancialSummary(config: ConnectorConfig): Promise<SyncResult>;
  exportLead(config: ConnectorConfig, leadId: string): Promise<SyncResult>;
  exportMembership(config: ConnectorConfig, request: MembershipExportRequest): Promise<SyncResult>;
  syncStatus(config: ConnectorConfig, entidade: SyncEntity): Promise<SyncResult>;
  retryOperation(config: ConnectorConfig, correlationId: string): Promise<SyncResult>;
}

export { SiprovConnector } from "@/services/connectors/siprov";
export { SgaHinovaConnector } from "@/services/connectors/sga";
export { GenericApiConnector } from "@/services/connectors/generic";
export { WebhookConnector } from "@/services/connectors/webhook";
export { CsvImportConnector } from "@/services/connectors/csvImport";
export { CsvExportConnector } from "@/services/connectors/csvExport";

import type { ConnectorProvider } from "@/types/integration";
import { SiprovConnector as _Siprov } from "@/services/connectors/siprov";
import { SgaHinovaConnector as _Sga } from "@/services/connectors/sga";
import { GenericApiConnector as _Generic } from "@/services/connectors/generic";
import { WebhookConnector as _Webhook } from "@/services/connectors/webhook";
import { CsvImportConnector as _CsvImport } from "@/services/connectors/csvImport";
import { CsvExportConnector as _CsvExport } from "@/services/connectors/csvExport";

/** Resolve a implementação mockada correspondente ao fornecedor selecionado. */
export function resolveConnector(fornecedor: ConnectorProvider): AssociationSystemConnector {
  switch (fornecedor) {
    case "siprov":
      return new _Siprov();
    case "sga_hinova":
      return new _Sga();
    case "webhook":
      return new _Webhook();
    case "csv_import":
      return new _CsvImport();
    case "csv_export":
      return new _CsvExport();
    case "generic_api":
    case "google_ads":
    case "meta_ads":
    case "ga4":
    case "gtm":
    case "whatsapp":
    case "offline_conversions":
    default:
      return new _Generic();
  }
}
