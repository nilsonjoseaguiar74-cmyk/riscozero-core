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
    text: "Landing page e formulários têm base preparada para captar oportunidades; o WhatsApp exige identificação e integração próprias.",
  },
  {
    icon: Gauge,
    title: "Operação rastreável",
    text: "Atendimento, responsáveis, etapas e tarefas deverão formar um histórico verificável para a gestão.",
  },
  {
    icon: BarChart3,
    title: "Decisão orientada por dados",
    text: "Indicadores comerciais e de mídia deverão conectar investimento, atendimento e resultado.",
  },
];

const DOCUMENT_CHECKLIST = [
  "Razão social",
  "CNPJ",
  "Status cadastral perante a Susep",
  "Regulamento vigente",
  "Benefícios efetivamente disponíveis",
  "Limites, carências e condições",
  "Terminologia autorizada para comunicação",
  "Documentos ou evidências usados como fonte",
];

const ROLES = [
  ["Comercial", "Atendimento, leads, atividades e tarefas."],
  ["Gestor", "Indicadores, operação, relatórios e supervisão."],
  ["Gestor de tráfego", "Aquisição, campanhas e desempenho por origem."],
  ["Desenvolvedor", "Integrações, diagnóstico e recursos técnicos."],
  ["Administrador", "Governança, usuários, permissões e auditoria."],
];

const PLATFORM_STATUS = [
  {
    title: "Demonstrável agora",
    text: "Site público responsivo, formulário com modo mock, login demonstrativo, shell administrativo e este Blueprint.",
  },
  {
    title: "Fundação técnica existente",
    text: "Backend NestJS com PostgreSQL, migration, autenticação JWT, RBAC, leads, tarefas, dashboard básico, auditoria e testes.",
  },
  {
    title: "Integração pendente",
    text: "Conectar o frontend ao backend, completar o transporte da sessão e materializar as telas de CRM e BI sobre dados reais.",
  },
  {
    title: "Planejado",
    text: "Mídia paga, WhatsApp, webhooks, SIPROV, SGA, monitoramento, backups e deploy operacional.",
  },
  {
    title: "Produção validada",
    text: "Nenhum módulo possui evidência de produção validada no repositório. Requer operação controlada, segurança e observabilidade.",
  },
];

const REGIONAL_GROUPS = [
  ["Municípios", ["São José", "Florianópolis", "Palhoça", "Biguaçu"]],
  ["Bairros e localidades de São José", ["Campinas", "Kobrasol", "Barreiros", "Forquilhinhas"]],
  ["Corredores de deslocamento", ["BR-101", "Via Expressa"]],
] as const;

const TRACKING_FIELDS = [
  "Origem",
  "Canal",
  "Campanha",
  "Conjunto de anúncios",
  "Anúncio",
  "Página de entrada",
  "Município, bairro ou região",
  "Data e hora",
  "Identificador do clique",
  "Forma de conversão",
  "Primeiro contato",
  "Resultado comercial",
];

const FUNNEL_STAGES = [
  "Clique no WhatsApp",
  "Conversa iniciada",
  "Lead identificado",
  "Lead válido",
  "Lead duplicado",
  "Lead qualificado",
  "Cotação enviada",
  "Contratação confirmada",
];

const FORMULAS = [
  ["CTR", "cliques ÷ impressões × 100"],
  ["CPC", "investimento ÷ cliques"],
  ["Taxa de conversão da landing page", "leads válidos ÷ visitantes da página × 100"],
  ["CPL", "investimento em mídia ÷ leads válidos"],
  ["Taxa de qualificação", "leads qualificados ÷ leads válidos × 100"],
  ["Taxa de cotação", "cotações enviadas ÷ leads válidos × 100"],
  ["Taxa de conversão comercial", "contratações confirmadas ÷ leads válidos × 100"],
  ["Custo por aquisição", "investimento em mídia ÷ contratações confirmadas"],
];

