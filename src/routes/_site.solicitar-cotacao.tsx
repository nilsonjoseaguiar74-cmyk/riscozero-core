import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Section, SectionHeading } from "@/components/landing/Section";
import { LeadForm } from "@/components/landing/LeadForm";
import { BENEFITS } from "@/content/landing";

export const Route = createFileRoute("/_site/solicitar-cotacao")({
  head: () => ({
    meta: [
      { title: "Solicitar cotação | Risco Zero Proteção Veicular" },
      {
        name: "description",
        content:
          "Envie os dados do seu veículo e receba as opções de proteção, assistência e benefícios disponíveis na Grande Florianópolis.",
      },
      { property: "og:title", content: "Solicitar cotação | Risco Zero" },
      {
        property: "og:description",
        content: "Análise de perfil sem compromisso, conduzida pela equipe local da Risco Zero.",
      },
    ],
  }),
  component: QuotePage,
});

function QuotePage() {
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,520px)]">
        <div>
          <SectionHeading
            eyebrow="Cotação"
            title="Receba as opções disponíveis para o seu veículo"
            description="O envio dos dados não gera compromisso de adesão. A equipe analisa o perfil e apresenta as alternativas compatíveis."
          />
          <ul className="mt-8 space-y-3">
            {BENEFITS.slice(0, 6).map((item) => (
              <li key={item.title} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                <span>
                  <span className="font-[650] text-foreground">{item.title}.</span>{" "}
                  {item.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <LeadForm />
      </div>
    </Section>
  );
}
