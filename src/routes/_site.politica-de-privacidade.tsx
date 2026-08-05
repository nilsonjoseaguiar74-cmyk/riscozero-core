import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/landing/Section";
import { SITE } from "@/config/site";

export const Route = createFileRoute("/_site/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de privacidade | Risco Zero Proteção Veicular" },
      {
        name: "description",
        content:
          "Como a Risco Zero coleta, utiliza, armazena e protege os dados pessoais informados pelos interessados e participantes.",
      },
      { property: "og:title", content: "Política de privacidade | Risco Zero" },
      {
        property: "og:description",
        content: "Tratamento de dados pessoais, finalidades, retenção e direitos do titular.",
      },
    ],
  }),
  component: PrivacyPage,
});

const SECTIONS = [
  {
    title: "1. Responsável pelo tratamento",
    body: `Esta política descreve o tratamento de dados pessoais realizado por ${SITE.fullName}, com endereço em ${SITE.address}. O conteúdo desta página é mantido pela associação e pode ser atualizado a qualquer momento.`,
  },
  {
    title: "2. Dados coletados",
    body: "São coletados os dados informados voluntariamente nos formulários do site: nome, WhatsApp, placa, cidade, tipo e ano aproximado do veículo, melhor horário e preferência de atendimento. Também são registrados dados técnicos de navegação, como origem da visita, parâmetros de campanha, página de entrada, tipo de dispositivo e navegador.",
  },
  {
    title: "3. Finalidades do tratamento",
    body: "Os dados são utilizados para responder à solicitação, analisar o perfil do veículo, apresentar opções de proteção e benefícios, conduzir o processo de adesão, prestar atendimento e medir o desempenho dos canais de aquisição.",
  },
  {
    title: "4. Base legal",
    body: "O tratamento ocorre mediante consentimento do titular no envio do formulário, execução de procedimentos preliminares relacionados à adesão e legítimo interesse na melhoria dos canais de atendimento.",
  },
  {
    title: "5. Compartilhamento",
    body: "Os dados podem ser compartilhados com prestadores de serviço envolvidos no atendimento, na assistência e na operação tecnológica da plataforma, sempre limitados à finalidade informada.",
  },
  {
    title: "6. Retenção e eliminação",
    body: "Os dados são mantidos pelo período necessário ao atendimento e ao cumprimento de obrigações legais e regulatórias aplicáveis. Encerradas as finalidades, os registros são eliminados ou anonimizados.",
  },
  {
    title: "7. Direitos do titular",
    body: "O titular pode solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade, informação sobre compartilhamentos e revogação do consentimento pelos canais oficiais de atendimento.",
  },
  {
    title: "8. Cookies",
    body: "O site utiliza cookies essenciais ao funcionamento e cookies de medição para identificar a origem das visitas. As preferências podem ser ajustadas no aviso exibido no primeiro acesso.",
  },
  {
    title: "9. Segurança",
    body: "São adotadas medidas técnicas e administrativas para proteger os dados contra acessos não autorizados e situações acidentais ou ilícitas de destruição, perda e alteração.",
  },
  {
    title: "10. Contato",
    body: `Solicitações relacionadas a dados pessoais podem ser encaminhadas pelo WhatsApp ${SITE.whatsapp} ou presencialmente no endereço de atendimento.`,
  },
];

function PrivacyPage() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Privacidade"
        title="Política de privacidade"
        description={`Versão de consentimento ${SITE.consentVersion}. Documento mantido pela ${SITE.fullName}.`}
      />
      <div className="mt-10 max-w-3xl space-y-6">
        {SECTIONS.map((section) => (
          <article key={section.title}>
            <h2 className="text-base font-[650] text-foreground">{section.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
