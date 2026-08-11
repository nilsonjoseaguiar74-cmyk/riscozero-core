import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ErrorState, LoadingState, NoPermissionState } from "@/components/common/StateViews";
import { useAuth } from "@/contexts/AuthContext";
import { apiErrorMessage, queryKeys, services } from "@/services";
import { formatDateTime } from "@/lib/format";
import { LEAD_STAGES, type LeadStage } from "@/types";
import { toast } from "sonner";
import { isSimulatedLead } from "@/features/demo/leadSimulator";

export const Route = createFileRoute("/app/crm")({ component: LeadsRoute });

function LeadsRoute() {
  const { can } = useAuth();
  const client = useQueryClient();
  const [search, setSearch] = useState("");
  const filters = { search, page: 1, pageSize: 100 };
  const leads = useQuery({
    queryKey: queryKeys.leads(filters),
    queryFn: () => services.leads.list(filters),
    enabled: can("crm.view"),
  });
  const changeStage = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: LeadStage }) =>
      services.leads.changeStage(id, stage),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Etapa atualizada.");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });
  if (!can("crm.view")) return <NoPermissionState area="os leads" />;
  if (leads.isLoading) return <LoadingState label="Carregando leads" />;
  if (leads.isError) return <ErrorState error={leads.error} onRetry={() => void leads.refetch()} />;
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-gold">Comercial</p>
        <h1 className="display-2 mt-2">Leads e funil</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Acompanhe contatos reais e avance cada oportunidade no funil.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {LEAD_STAGES.map((stage) => (
          <div key={stage.id} className="card-elevated p-4">
            <p className="text-xs text-muted-foreground">{stage.label}</p>
            <p className="mt-1 text-2xl font-semibold">
              {leads.data!.items.filter((lead) => lead.stage === stage.id).length}
            </p>
          </div>
        ))}
      </div>
      <Input
        className="max-w-md"
        placeholder="Buscar por nome, telefone ou placa"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Etapa</TableHead>
              <TableHead>Entrada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.data!.items.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{lead.name}</p>
                    {isSimulatedLead(lead) ? (
                      <Badge
                        variant="outline"
                        className="border-gold/50 text-[10px] uppercase tracking-wide text-foreground"
                      >
                        Simulado
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground">{lead.plate}</p>
                </TableCell>
                <TableCell>{lead.whatsapp}</TableCell>
                <TableCell>{lead.city}</TableCell>
                <TableCell>
                  <select
                    className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                    value={lead.stage}
                    disabled={!can("crm.edit") || changeStage.isPending}
                    onChange={(event) =>
                      changeStage.mutate({ id: lead.id, stage: event.target.value as LeadStage })
                    }
                  >
                    {LEAD_STAGES.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.label}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell>{formatDateTime(lead.createdAt)}</TableCell>
              </TableRow>
            ))}
            {leads.data!.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  Nenhum lead encontrado.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
      <Badge variant="secondary">{leads.data!.total} leads</Badge>
    </div>
  );
}
