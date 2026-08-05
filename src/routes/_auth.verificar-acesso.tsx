import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { services, apiErrorMessage } from "@/services";

export const Route = createFileRoute("/_auth/verificar-acesso")({
  head: () => ({
    meta: [
      { title: "Verificação de acesso | Risco Zero" },
      {
        name: "description",
        content: "Confirme o código de verificação para concluir o acesso à área restrita.",
      },
      { property: "og:title", content: "Verificação de acesso | Risco Zero" },
      { property: "og:description", content: "Confirmação em duas etapas da área restrita." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VerifyAccessPage,
});

function VerifyAccessPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const verify = useMutation({
    mutationFn: () => services.auth.verifyAccessCode(code),
    onSuccess: () => navigate({ to: "/painel" }),
  });

  return (
    <section className="mt-8">
      <h1 className="text-2xl font-[650] tracking-tight text-foreground">Verificar acesso</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Informe o código de seis dígitos enviado ao responsável pelo cadastro. Neste ambiente
        demonstrativo qualquer código de seis dígitos é aceito.
      </p>

      <form
        className="mt-8 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          verify.mutate();
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="codigo">Código de verificação</Label>
          <InputOTP id="codigo" maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {verify.isError ? (
          <Alert variant="destructive">
            <AlertDescription>{apiErrorMessage(verify.error)}</AlertDescription>
          </Alert>
        ) : null}

        <Button type="submit" size="lg" disabled={verify.isPending}>
          {verify.isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          Confirmar código
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
