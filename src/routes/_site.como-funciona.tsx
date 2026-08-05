import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading, FeatureCard } from "@/components/landing/Section";
import { STEPS } from "@/content/landing";
import { SITE } from "@/config/site";

export const Route = createFileRoute("/_site/como-funciona")({
  head: () => ({
    meta: [
      { title: "Como funciona a adesão | Risco Zero Proteção Veicular" },
      {
        name: "description",
        content:
          "Entenda o modelo associativo mutualista da Risco Zero: solicitação, análise de perfil, apresentação de opções, adesão e acompanhamento.",
      },
      { property: "og:title", content: "Como funciona | Risco Zero" },
      {
        property: "og:description",
        content: "Da solicitação ao acompanhamento pós-adesão, cada etapa explicada com clareza.",
      },
    ],
  }),
  component: HowItWorksPage,
});

const RULES = [
  {
    title: "Rateio e fundo comum",
    body: "Os participantes contribuem mensalmente para um fundo comum utilizado no atendimento das ocorrências previstas em regulamento. Não se trata de contrato de seguro.",
  },
  {
    title: "Análise de perfil",
    body: "Ano, tipo, uso e região de circulação do veículo são avaliados para definir as opções disponíveis e a participação aplicável.",
  },
  {
    title: "Vistoria quando aplicável",
    body: "A vistoria registra as condições do veículo no momento da adesão e integra a documentação obrigatória.",
  },
  {
    title: "Carências e limites",
    body: "Prazos, limites e condições de utilização seguem o regulamento aplicável e são informados antes da formalização.",
  },
  {
    title: "Registro de ocorrência",
    body: "Em caso de evento, a ocorrência é aberta pelos canais oficiais e acompanhada pela equipe até a conclusão.",
  },
  {
    title: "Desligamento",
    body: "O participante pode solicitar o desligamento pelos canais oficiais, observando prazos e obrigações previstas.",
  },
];

function HowItWorksPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="Como funciona"
          title="Do primeiro contato ao acompanhamento contínuo"
          description="O processo é conduzido pela equipe local e registrado integralmente na plataforma da associação."
        />
        <ol className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {STEPS.map((step) => (
            <li key={step.title}>
              <FeatureCard {...step} />
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Modelo associativo" title="Regras que orientam a participação" />
        <dl className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {RULES.map((rule) => (
            <div key={rule.title} className="card-elevated p-5">
              <dt className="text-base font-[650] text-foreground">{rule.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{rule.body}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 measure text-xs leading-relaxed text-muted-foreground">
          {SITE.disclaimer}
        </p>
      </Section>

      <Section tone="brand">
        <div className="grid items-center gap-6 md:grid-cols-[1.4fr_auto]">
          <h2 className="display-2 text-brand-foreground">
            Converse com a equipe e avalie as opções disponíveis
          </h2>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold-light">
            <Link to="/solicitar-cotacao">Solicitar uma cotação</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
