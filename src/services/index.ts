import { APP_CONFIG } from "@/config/site";
import { httpAdapter } from "@/services/httpAdapter";
import { mockAdapter } from "@/services/mockAdapter";
import type { ServiceRegistry } from "@/services/contracts";

/**
 * Ponto único de acesso a dados. Páginas e componentes nunca importam mocks:
 * consomem sempre esta camada através do TanStack Query.
 */
export const services: ServiceRegistry = APP_CONFIG.useMockApi ? mockAdapter : httpAdapter;

export const queryKeys = {
  session: ["session"] as const,
  leads: (filters: unknown) => ["leads", filters] as const,
  lead: (id: string) => ["lead", id] as const,
  leadActivities: (id: string) => ["lead", id, "activities"] as const,
  leadTasks: (id: string) => ["lead", id, "tasks"] as const,
  activities: ["activities"] as const,
  tasks: ["tasks"] as const,
  overview: (filters: unknown) => ["analytics", "overview", filters] as const,
  report: (kind: string, filters: unknown) => ["analytics", "report", kind, filters] as const,
  campaigns: ["campaigns"] as const,
  campaign: (id: string) => ["campaign", id] as const,
  integrations: ["integrations"] as const,
  integration: (id: string) => ["integration", id] as const,
  webhookLogs: ["webhooks", "logs"] as const,
  featureFlags: ["feature-flags"] as const,
  serviceStatus: ["service-status"] as const,
  users: ["users"] as const,
  user: (id: string) => ["user", id] as const,
  roles: ["roles"] as const,
  audit: (search: string) => ["audit", search] as const,
  settings: ["settings"] as const,
};

export { ApiError, apiErrorMessage } from "@/services/http";
export type { ServiceRegistry } from "@/services/contracts";
