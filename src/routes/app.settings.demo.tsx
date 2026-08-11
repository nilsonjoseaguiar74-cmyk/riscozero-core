import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { NoPermissionState, LoadingState } from "@/components/common/StateViews";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { apiErrorMessage, queryKeys, services } from "@/services";

export const Route = createFileRoute("/app/settings/demo")({
  component: DemoSettingsRoute,
});

function DemoSettingsRoute() {
  const { can } = useAuth();
  const queryClient = useQueryClient();
  const settings = useQuery({
    queryKey: queryKeys.demoMode,
    queryFn: () => services.settings.getDemoMode(),
    enabled: can("settings.manage"),
  });
  const update = useMutation({
    mutationFn: (enabled: boolean) => services.settings.updateDemoMode(enabled),
    onSuccess: async (value) => {
      queryClient.setQueryData(queryKeys.demoMode, value);
      await queryClient.invalidateQueries({ queryKey: queryKeys.demoMode });
      toast.success(
        value.enabled ? "Modo demonstração habilitado." : "Modo demonstração desabilitado.",
      );
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  if (!can("settings.manage")) return <NoPermissionState area="as configurações" />;
  if (settings.isLoading) return <LoadingState label="Carregando configurações" />;

  const enabled = settings.data?.enabled ?? false;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="eyebrow text-gold">Gestão</p>
        <h1 className="display-2 mt-2">Recursos de demonstração</h1>
      </header>

      <section className="card-elevated p-5 sm:p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="font-semibold text-foreground">Modo demonstração</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Permite simular a entrada de novos contatos para apresentação e treinamento. Os
              registros gerados são identificados como demonstração.
            </p>
          </div>
          <Switch
            checked={enabled}
            disabled={update.isPending || settings.isError}
            onCheckedChange={(checked) => update.mutate(checked)}
            aria-label="Alternar modo demonstração"
          />
        </div>
        {update.isPending ? (
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" /> Salvando configuração
          </p>
        ) : null}
        {settings.isError ? (
          <p className="mt-4 text-xs text-destructive">{apiErrorMessage(settings.error)}</p>
        ) : null}
        <p className="mt-5 border-t pt-4 text-xs font-medium text-warning">
          Desative este recurso antes da operação em produção.
        </p>
      </section>
    </div>
  );
}
