import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity, CircleStop, FlaskConical, Loader2, Play, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingState, NoPermissionState } from "@/components/common/StateViews";
import { useAuth } from "@/contexts/AuthContext";
import { createSimulatedLead, type SimulatedLeadDraft } from "@/features/demo/leadSimulator";
import { apiErrorMessage, queryKeys, services } from "@/services";
import type { Lead, UserRole } from "@/types";

export const Route = createFileRoute("/app/demo/leads")({ component: LeadSimulatorRoute });

const ALLOWED_ROLES: UserRole[] = ["administrador", "gestor", "gestor_trafego", "desenvolvedor"];
const FREQUENCIES = [10, 30, 60] as const;

interface SimulationActivity {
  id: string;
  time: string;
  name: string;
  city: string;
  source: string;
}

function LeadSimulatorRoute() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [active, setActive] = useState(false);
  const [frequency, setFrequency] = useState<(typeof FREQUENCIES)[number]>(30);
  const [quantity, setQuantity] = useState(5);
  const [target, setTarget] = useState(5);
  const [generated, setGenerated] = useState(0);
  const [lastLead, setLastLead] = useState<Lead | null>(null);
  const [lastGenerationAt, setLastGenerationAt] = useState<string | null>(null);
  const [activities, setActivities] = useState<SimulationActivity[]>([]);
  const generateRef = useRef<() => void>(() => undefined);
  const demoMode = useQuery({
    queryKey: queryKeys.demoMode,
    queryFn: () => services.settings.getDemoMode(),
    enabled: Boolean(user?.permissions.includes("settings.manage")),
  });

  const mutation = useMutation({
    mutationFn: (draft: SimulatedLeadDraft) => services.leads.create(draft.payload),
    onSuccess: async (lead, draft) => {
      const now = new Date();
      setGenerated((current) => current + 1);
      setLastLead(lead);
      setLastGenerationAt(now.toLocaleTimeString("pt-BR"));
      setActivities((current) =>
        [
          {
            id: `${lead.id}-${now.getTime()}`,
            time: now.toLocaleTimeString("pt-BR"),
            name: lead.name,
            city: lead.city,
            source: draft.sourceLabel,
          },
          ...current,
        ].slice(0, 8),
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["leads"] }),
        queryClient.invalidateQueries({ queryKey: ["analytics"] }),
        queryClient.invalidateQueries({ queryKey: ["activities"] }),
      ]);
      toast.success(`Lead simulado criado: ${lead.name}`);
    },
    onError: (error) => {
      setActive(false);
      toast.error(apiErrorMessage(error));
    },
  });

  generateRef.current = () => {
    if (!mutation.isPending) mutation.mutate(createSimulatedLead());
  };

  useEffect(() => {
    if (!active || !demoMode.data?.enabled) return;
    if (generated >= target) {
      setActive(false);
      return;
    }

    const timeout = window.setTimeout(generateRef.current, generated === 0 ? 0 : frequency * 1000);
    return () => window.clearTimeout(timeout);
  }, [active, demoMode.data?.enabled, frequency, generated, target]);

  if (!user || !ALLOWED_ROLES.includes(user.role)) {
    return <NoPermissionState area="o simulador de leads" />;
  }
  if (demoMode.isLoading) return <LoadingState label="Verificando modo demonstração" />;
  if (!demoMode.data?.enabled) {
    return (
      <div className="card-elevated mx-auto max-w-xl p-8 text-center">
        <h1 className="heading-3">Modo demonstração desabilitado.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Habilite o recurso nas configurações para usar o simulador de leads.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/app/dashboard">Voltar ao painel</Link>
        </Button>
      </div>
    );
  }

  const begin = () => {
    setGenerated(0);
    setTarget(quantity);
    setActivities([]);
    setLastLead(null);
    setLastGenerationAt(null);
    setActive(true);
  };

  const generateNow = () => {
    setActive(false);
    setGenerated(0);
    setTarget(1);
    setActivities([]);
    generateRef.current();
  };

  const end = () => setActive(false);
  const progress = target > 0 ? Math.min(100, (generated / target) * 100) : 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="eyebrow text-gold">Apresentação comercial</p>
            <Badge className="bg-gold text-gold-foreground hover:bg-gold">Demonstração</Badge>
          </div>
          <h1 className="display-2 mt-2">Simulador de Leads</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Simule a entrada de novos contatos para visualizar o fluxo de captação e gestão
            comercial. Os registros passam pela API e pelo banco reais e ficam identificados como
            simulação.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/app/crm">
            <Users className="size-4" />
            Abrir CRM
          </Link>
        </Button>
      </header>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
        <div className="card-elevated p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`size-2.5 rounded-full ${active ? "bg-success" : "bg-muted-foreground/50"}`}
                  aria-hidden="true"
                />
                <span className="font-semibold">{active ? "Simulação ativa" : "Inativo"}</span>
              </div>
            </div>
            <Badge variant="outline">Ambiente demonstrativo</Badge>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="demo-frequency">Frequência</Label>
              <Select
                value={String(frequency)}
                disabled={active || mutation.isPending}
                onValueChange={(value) => setFrequency(Number(value) as typeof frequency)}
              >
                <SelectTrigger id="demo-frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCIES.map((seconds) => (
                    <SelectItem key={seconds} value={String(seconds)}>
                      {seconds} segundos
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo-quantity">Quantidade por execução</Label>
              <Input
                id="demo-quantity"
                type="number"
                min={1}
                max={10}
                value={quantity}
                disabled={active || mutation.isPending}
                onChange={(event) =>
                  setQuantity(Math.min(10, Math.max(1, Number(event.target.value) || 1)))
                }
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button onClick={generateNow} disabled={active || mutation.isPending}>
              {mutation.isPending && !active ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              Gerar lead agora
            </Button>
            <Button variant="outline" onClick={begin} disabled={active || mutation.isPending}>
              <Play className="size-4" />
              Iniciar simulação
            </Button>
            <Button variant="destructive" onClick={end} disabled={!active}>
              <CircleStop className="size-4" />
              Encerrar simulação
            </Button>
          </div>

          <div className="mt-6 rounded-xl border bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium">Progresso</span>
              <span className="text-muted-foreground">
                {generated} de {target} leads gerados
              </span>
            </div>
            <Progress value={progress} className="mt-3" aria-label={`${generated} de ${target}`} />
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Último lead</dt>
                <dd className="mt-1 font-medium">{lastLead?.name ?? "Nenhum nesta execução"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Última geração</dt>
                <dd className="mt-1 font-medium">{lastGenerationAt ?? "—"}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-4 rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-foreground">
            A limpeza automática está indisponível nesta versão para impedir a exclusão acidental de
            leads reais. Registros demonstrativos são identificados por campanha iniciada em “demo-”
            e pelo marcador “simulator_demo”.
          </div>
        </div>

        <SimulationFeed activities={activities} pending={mutation.isPending} />
      </section>
    </div>
  );
}

function SimulationFeed({
  activities,
  pending,
}: {
  activities: SimulationActivity[];
  pending: boolean;
}) {
  return (
    <aside className="card-elevated min-h-80 p-5 sm:p-6" aria-live="polite">
      <div className="flex items-center gap-2">
        <Activity className="size-5 text-gold" />
        <h2 className="text-sm font-semibold uppercase tracking-wide">Atividade da simulação</h2>
      </div>
      {pending ? (
        <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Enviando contato pela API real
        </div>
      ) : null}
      <div className="mt-4 space-y-3">
        {activities.map((item) => (
          <article key={item.id} className="rounded-lg border bg-muted/20 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">{item.time}</span>
              <Badge variant="secondary" className="text-[10px]">
                Novo lead
              </Badge>
            </div>
            <p className="mt-2 font-medium">{item.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {item.city} · {item.source}
            </p>
          </article>
        ))}
        {activities.length === 0 && !pending ? (
          <div className="flex min-h-48 flex-col items-center justify-center text-center">
            <FlaskConical className="size-8 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium">Nenhuma atividade nesta execução</p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Gere um lead ou inicie a simulação para acompanhar as entradas.
            </p>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
