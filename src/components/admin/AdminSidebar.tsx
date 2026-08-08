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
import { isRouteEnabled, visibleGroups } from "@/lib/rbac";
import { USER_ROLE_LABEL } from "@/types";
import { cn } from "@/lib/utils";
import {
  Building2,
  ChartNoAxesCombined,
  Megaphone,
  Settings2,
  UsersRound,
  Wrench,
} from "lucide-react";

const GROUP_ICONS = {
  visao: ChartNoAxesCombined,
  comercial: UsersRound,
  associacao: Building2,
  trafego: Megaphone,
  integracoes: Wrench,
  desenvolvedor: Wrench,
  administracao: Settings2,
} as const;

export function AdminSidebar() {
  const { user } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (router) => router.location.pathname });
  const groups = visibleGroups(user?.permissions ?? []);

  const isActive = (to: string) =>
    pathname === to || (to !== "/app/dashboard" && pathname.startsWith(`${to}/`));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border shadow-sm">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link to="/app" className="flex items-center gap-3" aria-label="Início do painel">
          <Logo size="sm" className="shrink-0" />
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-base font-[650] leading-tight text-sidebar-foreground">
                Risco Zero
              </span>
              <span className="block truncate text-[11px] leading-tight text-muted-foreground">
                Plataforma de gestão
              </span>
            </span>
          ) : null}
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-1 px-2 py-3">
        {groups.map((group) => {
          const GroupIcon = GROUP_ICONS[group.id as keyof typeof GROUP_ICONS] ?? Settings2;
          return (
            <SidebarGroup key={group.id} className="px-1 py-2">
              {!collapsed ? (
                <SidebarGroupLabel className="mb-1 flex h-8 items-center gap-2 px-2 text-[11px] font-semibold uppercase tracking-[0.08em]">
                  <GroupIcon className="size-3.5" />
                  {group.label}
                </SidebarGroupLabel>
              ) : null}
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        className="h-10 rounded-lg px-3 data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:shadow-sm"
                        asChild={isRouteEnabled(item.to)}
                        isActive={isActive(item.to)}
                        disabled={!isRouteEnabled(item.to)}
                        tooltip={isRouteEnabled(item.to) ? item.label : `${item.label} — Em breve`}
                      >
                        {isRouteEnabled(item.to) ? (
                          <Link to={item.to as "/"} className="flex items-center gap-2">
                            <span
                              className={cn(
                                "h-5 w-0.5 shrink-0 rounded-full",
                                isActive(item.to) ? "bg-gold" : "bg-transparent",
                              )}
                              aria-hidden="true"
                            />
                            <span className="truncate text-[13px]">{item.label}</span>
                          </Link>
                        ) : (
                          <span
                            className="flex w-full items-center gap-2"
                            title="Implementação futura"
                          >
                            <span
                              className="h-5 w-0.5 shrink-0 rounded-full bg-transparent"
                              aria-hidden="true"
                            />
                            <span className="truncate text-[13px]">{item.label}</span>
                            {!collapsed ? (
                              <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                                Em breve
                              </span>
                            ) : null}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      {!collapsed ? (
        <SidebarFooter className="border-t border-sidebar-border bg-sidebar-accent/30 px-4 py-4">
          <p className="truncate text-xs font-medium text-sidebar-foreground">
            {user?.name ?? "Usuário"}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {user ? USER_ROLE_LABEL[user.role] : "Perfil não definido"}
          </p>
        </SidebarFooter>
      ) : null}
    </Sidebar>
  );
}
