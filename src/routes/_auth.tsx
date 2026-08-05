import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { SITE } from "@/config/site";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="surface-brand relative hidden flex-col justify-between p-10 lg:flex">
        <Logo surface="dark" />
        <div>
          <h2 className="display-2 text-brand-foreground">
            Plataforma de gestão comercial da Risco Zero
          </h2>
          <p className="lead-text mt-4 max-w-md text-brand-foreground/80">
            Acompanhamento de leads, funil comercial, aquisição e administração em um único
            ambiente, com trilha de auditoria e controle de acesso por perfil.
          </p>
        </div>
        <p className="text-xs text-brand-foreground/70">
          {SITE.fullName} — {SITE.addressShort}
        </p>
      </aside>

      <main className="flex flex-col justify-center px-6 py-12 sm:px-10">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden">
            <Logo />
          </div>
          <Outlet />
          <p className="mt-10 text-center text-xs text-muted-foreground">
            <Link to="/" className="underline">
              Voltar para o site institucional
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
