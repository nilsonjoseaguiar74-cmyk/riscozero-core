import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading, FeatureCard } from "@/components/landing/Section";
import { BENEFITS, DIFFERENTIALS } from "@/content/landing";
import { SITE } from "@/config/site";

export const Route = createFileRoute("/_site/beneficios")({
  head: () => ({
    meta: [
      { title: "Benefícios e assistências | Risco Zero Proteção Veicular" },
      {
        name: "description",
        content:
          "Proteção patrimonial, assistência 24 horas, carro reserva, chaveiro, vidros e rede de reparo para participantes da Risco Zero.",
      },
      { property: "og:title", content: "Benefícios e assistências | Risco Zero" },
      {
        property: "og:description",
        content:
          "Conheça as coberturas, assistências e benefícios disponíveis conforme a opção contratada.",
      },
    ],
  }),
  component: BenefitsPage,
});

function BenefitsPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="Benefícios"
          title="Coberturas, assistências e benefícios"
          description="A composição final depende do perfil do veículo e da opção contratada. A equipe apresenta o detalhamento completo antes da adesão."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Diferenciais"
          title="Por que participantes escolhem a Risco Zero"
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {DIFFERENTIALS.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
        <p className="mt-8 measure text-xs leading-relaxed text-muted-foreground">
          {SITE.disclaimer}
        </p>
      </Section>

      <Section tone="brand">
        <div className="grid items-center gap-6 md:grid-cols-[1.4fr_auto]">
          <h2 className="display-2 text-brand-foreground">
            Verifique quais benefícios se aplicam ao seu veículo
          </h2>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold-light">
            <Link to="/solicitar-cotacao">Solicitar uma cotação</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
