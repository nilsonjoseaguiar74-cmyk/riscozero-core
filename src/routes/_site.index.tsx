import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading, FeatureCard } from "@/components/landing/Section";
import { LeadForm } from "@/components/landing/LeadForm";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { UnitSection } from "@/components/landing/UnitSection";
import { BENEFITS, DIFFERENTIALS, STEPS, FAQS } from "@/content/landing";
import { CITIES, SAO_JOSE_LOCALITIES, SITE, TRAVEL_CORRIDORS, whatsappLink } from "@/config/site";
import { trackEvent } from "@/services/tracking";
import { useQuery } from "@tanstack/react-query";
import { queryKeys, services } from "@/services";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "Risco Zero Proteção Veicular | Grande Florianópolis" },
      {
        name: "description",
        content:
          "Proteção e assistência para o seu veículo em São José e na Grande Florianópolis. Solicite sua cotação sem compromisso com a equipe local.",
      },
      { property: "og:title", content: "Risco Zero Proteção Veicular" },
      {
        property: "og:description",
        content:
          "Proteção, assistência e benefícios para o seu veículo na Grande Florianópolis. Solicite uma cotação sem compromisso.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const TRUST = [
  "Atendimento local e humano.",
  "Cotação sem compromisso.",
  "Assistências conforme regulamento.",
];

function HomePage() {
  const { data: unitContent } = useQuery({
    queryKey: queryKeys.unitSection,
    queryFn: () => services.siteContent.getUnitSection(),
  });
  const heroImage = unitContent?.media.find((item) => item.active && item.position === "primary");

  return (
    <>
      <section
        className="surface-brand relative isolate overflow-hidden bg-cover bg-center"
        style={heroImage ? { backgroundImage: `url(${heroImage.imageUrl})` } : undefined}
      >
        {heroImage ? (
          <div className="absolute inset-0 -z-10 bg-brand/70" aria-hidden="true" />
        ) : null}
        <div className="container-page relative grid gap-8 py-10 lg:grid-cols-[1fr_minmax(0,440px)] lg:items-start lg:gap-12 lg:py-14">
          <div className="max-w-xl">
            <p className="eyebrow text-gold-light">{SITE.segment}</p>
            <h1 className="display-1 mt-3 text-brand-foreground">
              Proteção e assistência para o seu veículo, todos os dias.
            </h1>
            <p className="lead-text mt-4 text-brand-foreground/80">
              Atendimento próximo, benefícios para diferentes situações e suporte para quem circula
              em São José e na Grande Florianópolis.
            </p>
            <ul className="mt-6 space-y-2.5">
              {TRUST.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-brand-foreground/85">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Button
                asChild
                size="lg"
                className="bg-gold text-gold-foreground hover:bg-gold-light"
              >
                <Link
                  to="/solicitar-cotacao"
                  onClick={() => trackEvent("cta_click", { local: "hero" })}
                >
                  Solicitar cotação
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("whatsapp_click", { origem: "hero" })}
                className="text-sm font-medium text-brand-foreground underline underline-offset-4 hover:text-gold-light"
              >
                Falar pelo WhatsApp
              </a>
              <Link
                to="/como-funciona"
                className="text-sm font-normal text-brand-foreground/65 underline-offset-4 hover:text-brand-foreground hover:underline"
              >
                Entenda como funciona
              </Link>
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <LeadForm compact />
          </div>
        </div>
      </section>

      <Section>
        <SectionHeading
          eyebrow="Benefícios"
          title="Itens que devem ser confirmados antes da adesão"
          description="Proteção, assistências e benefícios dependem da opção apresentada, dos limites, das condições e do regulamento aplicável."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.slice(0, 8).map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Como funciona"
          title="Um processo direto, do primeiro contato à adesão"
          description="A plataforma deverá registrar cada etapa para oferecer previsibilidade e histórico do atendimento."
        />
        <ol className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {STEPS.map((step) => (
            <li key={step.title}>
              <FeatureCard {...step} />
            </li>
          ))}
        </ol>
      </Section>

      <TestimonialsSection />

      <UnitSection />

      <Section>
        <SectionHeading
          eyebrow="Atuação regional"
          title="Atendimento regional na Grande Florianópolis"
          description="Municípios, localidades de São José e corredores de deslocamento são apresentados separadamente."
        />
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {(
            [
              ["Municípios", CITIES],
              ["Bairros e localidades de São José", SAO_JOSE_LOCALITIES],
              ["Corredores de deslocamento", TRAVEL_CORRIDORS],
            ] as const
          ).map(([label, items]) => (
            <div key={label}>
              <h3 className="text-sm font-[650] text-foreground">{label}</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/regioes">Ver regiões atendidas</Link>
        </Button>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Confiança" title="Motivos para conversar com a nossa equipe" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {DIFFERENTIALS.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Perguntas frequentes" title="Dúvidas comuns antes da cotação" />
        <Accordion type="single" collapsible className="mt-6 max-w-3xl">
          {FAQS.slice(0, 5).map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/perguntas-frequentes">Ver todas as perguntas</Link>
        </Button>
      </Section>

      <Section tone="brand">
        <div className="grid items-center gap-6 md:grid-cols-[1.4fr_auto]">
          <div>
            <h2 className="display-2 text-brand-foreground">
              Receba as opções disponíveis para o seu veículo
            </h2>
            <p className="lead-text mt-3 max-w-xl text-brand-foreground/75">
              Informe seus dados e nossa equipe apresentará as alternativas compatíveis com o seu
              perfil, sem compromisso de adesão.
            </p>
          </div>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold-light">
            <Link
              to="/solicitar-cotacao"
              onClick={() => trackEvent("cta_click", { local: "cta_final" })}
            >
              Solicitar cotação
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
