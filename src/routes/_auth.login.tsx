import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { apiErrorMessage } from "@/services";

export const Route = createFileRoute("/_auth/login")({
  head: () => ({
    meta: [
      { title: "Acesso à plataforma | Risco Zero" },
      {
        name: "description",
        content: "Área restrita da plataforma de gestão comercial da Risco Zero Proteção Veicular.",
      },
      { property: "og:title", content: "Acesso à plataforma | Risco Zero" },
      { property: "og:description", content: "Ambiente administrativo restrito." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useMutation({
    mutationFn: () => signIn(email, password),
    onSuccess: () => navigate({ to: "/app/dashboard" }),
  });

  const pending = login.isPending;

  return (
    <section className="mt-8">
      <h1 className="text-2xl font-[650] tracking-tight text-foreground">Acessar a plataforma</h1>
      <p className="mt-2 text-sm text-muted-foreground">Entre com sua credencial corporativa.</p>

      <form
        className="mt-8 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          login.mutate();
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="email">E-mail corporativo</Label>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="nome@empresa.com.br"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {login.isError ? (
          <Alert variant="destructive">
            <AlertDescription>{apiErrorMessage(login.error)}</AlertDescription>
          </Alert>
        ) : null}

        <Button type="submit" size="lg" disabled={pending}>
          {login.isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Acesso restrito a usuários autorizados.
      </p>
    </section>
  );
}
