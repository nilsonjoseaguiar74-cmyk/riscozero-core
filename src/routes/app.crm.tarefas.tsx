import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ErrorState, LoadingState, NoPermissionState } from "@/components/common/StateViews";
import { useAuth } from "@/contexts/AuthContext";
import { queryKeys, services, apiErrorMessage } from "@/services";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/app/crm/tarefas")({ component: TasksRoute });
function TasksRoute() {
  const { can } = useAuth();
  const client = useQueryClient();
  const tasks = useQuery({
    queryKey: queryKeys.tasks,
    queryFn: () => services.tasks.list(),
    enabled: can("crm.view"),
  });
  const complete = useMutation({
    mutationFn: (id: string) => services.tasks.complete(id),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: queryKeys.tasks });
      toast.success("Tarefa concluída.");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });
  if (!can("crm.view")) return <NoPermissionState area="as tarefas" />;
  if (tasks.isLoading) return <LoadingState label="Carregando tarefas" />;
  if (tasks.isError) return <ErrorState error={tasks.error} onRetry={() => void tasks.refetch()} />;
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-gold">Comercial</p>
        <h1 className="display-2 mt-2">Tarefas</h1>
        <p className="mt-2 text-sm text-muted-foreground">Próximas ações vinculadas aos leads.</p>
      </div>
      <div className="grid gap-3">
        {tasks.data!.map((task) => (
          <article key={task.id} className="card-elevated flex flex-wrap items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-muted-foreground">
                {task.leadName} · {formatDateTime(task.dueAt)}
              </p>
            </div>
            <Badge variant={task.status === "concluida" ? "secondary" : "default"}>
              {task.status}
            </Badge>
            {task.status !== "concluida" && can("crm.edit") ? (
              <Button
                size="sm"
                variant="outline"
                disabled={complete.isPending}
                onClick={() => complete.mutate(task.id)}
              >
                <CheckCircle2 className="size-4" />
                Concluir
              </Button>
            ) : null}
          </article>
        ))}
        {tasks.data!.length === 0 ? (
          <div className="card-elevated p-10 text-center text-muted-foreground">
            Nenhuma tarefa cadastrada.
          </div>
        ) : null}
      </div>
    </div>
  );
}
