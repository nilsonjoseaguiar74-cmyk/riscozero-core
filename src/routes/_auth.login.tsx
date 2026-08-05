import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { apiErrorMessage } from "@/services";
import { MOCK_USERS } from "@/mocks/data";
import { USER_ROLE_LABEL, type UserRole } from "@/types";

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

const DEMO_ROLES: UserRole[] = [
  "comercial",
  "gestor",
  "gestor_trafego",
  "desenvolvedor",
  "administrador",
];

function LoginPage() {
  const navigate = useNavigate();
  const { signIn, switchRole } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useMutation({
    mutationFn: () => signIn(email, password),
    onSuccess: () => navigate({ to: "/painel" }),
  });

  const demoLogin = useMutation({
    mutationFn: (role: UserRole) => switchRole(role),
    onSuccess: () => navigate({ to: "/painel" }),
  });

  const pending = login.isPending || demoLogin.isPending;

  return (
    <section className="mt-8">
      <h1 className="text-2xl font-[650] tracking-tight text-foreground">Acessar a plataforma</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Ambiente demonstrativo. Nenhuma credencial real é validada nesta fase.
      </p>

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
            placeholder="nome@riscozero.demo"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link to="/esqueci-minha-senha" className="text-xs text-brand underline">
              Esqueci minha senha
            </Link>
          </div>
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

      <div className="mt-8">
        <Separator />
        <p className="mt-6 text-xs font-[650] uppercase tracking-wide text-muted-foreground">
          Acesso demonstrativo por perfil
        </p>
        <div className="mt-3 grid gap-2">
          {DEMO_ROLES.map((role) => (
            <Button
              key={role}
              type="button"
              variant="outline"
              className="justify-between"
              disabled={pending}
              onClick={() => demoLogin.mutate(role)}
            >
              <span>{USER_ROLE_LABEL[role]}</span>
              <span className="text-xs text-muted-foreground">
                {MOCK_USERS.find((user) => user.role === role)?.name}
              </span>
            </Button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Problemas de acesso?{" "}
        <Link to="/verificar-acesso" className="underline">
          Verificar acesso
        </Link>
      </p>
    </section>
  );
}
