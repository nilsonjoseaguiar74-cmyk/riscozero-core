import { Link } from "@tanstack/react-router";
import { MapPin, MessageCircle } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { SITE, REGIONS, whatsappLink } from "@/config/site";
import { trackEvent } from "@/services/tracking";

export function SiteFooter() {
  return (
    <footer className="surface-brand">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
        <div className="space-y-4">
          <Logo size="lg" />
          <p className="max-w-xs text-sm leading-relaxed text-brand-foreground/75">
            Associação de proteção patrimonial mutualista, assistência e benefícios para
            participantes da Grande Florianópolis.
          </p>
          <div className="h-0.5 w-16 gold-rule" />
        </div>

        <nav aria-label="Institucional" className="space-y-3 text-sm">
          <h2 className="eyebrow text-gold-light">Institucional</h2>
          <ul className="space-y-2 text-brand-foreground/80">
            <li>
              <Link to="/beneficios" className="hover:text-brand-foreground">
                Benefícios
              </Link>
            </li>
            <li>
              <Link to="/como-funciona" className="hover:text-brand-foreground">
                Como funciona
              </Link>
            </li>
            <li>
              <Link to="/regioes" className="hover:text-brand-foreground">
                Regiões atendidas
              </Link>
            </li>
            <li>
              <Link to="/perguntas-frequentes" className="hover:text-brand-foreground">
                Perguntas frequentes
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Atendimento" className="space-y-3 text-sm">
          <h2 className="eyebrow text-gold-light">Atendimento</h2>
          <ul className="space-y-2 text-brand-foreground/80">
            <li>
              <Link to="/solicitar-cotacao" className="hover:text-brand-foreground">
                Solicitar cotação
              </Link>
            </li>
            <li>
              <Link to="/contato" className="hover:text-brand-foreground">
                Falar com a equipe
              </Link>
            </li>
            <li>
              <Link to="/politica-de-privacidade" className="hover:text-brand-foreground">
                Política de privacidade
              </Link>
            </li>
            <li>
              <Link to="/termos-de-uso" className="hover:text-brand-foreground">
                Termos de uso
              </Link>
            </li>
          </ul>
        </nav>

        <div className="space-y-3 text-sm">
          <h2 className="eyebrow text-gold-light">Contato</h2>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("whatsapp_click", { origem: "rodape" })}
            className="flex items-start gap-2 text-brand-foreground/85 hover:text-brand-foreground"
          >
            <MessageCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {SITE.whatsapp}
          </a>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("location_click", { origem: "rodape" })}
            className="flex items-start gap-2 text-brand-foreground/85 hover:text-brand-foreground"
          >
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {SITE.address}
          </a>
          <p className="text-xs leading-relaxed text-brand-foreground/60">
            Regiões atendidas: {REGIONS.slice(0, 6).join(", ")} e demais localidades da Grande
            Florianópolis.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-brand-foreground/60 md:flex-row md:items-center md:justify-between">
          <p>
            {SITE.fullName}. Proteção patrimonial mutualista, assistência e benefícios. Não se trata
            de seguro.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <p>{SITE.disclaimer}</p>
            <Link
              to="/login"
              className="text-[11px] font-normal text-brand-foreground/45 underline-offset-2 hover:text-brand-foreground/70 hover:underline"
            >
              Área restrita
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
