import { ApiError } from "@/services/http";

/**
 * Notificações operacionais. Hoje totalmente demonstrativas; a implementação
 * definitiva consumirá o backend NestJS pelo mesmo contrato.
 */

export type NotificationKind =
  | "lead"
  | "adesao"
  | "ocorrencia"
  | "assistencia"
  | "vistoria"
  | "financeiro"
  | "integracao"
  | "sistema";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  to?: string | undefined;
}

export const NOTIFICATION_KIND_LABEL: Record<NotificationKind, string> = {
  lead: "Lead",
  adesao: "Adesão",
  ocorrencia: "Ocorrência",
  assistencia: "Assistência",
  vistoria: "Vistoria",
  financeiro: "Financeiro",
  integracao: "Integração",
  sistema: "Sistema",
};

const minutesAgo = (minutes: number) =>
  new Date(Date.UTC(2026, 1, 10, 12, 0, 0) - minutes * 60_000).toISOString();

let notifications: AppNotification[] = [
  {
    id: "ntf-01",
    kind: "lead",
    title: "12 novos leads aguardando contato",
    description: "Distribuição automática pendente para a equipe comercial.",
    createdAt: minutesAgo(8),
    read: false,
    to: "/app/crm",
  },
  {
    id: "ntf-02",
    kind: "adesao",
    title: "4 adesões com documentação pendente",
    description: "Documentos obrigatórios não enviados há mais de 48 horas.",
    createdAt: minutesAgo(46),
    read: false,
    to: "/app/association/memberships",
  },
  {
    id: "ntf-03",
    kind: "integracao",
    title: "Sincronização SIPROV concluída com alertas",
    description: "3 registros divergentes aguardando resolução de conflito.",
    createdAt: minutesAgo(95),
    read: false,
    to: "/app/integrations/conflicts",
  },
  {
    id: "ntf-04",
    kind: "ocorrencia",
    title: "Ocorrência 2026-0431 aguardando orçamento",
    description: "Prestador ainda não enviou o orçamento do reparo.",
    createdAt: minutesAgo(180),
    read: true,
    to: "/app/association/occurrences",
  },
  {
    id: "ntf-05",
    kind: "financeiro",
    title: "Inadimplência acima da meta",
    description: "Taxa de inadimplência do período atingiu 6,4 por cento.",
    createdAt: minutesAgo(320),
    read: true,
    to: "/app/association/delinquency",
  },
  {
    id: "ntf-06",
    kind: "vistoria",
    title: "9 vistorias aguardando análise",
    description: "Fotos enviadas pelos associados pendentes de aprovação.",
    createdAt: minutesAgo(520),
    read: true,
    to: "/app/association/inspections",
  },
];

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

export const notificationsService = {
  async list(): Promise<AppNotification[]> {
    await delay();
    return notifications.map((item) => ({ ...item }));
  },
  async markAsRead(id: string): Promise<AppNotification> {
    await delay(120);
    const found = notifications.find((item) => item.id === id);
    if (!found) throw new ApiError("Notificação não encontrada.", 404);
    found.read = true;
    return { ...found };
  },
  async markAllAsRead(): Promise<AppNotification[]> {
    await delay(120);
    notifications = notifications.map((item) => ({ ...item, read: true }));
    return notifications.map((item) => ({ ...item }));
  },
};
