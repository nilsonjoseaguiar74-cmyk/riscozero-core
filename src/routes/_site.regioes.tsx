import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/landing/Section";
import { REGIONS, SITE, CITIES } from "@/config/site";

export const Route = createFileRoute("/_site/regioes")({
  head: () => ({
    meta: [
      { title: "Regiões atendidas na Grande Florianópolis | Risco Zero" },
      {
        name: "description",
        content:
          "Atendimento em São José, Florianópolis, Palhoça, Biguaçu, Kobrasol, Campinas, Barreiros, Forquilhinhas, BR-101 e Via Expressa.",
      },
      { property: "og:title", content: "Regiões atendidas | Risco Zero" },
      {
        property: "og:description",
        content: "Cobertura de atendimento concentrada na Grande Florianópolis.",
      },
    ],
  }),
  component: RegionsPage,
});

const CITY_NOTES: Record<string, string> = {
  "São José": "Sede administrativa e principal base operacional, com atendimento presencial.",
  Florianópolis: "Atendimento em toda a ilha e continente, incluindo corredores de maior fluxo.",
  Palhoça: "Cobertura nos bairros centrais e nas ligações com a BR-101.",
  Biguaçu: "Atendimento na área urbana e nos acessos rodoviários da região norte.",
};

function RegionsPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="Regiões"
          title="Onde a Risco Zero atende"
          description="A operação é regional e concentrada, o que permite proximidade com o participante e resposta rápida da rede de prestadores."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {CITIES.map((city) => (
            <article key={city} className="card-elevated p-5">
              <div className="flex items-start gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                  <MapPin className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-[650] text-foreground">{city}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {CITY_NOTES[city]}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Bairros e corredores" title="Áreas com atendimento frequente" />
        <ul className="mt-8 flex flex-wrap gap-2">
          {REGIONS.map((region) => (
            <li
              key={region}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground"
            >
              {region}
            </li>
          ))}
        </ul>
        <div className="card-elevated mt-8 p-5">
          <h3 className="text-base font-[650] text-foreground">Endereço de atendimento</h3>
          <p className="mt-2 text-sm text-muted-foreground">{SITE.address}</p>
          <Button asChild variant="outline" className="mt-4">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`}
              target="_blank"
              rel="noreferrer"
            >
              Abrir no mapa
            </a>
          </Button>
        </div>
      </Section>

      <Section tone="brand">
        <div className="grid items-center gap-6 md:grid-cols-[1.4fr_auto]">
          <h2 className="display-2 text-brand-foreground">
            Sua cidade está na região atendida? Fale com a equipe
          </h2>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold-light">
            <Link to="/contato">Falar com a equipe</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
