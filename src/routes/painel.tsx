import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { USER_ROLE_LABEL } from "@/types";

export const Route = createFileRoute("/painel")({
  head: () => ({
    meta: [
      { title: "Painel administrativo | Risco Zero" },
      {
        name: "description",
        content: "Área restrita de gestão comercial da Risco Zero Proteção Veicular.",
      },
      { property: "og:title", content: "Painel administrativo | Risco Zero" },
      { property: "og:description", content: "Ambiente administrativo restrito." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PanelPage,
});

function PanelPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="container-page py-16">
      <h1 className="display-2 text-foreground">Painel administrativo</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {user
          ? `Sessão demonstrativa ativa: ${user.name} — ${USER_ROLE_LABEL[user.role]}.`
          : "Nenhuma sessão demonstrativa ativa."}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Dashboard e CRM serão montados sobre esta estrutura na próxima etapa.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => void signOut()}>
          Encerrar sessão
        </Button>
        <Button asChild variant="ghost">
          <Link to="/">Voltar ao site</Link>
        </Button>
      </div>
    </div>
  );
}
