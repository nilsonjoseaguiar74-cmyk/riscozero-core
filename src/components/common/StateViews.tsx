import type { ReactNode } from "react";
import { AlertTriangle, Inbox, Loader2, Lock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiErrorMessage } from "@/services";
import { cn } from "@/lib/utils";

export function LoadingState({ label = "Carregando informações" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-8 text-center"
    >
      <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function SkeletonGrid({ rows = 4, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center"
    >
      <AlertTriangle className="size-5 text-destructive" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-foreground">Não foi possível carregar os dados</p>
        <p className="mt-1 text-sm text-muted-foreground">{apiErrorMessage(error)}</p>
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="size-4" aria-hidden="true" />
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-8 text-center">
      <Inbox className="size-5 text-muted-foreground" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 measure text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function NoPermissionState({ area }: { area: string }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-border bg-muted/40 p-10 text-center">
      <Lock className="size-5 text-muted-foreground" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-foreground">Acesso não liberado</p>
        <p className="mt-1 measure text-sm text-muted-foreground">
          Seu perfil atual não possui permissão para visualizar {area}. Solicite acesso ao
          administrador da plataforma.
        </p>
      </div>
    </div>
  );
}
