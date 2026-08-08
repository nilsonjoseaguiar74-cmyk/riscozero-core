import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PeriodProvider } from "@/components/admin/PeriodContext";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingState } from "@/components/common/StateViews";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState label="Verificando sessão" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="card-elevated max-w-md p-8 text-center">
          <h1 className="heading-3 text-foreground">Área restrita</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre com uma conta autorizada para visualizar o painel de gestão.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/">Voltar ao site</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PeriodProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-muted/30">
          <AdminSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <AdminHeader />
            <main className="min-w-0 flex-1 px-3 py-5 sm:px-5 lg:px-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </PeriodProvider>
  );
}
