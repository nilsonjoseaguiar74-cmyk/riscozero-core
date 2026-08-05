import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LogIn, Menu, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SITE, whatsappLink } from "@/config/site";
import { trackEvent } from "@/services/tracking";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/beneficios", label: "Benefícios" },
  { to: "/como-funciona", label: "Como funciona" },
  { to: "/regioes", label: "Regiões" },
  { to: "/perguntas-frequentes", label: "Dúvidas" },
  { to: "/contato", label: "Contato" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="surface-brand border-b border-white/10">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-2 text-xs text-brand-foreground/80">
          <p>{SITE.segment}</p>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("whatsapp_click", { origem: "barra_institucional" })}
            className="inline-flex items-center gap-1.5 font-medium text-brand-foreground hover:text-gold-light"
          >
            <Phone className="size-3.5" aria-hidden="true" />
            {SITE.whatsapp}
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 surface-brand shadow-subtle">
        <div className="container-page grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3">
          <Link
            to="/"
            className="flex min-w-0 items-center"
            aria-label={`${SITE.fullName} — início`}
          >
            <Logo size="md" />
          </Link>

          <div className="flex items-center gap-2">
            <nav aria-label="Navegação principal" className="hidden items-center gap-1 lg:flex">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-md px-3 py-2 text-sm font-medium text-brand-foreground/85 transition-colors hover:bg-white/10 hover:text-brand-foreground"
                  activeProps={{ className: "bg-white/10 text-brand-foreground" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Button
              asChild
              size="sm"
              className="hidden bg-gold text-gold-foreground hover:bg-gold-light sm:inline-flex"
            >
              <Link
                to="/solicitar-cotacao"
                onClick={() => trackEvent("cta_click", { local: "header" })}
              >
                Solicitar cotação
              </Link>
            </Button>

            <Button
              asChild
              size="sm"
              variant="outline"
              className="hidden border-white/25 bg-transparent text-brand-foreground hover:bg-white/10 hover:text-brand-foreground md:inline-flex"
            >
              <Link to="/login">
                <LogIn className="size-4" aria-hidden="true" />
                Acessar plataforma
              </Link>
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Abrir menu de navegação"
                  className="min-h-11 min-w-11 text-brand-foreground hover:bg-white/10 hover:text-brand-foreground lg:hidden"
                >
                  <Menu className="size-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[88vw] max-w-sm surface-brand border-white/10"
              >
                <SheetTitle className="sr-only">Navegação</SheetTitle>
                <div className="flex flex-col gap-6 p-6">
                  <Logo size="lg" />
                  <nav aria-label="Navegação móvel" className="flex flex-col gap-1">
                    {NAV.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="rounded-md px-3 py-3 text-base font-medium text-brand-foreground/90 hover:bg-white/10"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="flex flex-col gap-2">
                    <Button asChild className="bg-gold text-gold-foreground hover:bg-gold-light">
                      <Link to="/solicitar-cotacao">Solicitar cotação</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="border-white/25 bg-transparent text-brand-foreground hover:bg-white/10 hover:text-brand-foreground"
                    >
                      <Link to="/login">
                        <LogIn className="size-4" aria-hidden="true" />
                        Acessar plataforma
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
