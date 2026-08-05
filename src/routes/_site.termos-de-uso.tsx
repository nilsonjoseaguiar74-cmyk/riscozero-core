import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/landing/Section";
import { SITE } from "@/config/site";

export const Route = createFileRoute("/_site/termos-de-uso")({
  head: () => ({
    meta: [
      { title: "Termos de uso | Risco Zero Proteção Veicular" },
      {
        name: "description",
        content:
          "Condições de uso do site institucional e dos canais digitais da Risco Zero Proteção Veicular.",
      },
      { property: "og:title", content: "Termos de uso | Risco Zero" },
      {
        property: "og:description",
        content: "Regras de utilização do site, natureza das informações e limitações aplicáveis.",
      },
    ],
  }),
  component: TermsPage,
});

const SECTIONS = [
  {
    title: "1. Aceitação",
    body: `Ao utilizar este site, o visitante concorda com estas condições. Caso não concorde, recomenda-se a interrupção do uso dos canais digitais da ${SITE.fullName}.`,
  },
  {
    title: "2. Natureza das informações",
    body: "O conteúdo publicado tem caráter informativo e não constitui proposta vinculante nem contrato de seguro. As condições definitivas constam do regulamento da associação e dos documentos de adesão.",
  },
  {
    title: "3. Modelo associativo",
    body: "A comunicação apresenta o modelo de proteção patrimonial mutualista. Razão social, CNPJ, status cadastral perante a Susep e regulamento aplicável permanecem com validação documental pendente. A disponibilidade de benefícios, limites e assistências depende da opção apresentada e dos documentos vigentes.",
  },
  {
    title: "4. Uso adequado",
    body: "É vedado utilizar o site para fins ilícitos, inserir dados falsos, tentar acessar áreas restritas sem autorização ou comprometer o funcionamento da plataforma.",
  },
  {
    title: "5. Área administrativa",
    body: "O acesso à área administrativa é restrito a usuários autorizados. As credenciais são pessoais e intransferíveis, e as ações realizadas ficam registradas em trilha de auditoria.",
  },
  {
    title: "6. Propriedade intelectual",
    body: "Marca, logotipo, textos, imagens e demais elementos deste site pertencem à associação e não podem ser reproduzidos sem autorização prévia.",
  },
  {
    title: "7. Disponibilidade",
    body: "O site pode passar por manutenções programadas ou emergenciais. Não há garantia de disponibilidade ininterrupta dos canais digitais.",
  },
  {
    title: "8. Alterações",
    body: "Estas condições podem ser atualizadas a qualquer momento. A versão vigente é sempre a publicada nesta página.",
  },
  {
    title: "9. Contato",
    body: `Dúvidas sobre estas condições podem ser encaminhadas pelo WhatsApp ${SITE.whatsapp}.`,
  },
];

function TermsPage() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Termos"
        title="Termos de uso"
        description={`Documento mantido pela ${SITE.fullName} para orientar a utilização dos canais digitais.`}
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
