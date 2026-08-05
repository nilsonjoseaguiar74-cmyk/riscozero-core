import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  tone = "default",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "muted" | "brand";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "section-y",
        tone === "muted" && "bg-muted/50",
        tone === "brand" && "surface-brand",
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  inverted = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  inverted?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className={cn("eyebrow", inverted ? "text-gold-light" : "text-gold")}>{eyebrow}</p>
      ) : null}
      <h2
        className={cn(
          "display-2 mt-2",
          inverted ? "text-brand-foreground" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "lead-text mt-3",
            inverted ? "text-brand-foreground/75" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
      <div className={cn("gold-rule mt-5 h-0.5 w-16", align === "center" && "mx-auto")} />
    </div>
  );
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description: string;
}) {
  return (
    <article className="card-elevated flex h-full flex-col gap-3 p-5">
      <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-soft text-brand">
        <Icon className="size-5" aria-hidden={true} />
      </span>
      <h3 className="text-base font-[650] text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </article>
  );
}
