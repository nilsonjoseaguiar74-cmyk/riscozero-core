import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { visibleGroups } from "@/lib/rbac";
import { USER_ROLE_LABEL } from "@/types";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const { user } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (router) => router.location.pathname });
  const groups = visibleGroups(user?.permissions ?? []);

  const isActive = (to: string) =>
    pathname === to || (to !== "/app/dashboard" && pathname.startsWith(`${to}/`));

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border px-3 py-3">
        <Link to="/app" className="flex items-center gap-2" aria-label="Início do painel">
          <Logo size="sm" className="shrink-0" />
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-sm font-[650] leading-tight text-sidebar-foreground">
                Risco Zero
              </span>
              <span className="block truncate text-[11px] leading-tight text-muted-foreground">
                Plataforma de gestão
              </span>
            </span>
          ) : null}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.id}>
            {!collapsed ? <SidebarGroupLabel>{group.label}</SidebarGroupLabel> : null}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={isActive(item.to)} tooltip={item.label}>
                      <Link to={item.to as "/"} className="flex items-center gap-2">
                        <span
                          className={cn(
                            "size-1.5 shrink-0 rounded-full",
                            isActive(item.to) ? "bg-gold" : "bg-muted-foreground/40",
                          )}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {!collapsed ? (
        <SidebarFooter className="border-t border-border px-3 py-3">
          <p className="truncate text-xs font-medium text-sidebar-foreground">
            {user?.name ?? "Sessão demonstrativa"}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {user ? USER_ROLE_LABEL[user.role] : "Perfil não definido"}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Ambiente demonstrativo</p>
        </SidebarFooter>
      ) : null}
    </Sidebar>
  );
}
