import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading, FeatureCard } from "@/components/landing/Section";
import { LeadForm } from "@/components/landing/LeadForm";
import { BENEFITS, DIFFERENTIALS, STEPS } from "@/content/landing";
import { REGIONS, SITE } from "@/config/site";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "Risco Zero Proteção Veicular | Grande Florianópolis" },
      {
        name: "description",
        content:
          "Proteção patrimonial mutualista, assistência 24 horas e benefícios para veículos em São José, Florianópolis, Palhoça e Biguaçu.",
      },
      { property: "og:title", content: "Risco Zero Proteção Veicular" },
      {
        property: "og:description",
        content:
          "Proteção, assistência e benefícios para o seu veículo na Grande Florianópolis. Solicite uma cotação com a equipe local.",
      },
    ],
  }),
  component: HomePage,
});

const HIGHLIGHTS = [
  "Assistência 24 horas na Grande Florianópolis",
  "Atendimento local e humano pelo WhatsApp",
  "Modelo associativo com regras claras",
];

function HomePage() {
  return (
    <>
      <section className="surface-brand">
        <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.05fr_minmax(0,480px)] lg:items-start lg:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow text-gold-light">{SITE.segment}</p>
            <h1 className="display-1 mt-3 text-brand-foreground">
              Proteção, assistência e benefícios para o seu veículo na Grande Florianópolis
            </h1>
            <p className="lead-text mt-5 text-brand-foreground/80">
              A Risco Zero reúne participantes em um modelo associativo mutualista, com rede de
              atendimento regional, assistência 24 horas e acompanhamento humano em cada etapa.
            </p>
            <ul className="mt-7 space-y-3">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-brand-foreground/85">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold-light">
                <Link to="/solicitar-cotacao">
                  Solicitar uma cotação
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/25 bg-transparent text-brand-foreground hover:bg-white/10 hover:text-brand-foreground"
              >
                <Link to="/como-funciona">Entender o funcionamento</Link>
              </Button>
            </div>
            <p className="mt-6 max-w-lg text-xs leading-relaxed text-brand-foreground/60">
              {SITE.disclaimer}
            </p>
          </div>

          <div className="lg:sticky lg:top-28">
            <LeadForm compact />
          </div>
        </div>
      </section>

      <Section>
        <SectionHeading
          eyebrow="Benefícios"
          title="O que está disponível para o participante"
          description="Conjunto de coberturas, assistências e benefícios avaliados conforme o perfil do veículo e a opção contratada."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.slice(0, 8).map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Como funciona"
          title="Um processo direto, do primeiro contato à adesão"
          description="Cada etapa é registrada na plataforma da associação, garantindo previsibilidade e histórico completo do atendimento."
        />
        <ol className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {STEPS.map((step) => (
            <li key={step.title}>
              <FeatureCard {...step} />
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Atuação regional"
              title="Presença consolidada na Grande Florianópolis"
              description="A operação é concentrada na região, o que aproxima o participante da equipe e da rede de prestadores homologados."
            />
            <ul className="mt-6 flex flex-wrap gap-2">
              {REGIONS.map((region) => (
                <li
                  key={region}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground"
                >
                  {region}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-7">
              <Link to="/regioes">Ver regiões atendidas</Link>
            </Button>
          </div>
          <div className="grid gap-4">
            {DIFFERENTIALS.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </Section>

      <Section tone="brand">
        <div className="grid items-center gap-6 md:grid-cols-[1.4fr_auto]">
          <div>
            <h2 className="display-2 text-brand-foreground">
              Receba as opções disponíveis para o seu veículo
            </h2>
            <p className="lead-text mt-3 max-w-xl text-brand-foreground/75">
              Informe seus dados e a equipe apresenta as alternativas compatíveis com o seu perfil,
              sem compromisso de adesão.
            </p>
          </div>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold-light">
            <Link to="/solicitar-cotacao">
              Solicitar uma cotação
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
