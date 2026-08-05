import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SeriesPoint } from "@/types";
import { formatNumber } from "@/lib/format";

const AXIS = { stroke: "hsl(var(--muted-foreground))", fontSize: 11 } as const;
const GRID = "hsl(var(--border))";

const PALETTE = [
  "var(--color-brand)",
  "var(--color-gold)",
  "var(--color-info)",
  "var(--color-success)",
  "var(--color-warning)",
  "var(--color-destructive)",
  "var(--color-brand-deep)",
];

const tooltipStyle = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: "0.5rem",
  fontSize: "12px",
  color: "var(--color-foreground)",
} as const;

export function TrendChart({
  data,
  height = 240,
  secondaryLabel,
  primaryLabel = "Total",
}: {
  data: SeriesPoint[];
  height?: number;
  primaryLabel?: string;
  secondaryLabel?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -12 }}>
        <defs>
          <linearGradient id="areaBrand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-brand)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={false} minTickGap={16} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={48} />
        <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatNumber(value)} />
        <Area
          type="monotone"
          dataKey="value"
          name={primaryLabel}
          stroke="var(--color-brand)"
          strokeWidth={2}
          fill="url(#areaBrand)"
        />
        {secondaryLabel ? (
          <Area
            type="monotone"
            dataKey="secondary"
            name={secondaryLabel}
            stroke="var(--color-gold)"
            strokeWidth={2}
            fill="transparent"
          />
        ) : null}
        {secondaryLabel ? <Legend wrapperStyle={{ fontSize: 11 }} /> : null}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BarsChart({
  data,
  height = 240,
  horizontal = false,
  colorful = false,
}: {
  data: SeriesPoint[];
  height?: number;
  horizontal?: boolean;
  colorful?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 4, right: 12, bottom: 0, left: horizontal ? 8 : -12 }}
      >
        <CartesianGrid
          stroke={GRID}
          strokeDasharray="3 3"
          vertical={horizontal}
          horizontal={!horizontal}
        />
        {horizontal ? (
          <>
            <XAxis type="number" tick={AXIS} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="label"
              tick={AXIS}
              tickLine={false}
              axisLine={false}
              width={140}
            />
          </>
        ) : (
          <>
            <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={false} minTickGap={12} />
            <YAxis tick={AXIS} tickLine={false} axisLine={false} width={48} />
          </>
        )}
        <Tooltip
          cursor={{ fill: "var(--color-muted)" }}
          contentStyle={tooltipStyle}
          formatter={(value: number) => formatNumber(value)}
        />
        <Bar dataKey="value" name="Total" radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={entry.label}
              fill={colorful ? PALETTE[index % PALETTE.length] : "var(--color-brand)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({ data, height = 240 }: { data: SeriesPoint[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatNumber(value)} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Pie data={data} dataKey="value" nameKey="label" innerRadius={54} outerRadius={82}>
          {data.map((entry, index) => (
            <Cell key={entry.label} fill={PALETTE[index % PALETTE.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ComparisonLineChart({
  data,
  height = 240,
  primaryLabel = "Atual",
  secondaryLabel = "Período anterior",
}: {
  data: SeriesPoint[];
  height?: number;
  primaryLabel?: string;
  secondaryLabel?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={false} minTickGap={16} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={48} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line
          type="monotone"
          dataKey="value"
          name={primaryLabel}
          stroke="var(--color-brand)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="secondary"
          name={secondaryLabel}
          stroke="var(--color-gold)"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/** Funil vertical simples, legível em telas pequenas. */
export function FunnelChart({ data }: { data: SeriesPoint[] }) {
  const max = data.reduce((acc, item) => Math.max(acc, item.value), 0) || 1;
  return (
    <ol className="flex flex-col gap-2">
      {data.map((step, index) => {
        const width = Math.max((step.value / max) * 100, 6);
        const previous = index > 0 ? data[index - 1] : undefined;
        const rate = previous && previous.value > 0 ? (step.value / previous.value) * 100 : null;
        return (
          <li key={step.label} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-3 text-xs">
              <span className="min-w-0 truncate text-foreground">{step.label}</span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {formatNumber(step.value)}
                {rate !== null ? ` — ${rate.toFixed(1)}%` : ""}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-muted">
              <div
                className="h-2.5 rounded-full bg-brand"
                style={{ width: `${width}%` }}
                aria-hidden="true"
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
