import type { Permission, UserRole } from "@/types";

/**
 * Configuração RBAC visual. A segurança definitiva será aplicada pelo backend
 * NestJS; aqui controlamos apenas navegação e affordances da interface.
 */

export interface NavItem {
  label: string;
  to: string;
  permission: Permission;
  description?: string;
}

export const ENABLED_ROUTES = new Set([
  "/app/dashboard",
  "/app/crm",
  "/app/crm/tarefas",
  "/app/settings/site-content",
]);

export const isRouteEnabled = (to: string) => ENABLED_ROUTES.has(to);

export interface NavGroup {
  id: string;
  label: string;
  permission: Permission;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "visao",
    label: "Visão geral",
    permission: "dashboard.view",
    items: [
      {
        label: "Painel executivo",
        to: "/app/dashboard",
        permission: "dashboard.view",
        description: "Indicadores consolidados da operação",
      },
    ],
  },
  {
    id: "comercial",
    label: "Comercial",
    permission: "crm.view",
    items: [
      { label: "Leads e funil", to: "/app/crm", permission: "crm.view" },
      { label: "Tarefas", to: "/app/crm/tarefas", permission: "crm.view" },
      { label: "Atividades", to: "/app/crm/atividades", permission: "crm.view" },
    ],
  },
  {
    id: "associacao",
    label: "Gestão da Associação",
    permission: "association.view",
    items: [
      {
        label: "Visão executiva",
        to: "/app/association/dashboard",
        permission: "association.view",
      },
      { label: "Associados", to: "/app/association/members", permission: "association.view" },
      { label: "Veículos", to: "/app/association/vehicles", permission: "association.view" },
      { label: "Adesões", to: "/app/association/memberships", permission: "association.view" },
      { label: "Ocorrências", to: "/app/association/occurrences", permission: "association.view" },
      { label: "Assistências", to: "/app/association/assistance", permission: "association.view" },
      { label: "Vistorias", to: "/app/association/inspections", permission: "association.view" },
      { label: "Financeiro", to: "/app/association/finance", permission: "finance.view" },
      { label: "Cobranças", to: "/app/association/billing", permission: "finance.view" },
      { label: "Rateios", to: "/app/association/apportionments", permission: "finance.view" },
      { label: "Inadimplência", to: "/app/association/delinquency", permission: "finance.view" },
      { label: "Benefícios", to: "/app/association/benefits", permission: "association.view" },
      { label: "Consultores", to: "/app/association/consultants", permission: "association.view" },
      { label: "Prestadores", to: "/app/association/providers", permission: "association.view" },
      { label: "Documentos", to: "/app/association/documents", permission: "documents.view" },
      { label: "Sincronizações", to: "/app/association/sync", permission: "integrations.view" },
      { label: "Relatórios", to: "/app/association/reports", permission: "reports.view" },
      { label: "Auditoria operacional", to: "/app/association/audit", permission: "audit.view" },
    ],
  },
  {
    id: "trafego",
    label: "Aquisição e Tráfego",
    permission: "traffic.view",
    items: [
      { label: "Visão geral", to: "/app/traffic/dashboard", permission: "traffic.view" },
      { label: "Campanhas", to: "/app/traffic/campaigns", permission: "traffic.view" },
      { label: "Canais", to: "/app/traffic/channels", permission: "traffic.view" },
      { label: "Atribuição", to: "/app/traffic/attribution", permission: "traffic.view" },
      { label: "Landing pages", to: "/app/traffic/landing-pages", permission: "traffic.view" },
      { label: "Funil", to: "/app/traffic/funnel", permission: "traffic.view" },
      { label: "Conversões", to: "/app/traffic/conversions", permission: "traffic.view" },
      { label: "Custos", to: "/app/traffic/costs", permission: "traffic.view" },
      { label: "UTM builder", to: "/app/traffic/utm-builder", permission: "traffic.manage" },
      { label: "Eventos", to: "/app/traffic/events", permission: "traffic.view" },
      { label: "Criativos", to: "/app/traffic/creatives", permission: "traffic.view" },
      { label: "Experimentos", to: "/app/traffic/experiments", permission: "traffic.manage" },
      {
        label: "Integrações de mídia",
        to: "/app/traffic/integrations",
        permission: "traffic.view",
      },
      { label: "Diagnósticos", to: "/app/traffic/diagnostics", permission: "traffic.view" },
      { label: "Relatórios de tráfego", to: "/app/traffic/reports", permission: "reports.view" },
    ],
  },
  {
    id: "integracoes",
    label: "Integrações",
    permission: "integrations.view",
    items: [
      { label: "Central de integrações", to: "/app/integrations", permission: "integrations.view" },
      { label: "SIPROV", to: "/app/integrations/siprov", permission: "integrations.view" },
      { label: "SGA / Hinova", to: "/app/integrations/sga", permission: "integrations.view" },
      { label: "API genérica", to: "/app/integrations/generic", permission: "integrations.view" },
      { label: "Webhooks", to: "/app/integrations/webhooks", permission: "integrations.view" },
      {
        label: "Importar e exportar",
        to: "/app/integrations/import-export",
        permission: "integrations.view",
      },
      {
        label: "Mapeamento de campos",
        to: "/app/integrations/mappings",
        permission: "sync.manage",
      },
      {
        label: "Logs de sincronização",
        to: "/app/integrations/logs",
        permission: "integrations.view",
      },
      { label: "Conflitos", to: "/app/integrations/conflicts", permission: "sync.manage" },
    ],
  },
  {
    id: "desenvolvedor",
    label: "Desenvolvedor",
    permission: "developer.access",
    items: [
      {
        label: "Diagnósticos técnicos",
        to: "/app/dev/diagnostics",
        permission: "developer.access",
      },
      { label: "Feature flags", to: "/app/dev/feature-flags", permission: "developer.access" },
      { label: "Documentação da API", to: "/app/dev/api-docs", permission: "developer.access" },
      { label: "Status dos serviços", to: "/app/dev/status", permission: "developer.access" },
    ],
  },
  {
    id: "administracao",
    label: "Administração",
    permission: "users.manage",
    items: [
      { label: "Usuários", to: "/app/admin/users", permission: "users.manage" },
      { label: "Perfis e permissões", to: "/app/admin/roles", permission: "users.manage" },
      { label: "Auditoria", to: "/app/admin/audit", permission: "audit.view" },
      { label: "Configurações", to: "/app/admin/settings", permission: "settings.manage" },
      {
        label: "Conteúdo do site",
        to: "/app/settings/site-content",
        permission: "settings.manage",
      },
      { label: "Segurança", to: "/app/admin/security", permission: "settings.manage" },
    ],
  },
];

export const visibleGroups = (permissions: Permission[]): NavGroup[] =>
  NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => permissions.includes(item.permission)),
  })).filter((group) => group.items.length > 0);

/** Rota inicial de cada perfil após a autenticação demonstrativa. */
export const HOME_ROUTE_BY_ROLE: Record<UserRole, string> = {
  administrador: "/app/dashboard",
  gestor: "/app/dashboard",
  gestor_trafego: "/app/traffic/dashboard",
  comercial: "/app/crm",
  desenvolvedor: "/app/integrations",
};

export const allNavItems = (): NavItem[] => NAV_GROUPS.flatMap((g) => g.items);
