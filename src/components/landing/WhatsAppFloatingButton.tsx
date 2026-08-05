import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/config/site";
import { trackEvent } from "@/services/tracking";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={whatsappLink(
        "Olá! Gostaria de conhecer as opções de proteção e assistência para o meu veículo.",
      )}
      target="_blank"
      rel="noreferrer"
      title="Falar pelo WhatsApp"
      aria-label="Falar com a equipe pelo WhatsApp"
      onClick={() => trackEvent("whatsapp_click", { origem: "botao_flutuante" })}
      className="fixed bottom-4 right-4 z-40 inline-flex size-14 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground shadow-raised transition-colors hover:bg-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:bottom-6 sm:right-6 sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-3"
    >
      <MessageCircle className="size-5 shrink-0" aria-hidden="true" />
      <span className="hidden whitespace-nowrap sm:inline">Falar pelo WhatsApp</span>
    </a>
  );
}