const CHAPTERS: Chapter[] = [
  {
    id: "capa",
    label: "Capa",
    eyebrow: "Blueprint executivo · 2026",
    title: "Do primeiro contato à inteligência de gestão.",
    summary:
      "Blueprint de uma plataforma para conectar aquisição, atendimento, CRM e leitura executiva, com integração e validação de produção ainda pendentes.",
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
      "A proposta combina atendimento humano regional com uma operação digital rastreável, condicionada à validação documental e à implantação das integrações.",
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
    id: "conformidade",
    label: "Conformidade",
    eyebrow: "Contexto regulatório",
    title: "Proteção patrimonial mutualista não é seguro tradicional.",
    summary:
      "São operações com estruturas, contratos e regras diferentes. A condição específica da Risco Zero exige comprovação documental e consulta oficial.",
    content: (
      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">
            Proteção veicular é igual a seguro tradicional?
          </p>
          <p className="mt-4 text-base font-semibold text-white">
            Não. São operações com estruturas, contratos e regras diferentes.
          </p>
          <div className="mt-3 space-y-3 text-sm leading-6 text-white/65">
            <p>
              A proteção patrimonial mutualista possui funcionamento baseado nas regras do grupo, no
              regulamento e no rateio das despesas entre os participantes. Desde a Lei Complementar
              nº 213/2025, essas operações passaram a integrar um processo específico de
              regulamentação e supervisão da Susep.
            </p>
            <p>
              Antes da adesão, a Risco Zero deve apresentar claramente as condições, os benefícios,
              os limites, as obrigações do participante e o regulamento aplicável.
            </p>
          </div>
        </article>
        <aside className="rounded-2xl border border-gold/25 bg-gold/5 p-6">
          <ShieldCheck className="size-5 text-gold" aria-hidden="true" />
          <h3 className="mt-4 font-semibold text-white">Situação específica</h3>
          <p className="mt-2 text-sm leading-6 text-white/65">
            Cadastramento não significa regularidade definitiva. Razão social, CNPJ, regulamento e
            status cadastral não estão comprovados no repositório.
          </p>
          <p className="mt-4 text-sm font-semibold text-gold-light">
            Validação documental pendente
          </p>
        </aside>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs lg:col-span-2">
          <a
            href="https://www.planalto.gov.br/ccivil_03/leis/lcp/Lcp213.htm"
            target="_blank"
            rel="noreferrer"
            className="text-white/60 underline underline-offset-4 hover:text-white"
          >
            Lei Complementar nº 213/2025
          </a>
          <a
            href="https://www.gov.br/susep/pt-br/assuntos/protecao-patrimonial-mutualista/associacoes-de-protecao-patrimonial-mutualista"
            target="_blank"
            rel="noreferrer"
            className="text-white/60 underline underline-offset-4 hover:text-white"
          >
            Orientações oficiais da Susep
          </a>
          <a
            href="https://www.gov.br/susep/pt-br/central-de-conteudos/noticias/2026/maio/publicadas-as-normas-que-regulamentam-protecao-patrimonial-mutualista-e-cooperativas-de-seguro"
            target="_blank"
            rel="noreferrer"
            className="text-white/60 underline underline-offset-4 hover:text-white"
          >
            Resolução CNSP nº 491/2026
          </a>
        </div>
      </div>
    ),
  },
  {
    id: "validacao",
    label: "Validação",
    eyebrow: "Validação necessária antes da apresentação",
    title: "A narrativa comercial depende de evidência verificável.",
    summary:
      "Itens sem comprovação permanecem pendentes e não podem sustentar promessas regulatórias ou comerciais.",
    content: (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {DOCUMENT_CHECKLIST.map((item) => (
          <article key={item} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <Check className="size-4 text-white/35" aria-hidden="true" />
            <h3 className="mt-4 text-sm font-semibold text-white">{item}</h3>
            <p className="mt-2 text-xs font-medium text-amber-200">Validação documental pendente</p>
          </article>
        ))}
      </div>
    ),
  },
  {
    id: "status",
    label: "Status",
    eyebrow: "Estado real da plataforma",
    title: "Protótipo, fundação, integração e produção são estágios distintos.",
    summary:
      "A classificação abaixo reflete evidências do código atual e evita apresentar mocks ou telas demonstrativas como operação implantada.",
    content: (
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        {PLATFORM_STATUS.map(({ title, text }, index) => (
          <article key={title} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <CircleDot
              className={index === 4 ? "size-5 text-amber-200" : "size-5 text-gold"}
              aria-hidden="true"
            />
            <h3 className="mt-4 font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/55">{text}</p>
          </article>
        ))}
      </div>
    ),
  },
  {
    id: "regioes",
    label: "Regiões",
    eyebrow: "Classificação geográfica",
    title: "Municípios, localidades e corredores têm funções diferentes.",
    summary:
      "A comunicação regional deve preservar a hierarquia territorial e não apresentar bairros de São José como cidades.",
    content: (
      <div className="grid gap-4 md:grid-cols-3">
        {REGIONAL_GROUPS.map(([title, items]) => (
          <article key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-light">
              {title}
            </h3>
            <ul className="mt-5 space-y-2 text-sm text-white/70">
              {items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CircleDot className="size-3 text-gold" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    ),
  },
  {
    id: "rastreamento",
    label: "Atribuição",
    eyebrow: "Rastreamento e atribuição",
    title: "Origem identificável depende de configuração e continuidade do dado.",
    summary:
      "Anúncios utilizarão parâmetros de campanha e identificadores de rastreamento; a plataforma deverá preservar esses sinais até o resultado comercial.",
    content: (
      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TRACKING_FIELDS.map((field) => (
            <div key={field} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
              <p className="text-xs leading-5 text-white/65">{field}</p>
            </div>
          ))}
        </div>
        <article className="rounded-2xl border border-gold/25 bg-gold/5 p-6">
          <Sparkles className="size-5 text-gold" aria-hidden="true" />
          <h3 className="mt-4 font-semibold text-white">
            Formulário e WhatsApp não são equivalentes
          </h3>
          <p className="mt-2 text-sm leading-6 text-white/65">
            O rastreamento pelo formulário tende a ser mais preciso. No WhatsApp, serão necessários
            links identificados, mensagens predefinidas ou integração com o CRM.
          </p>
          <p className="mt-3 text-sm leading-6 text-white/65">
            Sem essa configuração, é possível medir cliques no botão, mas não afirmar
            automaticamente que cada clique se transformou em lead ou contratação.
          </p>
        </article>
      </div>
    ),
  },
  {
    id: "funil",
    label: "Funil",
    eyebrow: "Funil comercial",
    title: "Interação, oportunidade e resultado não são o mesmo evento.",
    summary:
      "Cada etapa precisa de definição, data, responsável e regra de validação próprias para evitar métricas infladas.",
    content: (
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FUNNEL_STAGES.map((stage, index) => (
          <li key={stage} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold text-gold-light">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-5 text-sm font-semibold text-white">{stage}</p>
          </li>
        ))}
      </ol>
    ),
  },
  {
    id: "indicadores",
    label: "Indicadores",
    eyebrow: "Métricas e fórmulas",
    title: "Indicadores comparáveis exigem denominadores consistentes.",
    summary:
      "Cliques, visitantes, leads válidos, cotações e contratações devem permanecer eventos distintos em todos os cálculos.",
    content: (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FORMULAS.map(([name, formula]) => (
          <article key={name} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-sm font-semibold text-white">{name}</h3>
            <p className="mt-3 text-xs leading-5 text-white/60">{formula}</p>
          </article>
        ))}
        <p className="rounded-xl border border-gold/25 bg-gold/5 p-4 text-xs leading-5 text-white/65 sm:col-span-2 lg:col-span-4">
          Regra técnica: quando o denominador for zero, o indicador deve retornar “não disponível”
          ou valor nulo — nunca infinito, erro ou percentual artificial.
        </p>
      </div>
    ),
  },
  {
    id: "dashboard",
    label: "Dashboard",
    eyebrow: "Leitura gerencial",
    title: "Aquisição, operação comercial e resultado em dimensões separadas.",
    summary:
      "A proposta é organizar a decisão executiva sem antecipar uma integração ainda pendente.",
    content: (
      <div className="grid gap-4 md:grid-cols-3">
        {[
          [
            "Aquisição",
            "Quanto foi investido, quais campanhas atraíram contatos e qual foi o custo de cada oportunidade.",
          ],
          [
            "Operação comercial",
            "Quantos contatos foram atendidos, quanto tempo demorou o primeiro atendimento e quantas cotações foram enviadas.",
          ],
          [
            "Resultado",
            "Quantos leads foram qualificados, quantas contratações foram confirmadas, quais regiões tiveram melhor desempenho e quais são os principais motivos de perda.",
          ],
        ].map(([title, text]) => (
          <article key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <BarChart3 className="size-5 text-gold" aria-hidden="true" />
            <h3 className="mt-4 font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">{text}</p>
          </article>
        ))}
        <p className="rounded-xl border border-gold/25 bg-gold/5 p-4 text-center text-sm font-medium text-white/75 md:col-span-3">
          “O objetivo é conectar investimento, atendimento e resultado comercial em uma única
          leitura gerencial.”
        </p>
      </div>
    ),
  },
  {
    id: "privacidade",
    label: "Privacidade",
    eyebrow: "Privacidade e proteção de dados",
    title: "Proteção de dados é requisito contínuo, não selo antecipado.",
    summary:
      "O protótipo possui consentimento e bases de rastreamento, mas adequação jurídica, retenção, governança e integrações exigem validação e implantação.",
    content: (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          "Aviso de privacidade próximo ao formulário e finalidade clara",
          "Acesso aos dados conforme perfil e proteção contra acessos indevidos",
          "Registro das movimentações e rastreabilidade das ações",
          "Prazo formal de retenção e descarte",
          "Procedimento para correção ou exclusão",
          "Controle das integrações com plataformas de anúncios",
          "Política de cookies e tecnologias de rastreamento",
          "Auditoria técnica, jurídica e operacional antes de produção",
        ].map((item) => (
          <article key={item} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <LockKeyhole className="size-4 text-gold" aria-hidden="true" />
            <p className="mt-4 text-sm leading-6 text-white/65">{item}</p>
            <p className="mt-2 text-xs text-amber-200">Requisito do projeto</p>
          </article>
        ))}
      </div>
    ),
  },
  {
    id: "arquitetura",
    label: "Arquitetura",
    eyebrow: "Fundação tecnológica",
    title: "Monólito modular, contratos claros e evolução sem ruptura.",
    summary:
      "A fundação separa experiência, aplicação e dados; a conexão completa do frontend e a validação de produção permanecem pendentes.",
    content: (
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
        {[
          [MonitorPlay, "Experiência", "React 19 · Vite · TanStack · mocks por padrão"],
          [Boxes, "Aplicação", "NestJS · API REST modular · integração pendente"],
          [Database, "Dados", "Prisma · PostgreSQL · ambiente local validado"],
        ].map(([Icon, title, text], index) => {
          const Component = Icon as typeof MonitorPlay;
          return (
            <div key={String(title)} className="contents">
              <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <Component className="size-5 text-gold" aria-hidden="true" />
                <h3 className="mt-5 font-semibold text-white">{String(title)}</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">{String(text)}</p>
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
            JWT, refresh cookie HttpOnly, RBAC e auditoria existem na fundação do backend; operação
            integrada e segurança de produção ainda requerem validação.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "perfis",
    label: "Perfis",
    eyebrow: "Governança de acesso",
    title: "Cada profissional deve enxergar apenas o necessário.",
    summary:
      "A matriz de permissões existe no frontend demonstrativo e no backend; a cobertura completa das telas administrativas ainda é planejada.",
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
        </div>
      </div>
    ),
  },
  {
    id: "roadmap",
    label: "Roadmap",
    eyebrow: "Evolução controlada",
    title: "Validar documentos antes de integrar e operar.",
    summary:
      "A primeira decisão é regulatória e documental; tecnologia e comunicação avançam sobre uma base comprovada.",
    content: (
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          [
            "01",
            "Validação regulatória e documental",
            "Confirmar a razão social, o CNPJ, o status cadastral perante a Susep e o regulamento aplicável à operação.",
          ],
          [
            "02",
            "Validação da narrativa e dos benefícios",
            "Aprovar terminologia, disponibilidade, limites, carências e condições com evidências.",
          ],
          [
            "03",
            "Integração de autenticação, leads e CRM",
            "Conectar o frontend à API e validar sessão, perfis e fluxo comercial.",
          ],
          [
            "04",
            "Rastreamento e atribuição",
            "Configurar campanhas, eventos, consentimento e continuidade dos identificadores.",
          ],
          [
            "05",
            "Piloto com dados controlados",
            "Medir qualidade dos dados, operação, segurança e indicadores com escopo limitado.",
          ],
          [
            "06",
            "Produção e integrações oficiais",
            "Executar deploy, monitoramento, backups e conectores aprovados pelos fornecedores.",
          ],
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
    title: "Uma apresentação transparente, seguida da experiência demonstrativa.",
    summary:
      "A demonstração comprova a experiência e a fundação técnica sem representar integração completa, condição regulatória ou produção validada.",
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
