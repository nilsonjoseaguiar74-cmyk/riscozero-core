import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CalendarRange } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export type PeriodPreset = "7d" | "30d" | "90d" | "mes_atual" | "mes_anterior" | "personalizado";

export const PERIOD_LABEL: Record<PeriodPreset, string> = {
  "7d": "Últimos 7 dias",
  "30d": "Últimos 30 dias",
  "90d": "Últimos 90 dias",
  mes_atual: "Mês atual",
  mes_anterior: "Mês anterior",
  personalizado: "Período personalizado",
};

interface PeriodValue {
  preset: PeriodPreset;
  from: string;
  to: string;
  label: string;
  setPreset: (preset: PeriodPreset) => void;
  setRange: (from: string, to: string) => void;
}

const iso = (date: Date) => date.toISOString().slice(0, 10);

function rangeFor(preset: PeriodPreset, current: { from: string; to: string }) {
  const today = new Date();
  const to = new Date(today);
  const from = new Date(today);
  switch (preset) {
    case "7d":
      from.setDate(today.getDate() - 6);
      break;
    case "30d":
      from.setDate(today.getDate() - 29);
      break;
    case "90d":
      from.setDate(today.getDate() - 89);
      break;
    case "mes_atual":
      from.setDate(1);
      break;
    case "mes_anterior":
      from.setMonth(today.getMonth() - 1, 1);
      to.setDate(0);
      break;
    default:
      return current;
  }
  return { from: iso(from), to: iso(to) };
}

const PeriodContext = createContext<PeriodValue | null>(null);

export function PeriodProvider({ children }: { children: ReactNode }) {
  const initial = rangeFor("30d", { from: "", to: "" });
  const [preset, setPresetState] = useState<PeriodPreset>("30d");
  const [range, setRangeState] = useState(initial);

  const value = useMemo<PeriodValue>(
    () => ({
      preset,
      from: range.from,
      to: range.to,
      label: PERIOD_LABEL[preset],
      setPreset: (next) => {
        setPresetState(next);
        setRangeState((prev) => rangeFor(next, prev));
      },
      setRange: (from, to) => {
        setPresetState("personalizado");
        setRangeState({ from, to });
      },
    }),
    [preset, range],
  );

  return <PeriodContext.Provider value={value}>{children}</PeriodContext.Provider>;
}

export function usePeriod(): PeriodValue {
  const context = useContext(PeriodContext);
  if (!context) throw new Error("usePeriod deve ser usado dentro de PeriodProvider.");
  return context;
}

export function PeriodSelector({ compact = false }: { compact?: boolean }) {
  const period = usePeriod();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={period.preset} onValueChange={(v) => period.setPreset(v as PeriodPreset)}>
        <SelectTrigger className={compact ? "h-9 w-[168px]" : "h-9 w-[196px]"} aria-label="Período">
          <CalendarRange className="mr-1 size-4 text-muted-foreground" aria-hidden="true" />
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(PERIOD_LABEL) as PeriodPreset[]).map((key) => (
            <SelectItem key={key} value={key}>
              {PERIOD_LABEL[key]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {period.preset === "personalizado" ? (
        <div className="flex items-center gap-1">
          <Input
            type="date"
            aria-label="Data inicial"
            className="h-9 w-[150px]"
            value={period.from}
            onChange={(e) => period.setRange(e.target.value, period.to)}
          />
          <span className="text-xs text-muted-foreground">até</span>
          <Input
            type="date"
            aria-label="Data final"
            className="h-9 w-[150px]"
            value={period.to}
            onChange={(e) => period.setRange(period.from, e.target.value)}
          />
        </div>
      ) : null}
    </div>
  );
}
