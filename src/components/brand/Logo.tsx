import { cn } from "@/lib/utils";
import { SITE } from "@/config/site";

type LogoSize = "sm" | "md" | "lg" | "xl";

const SIZES: Record<LogoSize, string> = {
  sm: "h-9",
  md: "h-12",
  lg: "h-16",
  xl: "h-24",
};

interface LogoProps {
  size?: LogoSize;
  /** "plate" aplica um fundo institucional escuro para uso sobre fundos claros. */
  surface?: "dark" | "plate";
  className?: string;
}

/**
 * Logo oficial da Risco Zero. A arte não é redesenhada, recortada nem deformada:
 * apenas dimensionada proporcionalmente com área de respiro preservada.
 */
export function Logo({ size = "md", surface = "dark", className }: LogoProps) {
  const image = (
    <img
      src="/risco-zero-logo.png"
      alt={`${SITE.fullName}`}
      className={cn(SIZES[size], "w-auto object-contain")}
      width={366}
      height={423}
      loading="eager"
      decoding="async"
    />
  );

  if (surface === "plate") {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-lg bg-brand-deep px-3 py-2",
          className,
        )}
      >
        {image}
      </span>
    );
  }

  return <span className={cn("inline-flex items-center", className)}>{image}</span>;
}
