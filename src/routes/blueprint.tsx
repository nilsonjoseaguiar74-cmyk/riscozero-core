import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Boxes,
  Check,
  CircleDot,
  Database,
  ExternalLink,
  Gauge,
  LockKeyhole,
  Maximize2,
  MonitorPlay,
  Presentation,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/blueprint")({
  head: () => ({
    meta: [
      { title: "Blueprint executivo | Risco Zero" },
      {
        name: "description",
        content: "Apresentação executiva da plataforma Risco Zero.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BlueprintPage,
});

type Chapter = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  summary: string;
  content: ReactNode;
};

const PILLARS = [
  {
    icon: Users,
    title: "Aquisição conectada",
    text: "Landing page, formulários e WhatsApp convergem para uma entrada única de oportunidades.",
  },
  {
    icon: Gauge,
    title: "Operação rastreável",
    text: "Atendimento, responsáveis, etapas e tarefas formam um histórico claro para a gestão.",
  },
  {
    icon: BarChart3,
    title: "Decisão orientada por dados",
    text: "Indicadores comerciais e de mídia transformam movimento em leitura executiva.",
  },
];

const PRODUCT_MODULES = [
  ["Experiência pública", "Landing responsiva, benefícios, regiões, FAQ e captação de leads."],
  ["CRM comercial", "Funil, qualificação, responsável, atividades, tarefas e histórico."],
  ["BI executivo", "Visão de conversão, origem, campanhas, desempenho e operação."],
  ["Gestão de tráfego", "Leitura por canal e base preparada para integrações de mídia."],
  ["Administração", "Usuários, perfis, permissões, auditoria e configurações."],
  ["Integrações", "Contratos para conectores, webhooks, importação e exportação."],
];

const ROLES = [
  ["Comercial", "Atendimento, leads, atividades e tarefas."],
  ["Gestor", "Indicadores, operação, relatórios e supervisão."],
  ["Gestor de tráfego", "Aquisição, campanhas e desempenho por origem."],
  ["Desenvolvedor", "Integrações, diagnóstico e recursos técnicos."],
  ["Administrador", "Governança, usuários, permissões e auditoria."],
];

const CHAPTERS: Chapter[] = [
  {
    id: "capa",
    label: "Capa",
    eyebrow: "Blueprint executivo · 2026",
    title: "Do primeiro contato à inteligência de gestão.",
    summary:
      "Uma plataforma integrada para aquisição, atendimento, CRM e leitura executiva da operação Risco Zero.",
    content: (
      <div className="grid gap-4 sm:grid-cols-3">
        {["Aquisição", "Operação", "Inteligência"].map((item, index) => (
          <div key={item} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold text-gold-light">0{index + 1}</p>
            <p className="mt-6 text-lg font-semibold text-white">{item}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "visao",
    label: "Visão",
    eyebrow: "Manifesto e posicionamento",
    title: "Tecnologia para aproximar pessoas, organizar decisões e proteger valor.",
    summary:
      "A Risco Zero combina atendimento humano regional com uma operação digital rastreável — sem transformar relacionamento em burocracia.",
    content: (
      <div className="grid gap-4 md:grid-cols-3">
        {PILLARS.map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <Icon className="size-5 text-gold" aria-hidden="true" />
            <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/65">{text}</p>
          </article>
        ))}
      </div>
    ),
  },
  {
    id: "produto",
    label: "Produto",
    eyebrow: "Ecossistema modular",
    title: "Uma jornada contínua, da campanha ao acompanhamento comercial.",
    summary:
      "O produto elimina ilhas entre marketing, atendimento e gestão, preservando módulos claros para evolução segura.",
    content: (
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {PRODUCT_MODULES.map(([title, text], index) => (
          <article key={title} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-semibold text-white">{title}</h3>
              <span className="text-xs font-semibold text-gold-light">0{index + 1}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/60">{text}</p>
          </article>
        ))}
      </div>
    ),
  },
  {
    id: "marca",
    label: "Marca",
    eyebrow: "Identidade oficial",
    title: "Fidelidade visual como ativo de confiança.",
    summary:
      "A marca é aplicada a partir dos arquivos oficiais, sem redesenho, reconstrução tipográfica ou alteração de proporções.",
    content: (
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-center">
          <Logo size="xl" className="justify-center" />
          <p className="mt-4 text-xs text-white/45">Clique em “Ampliar marca” para inspeção.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-emerald-300/25 bg-emerald-300/5 p-5">
            <Check className="size-5 text-emerald-300" aria-hidden="true" />
            <h3 className="mt-4 font-semibold text-white">Usos corretos</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Arquivo original, área de respiro, escala proporcional e contraste adequado.
            </p>
          </article>
          <article className="rounded-2xl border border-red-300/25 bg-red-300/5 p-5">
            <X className="size-5 text-red-300" aria-hidden="true" />
            <h3 className="mt-4 font-semibold text-white">Não permitido</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Redesenhar, distorcer, recolorir ou substituir símbolo e tipografia.
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">
              Versões autorizadas
            </p>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Original, all black e all white — sempre a partir do arquivo oficial correspondente.
            </p>
          </article>
        </div>
      </div>
    ),
  },
  {
    id: "arquitetura",
    label: "Arquitetura",
    eyebrow: "Fundação tecnológica",
    title: "Monólito modular, contratos claros e evolução sem ruptura.",
    summary:
      "A arquitetura separa experiência, aplicação e dados, mantendo autenticação e governança como capacidades transversais.",
    content: (
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
        {[
          [MonitorPlay, "Experiência", "React 19 · Vite · TanStack"],
          [Boxes, "Aplicação", "NestJS · API REST modular"],
          [Database, "Dados", "Prisma · PostgreSQL"],
        ].map(([Icon, title, text], index) => {
          const Component = Icon as typeof MonitorPlay;
          return (
            <div key={String(title)} className="contents">
              <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <Component className="size-5 text-gold" aria-hidden="true" />
                <h3 className="mt-5 font-semibold text-white">{String(title)}</h3>
                <p className="mt-2 text-sm text-white/55">{String(text)}</p>
              </article>
              {index < 2 ? (
                <ArrowRight
                  className="m-auto hidden size-5 text-gold/70 lg:block"
                  aria-hidden="true"
                />
              ) : null}
            </div>
          );
        })}
        <div className="rounded-xl border border-gold/25 bg-gold/5 p-4 lg:col-span-5">
          <p className="flex items-center gap-2 text-sm text-white/70">
            <LockKeyhole className="size-4 text-gold" aria-hidden="true" />
            JWT, cookie HttpOnly, RBAC e auditoria sustentam acesso e rastreabilidade.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "perfis",
    label: "Perfis",
    eyebrow: "Governança de acesso",
    title: "Cada profissional enxerga o necessário para executar bem.",
    summary:
      "Perfis e permissões reduzem exposição de dados e organizam responsabilidades sem fragmentar a operação.",
    content: (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {ROLES.map(([role, description]) => (
          <article key={role} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <ShieldCheck className="size-5 text-gold" aria-hidden="true" />
            <h3 className="mt-4 font-semibold text-white">{role}</h3>
            <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>
          </article>
        ))}
      </div>
    ),
  },
  {
    id: "status",
    label: "Status",
    eyebrow: "Estado demonstrável",
    title: "Base funcional preservada. Integração evolui por checkpoints.",
    summary:
      "A demonstração atual prioriza experiência pública e fluxos simulados; o backend já possui fundação para substituir mocks gradualmente.",
    content: (
      <div className="grid gap-4 md:grid-cols-3">
        {[
          [
            "Demonstrável agora",
            "Landing pública, captação, login por perfil e navegação do protótipo.",
          ],
          [
            "Fundação concluída",
            "API NestJS, PostgreSQL, autenticação, permissões e auditoria no backend.",
          ],
          [
            "Próximo incremento",
            "Conectar dashboards e CRM ao backend, validar integrações e preparar o deploy.",
          ],
        ].map(([title, text], index) => (
          <article key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <CircleDot className={index === 2 ? "size-5 text-gold" : "size-5 text-emerald-300"} />
            <h3 className="mt-5 font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">{text}</p>
          </article>
        ))}
      </div>
    ),
  },
  {
    id: "roadmap",
    label: "Roadmap",
    eyebrow: "Evolução controlada",
    title: "Demonstrar, validar, integrar e operar.",
    summary:
      "O roadmap reduz risco técnico e comercial ao transformar cada etapa em uma entrega verificável.",
    content: (
      <ol className="grid gap-3 md:grid-cols-4">
        {[
          ["01", "Demonstração", "Validar narrativa, navegação e perfis."],
          ["02", "Integração", "Conectar autenticação, leads e indicadores."],
          ["03", "Piloto", "Operar com usuários, dados e métricas controladas."],
          ["04", "Produção", "Deploy, monitoramento e integrações oficiais."],
        ].map(([number, title, text]) => (
          <li key={number} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold text-gold-light">{number}</p>
            <h3 className="mt-6 font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/55">{text}</p>
          </li>
        ))}
      </ol>
    ),
  },
  {
    id: "demo",
    label: "Demo",
    eyebrow: "Próximo passo",
    title: "Uma apresentação objetiva, seguida da experiência real.",
    summary:
      "Comece pelo problema e pelo valor, percorra produto e arquitetura, e encerre abrindo a plataforma demonstrativa.",
    content: (
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold-light">
          <Link to="/login">
            Abrir demonstração
            <ExternalLink className="size-4" aria-hidden="true" />
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
        >
          <Link to="/">Ver experiência pública</Link>
        </Button>
      </div>
    ),
  },
];

function BlueprintPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [readingMode, setReadingMode] = useState(false);
  const [logoOpen, setLogoOpen] = useState(false);
  const active = CHAPTERS[activeIndex]!;
  const progress = ((activeIndex + 1) / CHAPTERS.length) * 100;

  const goTo = (index: number) => {
    setActiveIndex(Math.min(Math.max(index, 0), CHAPTERS.length - 1));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (readingMode || event.target instanceof HTMLInputElement) return;
      if (event.key === "ArrowRight" || event.key === "PageDown") goTo(activeIndex + 1);
      if (event.key === "ArrowLeft" || event.key === "PageUp") goTo(activeIndex - 1);
      if (event.key === "Home") goTo(0);
      if (event.key === "End") goTo(CHAPTERS.length - 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, readingMode]);

  const visibleChapters = useMemo(() => (readingMode ? CHAPTERS : [active]), [active, readingMode]);

  return (
    <div className="min-h-dvh overflow-x-hidden bg-brand-deep text-brand-foreground">
      <a href="#blueprint-content" className="skip-link">
        Ir para o conteúdo
      </a>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-deep/95 backdrop-blur">
        <div className="container-page flex min-h-20 items-center justify-between gap-4 py-3">
          <Link to="/" aria-label="Risco Zero — início">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setReadingMode((value) => !value)}
              className="text-white/75 hover:bg-white/10 hover:text-white"
            >
              {readingMode ? (
                <Presentation className="size-4" aria-hidden="true" />
              ) : (
                <BookOpen className="size-4" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">
                {readingMode ? "Modo apresentação" : "Modo leitura"}
              </span>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/login">Acessar plataforma</Link>
            </Button>
          </div>
        </div>

        {!readingMode ? (
          <>
            <nav
              aria-label="Capítulos do blueprint"
              className="container-page flex gap-1 overflow-x-auto pb-3"
            >
              {CHAPTERS.map((chapter, index) => (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-current={index === activeIndex ? "step" : undefined}
                  className={
                    index === activeIndex
                      ? "shrink-0 rounded-full bg-gold px-3 py-1.5 text-xs font-semibold text-gold-foreground"
                      : "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-white/55 hover:bg-white/10 hover:text-white"
                  }
                >
                  {chapter.label}
                </button>
              ))}
            </nav>
            <div className="h-0.5 bg-white/5">
              <div
                className="h-full bg-gold transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : null}
      </header>

      <main id="blueprint-content">
        {visibleChapters.map((chapter, index) => (
          <section
            key={chapter.id}
            id={chapter.id}
            className={
              readingMode
                ? "container-page border-b border-white/10 py-16 lg:py-24"
                : "container-page flex min-h-[calc(100dvh-9.5rem)] flex-col justify-center py-10 lg:py-14"
            }
          >
            <div className="max-w-4xl">
              <p className="eyebrow text-gold-light">{chapter.eyebrow}</p>
              <h1
                className={
                  index === 0 && !readingMode
                    ? "display-1 mt-4 text-white"
                    : "display-2 mt-4 text-white"
                }
              >
                {chapter.title}
              </h1>
              <p className="lead-text mt-5 max-w-3xl text-white/65">{chapter.summary}</p>
            </div>
            <div className="mt-10">{chapter.content}</div>

            {chapter.id === "marca" ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setLogoOpen(true)}
                className="mt-5 w-fit text-gold-light hover:bg-white/10 hover:text-gold-light"
              >
                <Maximize2 className="size-4" aria-hidden="true" />
                Ampliar marca
              </Button>
            ) : null}
          </section>
        ))}
      </main>

      {!readingMode ? (
        <footer className="sticky bottom-0 z-30 border-t border-white/10 bg-brand-deep/95 backdrop-blur">
          <div className="container-page flex min-h-16 items-center justify-between gap-4">
            <p className="hidden text-xs text-white/45 sm:block">
              Use ← → para navegar · {activeIndex + 1}/{CHAPTERS.length}
            </p>
            <div className="ml-auto flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={activeIndex === 0}
                onClick={() => goTo(activeIndex - 1)}
                className="text-white hover:bg-white/10 hover:text-white disabled:text-white/25"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Anterior
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={activeIndex === CHAPTERS.length - 1}
                onClick={() => goTo(activeIndex + 1)}
                className="bg-gold text-gold-foreground hover:bg-gold-light"
              >
                Próximo
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </footer>
      ) : null}

      <Dialog open={logoOpen} onOpenChange={setLogoOpen}>
        <DialogContent className="max-w-2xl border-white/10 bg-black p-8">
          <DialogTitle className="sr-only">Marca oficial Risco Zero ampliada</DialogTitle>
          <div className="flex min-h-[65vh] items-center justify-center">
            <img
              src="/risco-zero-logo.png"
              alt="Risco Zero Proteção Veicular"
              className="max-h-[65vh] w-auto object-contain"
              width={366}
              height={423}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
