import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/app")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Painel de gestão | Risco Zero" },
      {
        name: "description",
        content:
          "Ambiente restrito de aquisição, CRM, gestão associativa e integrações da Risco Zero.",
      },
      { property: "og:title", content: "Painel de gestão | Risco Zero" },
      { property: "og:description", content: "Ambiente administrativo restrito." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppLayoutRoute,
});

function AppLayoutRoute() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
