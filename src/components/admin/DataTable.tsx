import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState, ErrorState, SkeletonGrid } from "@/components/common/StateViews";
import { cn } from "@/lib/utils";

export interface DataColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "right";
  className?: string;
  /** Coluna oculta em telas pequenas, mantendo a leitura da tabela. */
  hideOnMobile?: boolean;
  render: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: DataColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  onRowClick?: (row: T) => void;
  sortBy?: string | undefined;
  sortDir?: "asc" | "desc" | undefined;
  onSortChange?: (key: string, dir: "asc" | "desc") => void;
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  caption?: string;
}

const PAGE_SIZES = [10, 25, 50, 100];

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  error,
  onRetry,
  emptyTitle = "Nenhum registro encontrado",
  emptyDescription = "Ajuste os filtros ou o período selecionado para visualizar resultados.",
  emptyAction,
  onRowClick,
  sortBy,
  sortDir,
  onSortChange,
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  caption,
}: DataTableProps<T>) {
  if (error) return <ErrorState error={error} {...(onRetry ? { onRetry } : {})} />;
  if (loading) return <SkeletonGrid rows={6} />;
  if (rows.length === 0)
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        {...(emptyAction ? { action: emptyAction } : {})}
      />
    );

  const toggleSort = (key: string) => {
    if (!onSortChange) return;
    const nextDir = sortBy === key && sortDir === "asc" ? "desc" : "asc";
    onSortChange(key, nextDir);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    column.align === "right" && "text-right",
                    column.hideOnMobile && "hidden md:table-cell",
                    column.className,
                  )}
                >
                  {column.sortable && onSortChange ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                      onClick={() => toggleSort(column.key)}
                    >
                      {column.label}
                      {sortBy === column.key ? (
                        sortDir === "asc" ? (
                          <ArrowUp className="size-3" aria-hidden="true" />
                        ) : (
                          <ArrowDown className="size-3" aria-hidden="true" />
                        )
                      ) : null}
                    </button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={rowKey(row)}
                className={cn(onRowClick && "cursor-pointer")}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      "align-middle",
                      column.align === "right" && "text-right tabular-nums",
                      column.hideOnMobile && "hidden md:table-cell",
                    )}
                  >
                    {column.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {typeof page === "number" && typeof totalPages === "number" ? (
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            Página {page} de {Math.max(totalPages, 1)}
            {typeof total === "number" ? ` — ${total} registros` : ""}
          </span>
          <div className="flex items-center gap-2">
            {onPageSizeChange && pageSize ? (
              <Select
                value={String(pageSize)}
                onValueChange={(value) => onPageSizeChange(Number(value))}
              >
                <SelectTrigger className="h-8 w-[104px]" aria-label="Registros por página">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZES.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size} por página
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
            >
              Próxima
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
