import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, ChevronRight, LogOut, Search, ShieldCheck, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PeriodSelector } from "@/components/admin/PeriodContext";
import { useAuth } from "@/contexts/AuthContext";
import { NAV_GROUPS, visibleGroups } from "@/lib/rbac";
import { notificationsService, NOTIFICATION_KIND_LABEL } from "@/services/notifications";
import { formatRelative } from "@/lib/format";
import { USER_ROLE_LABEL } from "@/types";
import type { UserRole } from "@/types";

const ROLES: UserRole[] = [
  "administrador",
  "gestor",
  "gestor_trafego",
  "comercial",
  "desenvolvedor",
];

function useBreadcrumb() {
  const pathname = useRouterState({ select: (router) => router.location.pathname });
  return useMemo(() => {
    for (const group of NAV_GROUPS) {
      const item = group.items.find(
        (nav) => pathname === nav.to || pathname.startsWith(`${nav.to}/`),
      );
      if (item) return { group: group.label, item: item.label, exact: pathname === item.to };
    }
    return { group: "Painel", item: "Visão geral", exact: true };
  }, [pathname]);
}

export function AdminHeader() {
  const { user, signOut, switchRole } = useAuth();
  const navigate = useNavigate();
  const crumb = useBreadcrumb();
  const [searchOpen, setSearchOpen] = useState(false);
  const groups = visibleGroups(user?.permissions ?? []);

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsService.list(),
  });
  const unread = notifications.filter((item) => !item.read).length;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (to: string) => {
    setSearchOpen(false);
    void navigate({ to: to as "/" });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center gap-2 px-3 sm:px-4">
        <SidebarTrigger className="shrink-0" />
        <Separator orientation="vertical" className="hidden h-6 sm:block" />

        <nav aria-label="Trilha de navegação" className="hidden min-w-0 items-center gap-1 md:flex">
          <span className="truncate text-xs text-muted-foreground">{crumb.group}</span>
          <ChevronRight className="size-3 text-muted-foreground" aria-hidden="true" />
          <span className="truncate text-xs font-medium text-foreground">{crumb.item}</span>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden h-9 min-w-[220px] justify-start gap-2 text-muted-foreground lg:flex"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-4" aria-hidden="true" />
            <span className="text-xs">Pesquisar no painel</span>
            <kbd className="ml-auto rounded border border-border px-1 text-[10px]">Ctrl K</kbd>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Pesquisar"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-4" aria-hidden="true" />
          </Button>

          <div className="hidden xl:block">
            <PeriodSelector compact />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notificações">
                <Bell className="size-4" aria-hidden="true" />
                {unread > 0 ? (
                  <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-gold" />
                ) : null}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[340px] p-0">
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <p className="text-sm font-[650]">Notificações</p>
                <Badge variant="secondary">{unread} não lidas</Badge>
              </div>
              <ScrollArea className="max-h-[320px]">
                <ul className="divide-y divide-border">
                  {notifications.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className="w-full px-3 py-2.5 text-left hover:bg-muted/60"
                        onClick={() => (item.to ? go(item.to) : undefined)}
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">
                            {NOTIFICATION_KIND_LABEL[item.kind]}
                          </Badge>
                          <span className="ml-auto text-[10px] text-muted-foreground">
                            {formatRelative(item.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <UserCog className="size-4" aria-hidden="true" />
                <span className="hidden max-w-[140px] truncate text-xs sm:inline">
                  {user?.name ?? "Sessão demonstrativa"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                {user?.email ?? "demo@riscozero.com.br"}
                <span className="mt-0.5 block font-medium text-foreground">
                  {user ? USER_ROLE_LABEL[user.role] : "Perfil não definido"}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="size-3" aria-hidden="true" />
                Trocar perfil demonstrativo
              </DropdownMenuLabel>
              {ROLES.map((role) => (
                <DropdownMenuItem
                  key={role}
                  onSelect={() => void switchRole(role)}
                  className="text-xs"
                >
                  {USER_ROLE_LABEL[role]}
                  {user?.role === role ? (
                    <span className="ml-auto text-[10px] text-muted-foreground">atual</span>
                  ) : null}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="text-xs">
                <Link to="/">Voltar ao site institucional</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs"
                onSelect={() => {
                  void signOut().then(() => navigate({ to: "/login" }));
                }}
              >
                <LogOut className="size-3.5" aria-hidden="true" />
                Encerrar sessão
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border-t border-border px-3 py-2 xl:hidden">
        <PeriodSelector compact />
      </div>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="overflow-hidden p-0">
          <DialogTitle className="sr-only">Pesquisa global</DialogTitle>
          <Command>
            <CommandInput placeholder="Pesquisar páginas, módulos e relatórios" />
            <CommandList>
              <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.id} heading={group.label}>
                  {group.items.map((item) => (
                    <CommandItem
                      key={item.to}
                      value={`${group.label} ${item.label}`}
                      onSelect={() => go(item.to)}
                    >
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </header>
  );
}
