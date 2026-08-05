import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { WhatsAppFloatingButton } from "@/components/landing/WhatsAppFloatingButton";
import { CookieBanner } from "@/components/landing/CookieBanner";

export const Route = createFileRoute("/_site")({
  component: SiteLayout,
});

function SiteLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <a href="#conteudo" className="skip-link">
        Ir para o conteúdo principal
      </a>
      <SiteHeader />
      <main id="conteudo" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <WhatsAppFloatingButton />
      <CookieBanner />
    </div>
  );
}
