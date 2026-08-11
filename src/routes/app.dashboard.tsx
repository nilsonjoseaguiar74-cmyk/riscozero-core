import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { FileText, ListTodo, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/common/MetricCard";
import { ChartCard } from "@/components/common/MetricCard";
import { BarsChart, DonutChart, TrendChart } from "@/components/admin/Charts";
import { ErrorState, LoadingState, NoPermissionState } from "@/components/common/StateViews";
import { useAuth } from "@/contexts/AuthContext";
import { queryKeys, services } from "@/services";

export const Route = createFileRoute("/app/dashboard")({ component: DashboardRoute });

function DashboardRoute() {
  const { can } = useAuth();
  const filters = {};
  const overview = useQuery({
    queryKey: queryKeys.overview(filters),
    queryFn: () => services.analytics.overview(filters),
    enabled: can("dashboard.view"),
  });
  const tasks = useQuery({
    queryKey: queryKeys.tasks,
    queryFn: () => services.tasks.list(),
    enabled: can("crm.view"),
  });
  if (!can("dashboard.view")) return <NoPermissionState area="o painel executivo" />;
  if (overview.isLoading) return <LoadingState label="Carregando resumo da operação" />;
  if (overview.isError)
    return <ErrorState error={overview.error} onRetry={() => void overview.refetch()} />;
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-gold">Visão geral</p>
        <h1 className="display-2 mt-2">Painel do gestor</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Resumo operacional e atalhos liberados para o seu perfil.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overview.data!.metrics.slice(0, 4).map((metric, index) => (
          <MetricCard key={metric.key} metric={metric} accent={index === 0} />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Evolução de leads" description="Entradas registradas no período">
          <TrendChart data={overview.data!.leadsOverTime} primaryLabel="Leads" />
        </ChartCard>
        <ChartCard title="Funil comercial" description="Distribuição por etapa">
          <BarsChart data={overview.data!.funnel} horizontal colorful />
        </ChartCard>
        <ChartCard title="Origem dos leads" description="Participação por canal">
          <DonutChart data={overview.data!.bySource} />
        </ChartCard>
        <ChartCard title="Leads por cidade" description="Distribuição regional">
          <BarsChart data={overview.data!.byCity} colorful />
        </ChartCard>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {can("crm.view") ? (
          <Shortcut
            icon={<ListTodo className="size-5" />}
            title="Tarefas"
            description={`${tasks.data?.filter((task) => task.status !== "concluida").length ?? 0} pendentes`}
            to="/app/crm/tarefas"
          />
        ) : null}
        {can("settings.manage") ? (
          <Shortcut
            icon={<FileText className="size-5" />}
            title="Conteúdo do site"
            description="Gerencie unidade e depoimentos"
            to="/app/settings/site-content"
          />
        ) : null}
        {can("users.manage") ? (
          <Shortcut
            icon={<Users className="size-5" />}
            title="Usuários"
            description="Módulo ainda não disponível nesta interface"
          />
        ) : null}
      </div>
    </div>
  );
}

function Shortcut({
  icon,
  title,
  description,
  to,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  to?: string;
}) {
  return (
    <section className="card-elevated p-5">
      <div className="text-gold">{icon}</div>
      <h2 className="mt-3 font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {to ? (
        <Button asChild variant="outline" className="mt-4">
          <Link to={to as "/"}>Abrir</Link>
        </Button>
      ) : null}
    </section>
  );
}
