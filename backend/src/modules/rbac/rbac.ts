import type { UserRole } from "@prisma/client";

export const ALL_PERMISSIONS = [
  "dashboard.view", "crm.view", "crm.edit", "reports.view", "acquisition.view",
  "integrations.manage", "users.manage", "audit.view", "settings.manage",
  "developer.access", "association.view", "association.manage", "finance.view",
  "sensitive.view", "traffic.view", "traffic.manage", "integrations.view",
  "sync.manage", "documents.view",
] as const;

export const ROLE_PERMISSIONS: Record<UserRole, readonly string[]> = {
  administrador: ALL_PERMISSIONS,
  gestor: ["dashboard.view", "crm.view", "crm.edit", "reports.view", "audit.view", "association.view", "association.manage"],
  comercial: ["dashboard.view", "crm.view", "crm.edit", "association.view"],
  gestor_trafego: ["dashboard.view", "reports.view", "acquisition.view", "traffic.view", "traffic.manage", "integrations.view"],
  desenvolvedor: ["dashboard.view", "integrations.manage", "integrations.view", "developer.access", "audit.view"],
};
