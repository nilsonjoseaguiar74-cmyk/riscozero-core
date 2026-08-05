import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMetric } from "@/lib/format";
import type { MetricSummary } from "@/types";

export function MetricCard({ metric, accent }: { metric: MetricSummary; accent?: boolean }) {
  const positive = metric.deltaPercent >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <div
      className={cn(
        "card-elevated flex flex-col gap-2 p-4",
        accent && "border-gold/50 ring-1 ring-gold/20",
      )}
    >
      <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
      <p className="text-2xl font-[650] tracking-tight text-foreground tabular-nums">
        {formatMetric(metric.value, metric.format)}
      </p>
      <div className="flex items-center gap-1.5 text-xs">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-medium",
            positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
          )}
        >
          <Icon className="size-3" aria-hidden="true" />
          {Math.abs(metric.deltaPercent).toFixed(1)}%
        </span>
        <span className="text-muted-foreground">vs. período anterior</span>
      </div>
      {metric.helper ? <p className="text-xs text-muted-foreground">{metric.helper}</p> : null}
    </div>
  );
}

export function ChartCard({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="card-elevated flex flex-col gap-4 p-5">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-[650] text-foreground">{title}</h3>
          {description ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
