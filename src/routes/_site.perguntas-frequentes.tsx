import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeading } from "@/components/landing/Section";
import { FAQS } from "@/content/landing";
import { trackEvent } from "@/services/tracking";

export const Route = createFileRoute("/_site/perguntas-frequentes")({
  head: () => ({
    meta: [
      { title: "Perguntas frequentes | Risco Zero Proteção Veicular" },
      {
        name: "description",
        content:
          "Dúvidas sobre o modelo associativo, veículos aceitos, regiões atendidas, assistência 24 horas, vistoria, carências e cancelamento.",
      },
      { property: "og:title", content: "Perguntas frequentes | Risco Zero" },
      {
        property: "og:description",
        content: "Respostas objetivas sobre proteção patrimonial mutualista e assistência.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Dúvidas"
        title="Perguntas frequentes"
        description="Se a sua dúvida não estiver aqui, a equipe responde diretamente pelo WhatsApp."
      />
      <Accordion
        type="single"
        collapsible
        className="mt-10 max-w-3xl"
        onValueChange={(value) => {
          if (value) trackEvent("faq_open", { pergunta: value });
        }}
      >
        {FAQS.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger className="text-left text-base font-[650]">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
