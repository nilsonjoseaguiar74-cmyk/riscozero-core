import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/landing/Section";
import { CITIES, SAO_JOSE_LOCALITIES, SITE, TRAVEL_CORRIDORS } from "@/config/site";

export const Route = createFileRoute("/_site/regioes")({
  head: () => ({
    meta: [
      { title: "Regiões atendidas na Grande Florianópolis | Risco Zero" },
      {
        name: "description",
        content:
          "Municípios atendidos na Grande Florianópolis, localidades de São José e principais corredores de deslocamento.",
      },
      { property: "og:title", content: "Regiões atendidas | Risco Zero" },
      {
        property: "og:description",
        content: "Atendimento concentrado na Grande Florianópolis.",
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
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Bairros e localidades de São José"
              title="Campinas, Kobrasol, Barreiros e Forquilhinhas"
            />
            <ul className="mt-6 flex flex-wrap gap-2">
              {SAO_JOSE_LOCALITIES.map((locality) => (
                <li
                  key={locality}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground"
                >
                  {locality}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="Corredores de deslocamento" title="BR-101 e Via Expressa" />
            <ul className="mt-6 flex flex-wrap gap-2">
              {TRAVEL_CORRIDORS.map((corridor) => (
                <li
                  key={corridor}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground"
                >
                  {corridor}
                </li>
              ))}
            </ul>
          </div>
        </div>
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
