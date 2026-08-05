import { MessageCircle } from "lucide-react";
import { SITE, whatsappLink } from "@/config/site";
import { trackEvent } from "@/services/tracking";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={whatsappLink(
        "Olá! Gostaria de conhecer as opções de proteção e assistência para o meu veículo.",
      )}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackEvent("whatsapp_click", { origem: "botao_flutuante" })}
      className="fixed bottom-5 right-5 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-brand-foreground shadow-raised transition-colors hover:bg-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      <MessageCircle className="size-5" aria-hidden="true" />
      <span className="hidden sm:inline">Falar pelo WhatsApp</span>
      <span className="sr-only sm:hidden">Falar pelo WhatsApp {SITE.whatsapp}</span>
    </a>
  );
}
