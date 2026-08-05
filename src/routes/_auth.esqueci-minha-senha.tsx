import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { services, apiErrorMessage } from "@/services";

export const Route = createFileRoute("/_auth/esqueci-minha-senha")({
  head: () => ({
    meta: [
      { title: "Recuperação de acesso | Risco Zero" },
      {
        name: "description",
        content: "Solicite o link de redefinição de senha da plataforma administrativa.",
      },
      { property: "og:title", content: "Recuperação de acesso | Risco Zero" },
      { property: "og:description", content: "Redefinição de senha da área restrita." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const request = useMutation({
    mutationFn: () => services.auth.requestPasswordReset(email),
  });

  return (
    <section className="mt-8">
      <h1 className="text-2xl font-[650] tracking-tight text-foreground">Recuperar acesso</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Informe o e-mail corporativo cadastrado. O envio é simulado neste ambiente demonstrativo.
      </p>

      {request.isSuccess ? (
        <div className="mt-8 grid gap-4">
          <Alert>
            <AlertDescription>
              Se o e-mail informado estiver cadastrado, as instruções de redefinição serão enviadas.
            </AlertDescription>
          </Alert>
          <Button asChild variant="outline">
            <Link to="/redefinir-senha">Abrir tela de redefinição</Link>
          </Button>
        </div>
      ) : (
        <form
          className="mt-8 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            request.mutate();
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail corporativo</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          {request.isError ? (
            <Alert variant="destructive">
              <AlertDescription>{apiErrorMessage(request.error)}</AlertDescription>
            </Alert>
          ) : null}
          <Button type="submit" size="lg" disabled={request.isPending}>
            {request.isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            Enviar instruções
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Link to="/login" className="underline">
          Voltar para o acesso
        </Link>
      </p>
    </section>
  );
}
