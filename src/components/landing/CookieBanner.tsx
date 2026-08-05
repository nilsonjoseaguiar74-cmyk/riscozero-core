import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const KEY = "rz.cookie.consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(KEY)) setVisible(true);
    } catch {
      /* armazenamento indisponível */
    }
  }, []);

  const decide = (value: "todos" | "essenciais") => {
    try {
      window.localStorage.setItem(
        KEY,
        JSON.stringify({ value, version: "v1.0", at: new Date().toISOString() }),
      );
    } catch {
      /* armazenamento indisponível */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Preferências de cookies"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-xl border border-border bg-card p-4 shadow-raised sm:inset-x-6"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          Utilizamos cookies essenciais para o funcionamento do site e cookies de medição para
          entender a origem das visitas. Você pode aceitar todos ou manter apenas os essenciais.{" "}
          <Link to="/politica-de-privacidade" className="font-medium text-foreground underline">
            Política de privacidade
          </Link>
          .
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => decide("essenciais")}>
            Apenas essenciais
          </Button>
          <Button size="sm" onClick={() => decide("todos")}>
            Aceitar todos
          </Button>
        </div>
      </div>
    </div>
  );
}
