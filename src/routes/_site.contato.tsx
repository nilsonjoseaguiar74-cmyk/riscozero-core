import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, MessageCircle } from "lucide-react";
import { Section, SectionHeading } from "@/components/landing/Section";
import { LeadForm } from "@/components/landing/LeadForm";
import { SITE, whatsappLink } from "@/config/site";
import { trackEvent } from "@/services/tracking";

export const Route = createFileRoute("/_site/contato")({
  head: () => ({
    meta: [
      { title: "Contato | Risco Zero Proteção Veicular" },
      {
        name: "description",
        content:
          "Fale com a equipe da Risco Zero pelo WhatsApp ou envie seus dados. Atendimento presencial em São José, Santa Catarina.",
      },
      { property: "og:title", content: "Contato | Risco Zero" },
      {
        property: "og:description",
        content: "Canais oficiais de atendimento da Risco Zero Proteção Veicular.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,520px)]">
        <div>
          <SectionHeading
            eyebrow="Contato"
            title="Fale com a equipe da Risco Zero"
            description="O atendimento é local. Você pode iniciar a conversa pelo WhatsApp ou enviar seus dados pelo formulário."
          />
          <ul className="mt-8 space-y-4">
            <li className="card-elevated flex items-start gap-3 p-5">
              <MessageCircle className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
              <div>
                <p className="text-sm font-[650] text-foreground">WhatsApp</p>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent("whatsapp_click", { origem: "pagina_contato" })}
                  className="text-sm text-muted-foreground underline"
                >
                  {SITE.whatsapp}
                </a>
              </div>
            </li>
            <li className="card-elevated flex items-start gap-3 p-5">
              <MapPin className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
              <div>
                <p className="text-sm font-[650] text-foreground">Endereço</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent("location_click", { origem: "pagina_contato" })}
                  className="text-sm text-muted-foreground underline"
                >
                  {SITE.address}
                </a>
              </div>
            </li>
            <li className="card-elevated flex items-start gap-3 p-5">
              <Clock className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
              <div>
                <p className="text-sm font-[650] text-foreground">Atendimento</p>
                <p className="text-sm text-muted-foreground">{SITE.serviceHours}</p>
              </div>
            </li>
          </ul>
        </div>
        <LeadForm compact />
      </div>
    </Section>
  );
}
