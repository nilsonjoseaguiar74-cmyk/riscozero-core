import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/landing/Section";
import { SITE, whatsappLink } from "@/config/site";
import { trackEvent } from "@/services/tracking";

export const Route = createFileRoute("/_site/obrigado")({
  head: () => ({
    meta: [
      { title: "Solicitação recebida | Risco Zero Proteção Veicular" },
      {
        name: "description",
        content: "Sua solicitação foi registrada para atendimento pela equipe da Risco Zero.",
      },
      { property: "og:title", content: "Solicitação recebida | Risco Zero" },
      {
        property: "og:description",
        content: "Recebemos seus dados e a equipe dará sequência ao atendimento.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYouPage,
});

const NEXT_STEPS = [
  "A solicitação foi registrada para atendimento.",
  "A equipe comercial verifica o perfil do veículo e da região.",
  "O retorno é feito pelo canal e no horário informados.",
];

function ThankYouPage() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </span>
        <h1 className="display-2 mt-6 text-foreground">Solicitação recebida</h1>
        <p className="lead-text mt-3 text-muted-foreground">
          {`Obrigado pelo contato. A equipe da ${SITE.name} dará sequência ao atendimento e apresentará as opções compatíveis com o seu perfil.`}
        </p>
        <ol className="mt-8 space-y-3 text-left">
          {NEXT_STEPS.map((step, index) => (
            <li key={step} className="card-elevated flex items-start gap-3 p-4">
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-[650] text-brand">
                {index + 1}
              </span>
              <span className="text-sm text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <a
              href={whatsappLink("Olá! Acabei de enviar uma solicitação pelo site.")}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("whatsapp_click", { origem: "pagina_obrigado" })}
            >
              Falar agora pelo WhatsApp
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/">Voltar para a página inicial</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
