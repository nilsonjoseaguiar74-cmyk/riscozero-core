import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { services, apiErrorMessage } from "@/services";

export const Route = createFileRoute("/_auth/redefinir-senha")({
  head: () => ({
    meta: [
      { title: "Redefinir senha | Risco Zero" },
      { name: "description", content: "Defina uma nova senha para a plataforma administrativa." },
      { property: "og:title", content: "Redefinir senha | Risco Zero" },
      { property: "og:description", content: "Definição de nova senha da área restrita." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [validation, setValidation] = useState<string | null>(null);

  const reset = useMutation({
    mutationFn: () => services.auth.resetPassword("token-demo", password),
    onSuccess: () => navigate({ to: "/login" }),
  });

  return (
    <section className="mt-8">
      <h1 className="text-2xl font-[650] tracking-tight text-foreground">Definir nova senha</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A senha deve conter no mínimo oito caracteres. Nenhuma credencial é persistida neste
        ambiente demonstrativo.
      </p>

      <form
        className="mt-8 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (password.length < 8) {
            setValidation("A senha deve conter no mínimo oito caracteres.");
            return;
          }
          if (password !== confirmation) {
            setValidation("A confirmação não corresponde à senha informada.");
            return;
          }
          setValidation(null);
          reset.mutate();
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="password">Nova senha</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmation">Confirmar nova senha</Label>
          <Input
            id="confirmation"
            type="password"
            autoComplete="new-password"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            required
          />
        </div>

        {(validation ?? reset.isError) ? (
          <Alert variant="destructive">
            <AlertDescription>{validation ?? apiErrorMessage(reset.error)}</AlertDescription>
          </Alert>
        ) : null}

        <Button type="submit" size="lg" disabled={reset.isPending}>
          {reset.isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          Salvar nova senha
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Link to="/login" className="underline">
          Voltar para o acesso
        </Link>
      </p>
    </section>
  );
}
