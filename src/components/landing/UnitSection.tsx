import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Section, SectionHeading } from "@/components/landing/Section";
import { SITE, googleMapsEmbedLink, googleMapsLink } from "@/config/site";
import { queryKeys, services } from "@/services";

export function UnitSection() {
  const { data: content } = useQuery({
    queryKey: queryKeys.unitSection,
    queryFn: () => services.siteContent.getUnitSection(),
  });

  const activeMedia = useMemo(
    () => content?.media.filter((item) => item.active).toSorted((a, b) => a.order - b.order) ?? [],
    [content?.media],
  );

  const carouselMedia = useMemo(
    () =>
      activeMedia.filter(
        (item) => item.position === "secondary" || item.position === "complementary",
      ),
    [activeMedia],
  );

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!carouselApi || carouselMedia.length < 2) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      carouselApi.scrollNext();
    }, 5000);

    return () => window.clearInterval(interval);
  }, [carouselApi, carouselMedia.length]);

  return (
    <Section tone="muted">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
        <div>
          <SectionHeading
            eyebrow="Nossa Unidade"
            title={content?.title ?? "Estrutura física para atender você de perto"}
            description={
              content?.description ??
              "Nossa unidade em Campinas, São José, reúne atendimento local e estrutura para orientar associados com proximidade e clareza."
            }
          />

          <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-start gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <MapPin className="size-5" aria-hidden={true} />
              </span>
              <div>
                <h3 className="font-[650] text-foreground">Endereço</h3>
                <address className="mt-1 not-italic leading-relaxed text-muted-foreground">
                  {content?.address ?? SITE.address}
                </address>
              </div>
            </div>
            <Button asChild className="mt-5 bg-gold text-gold-foreground hover:bg-gold-light">
              <a
                href={googleMapsLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver endereço da Risco Zero no Google Maps em nova aba"
              >
                Ver no Google Maps
                <ExternalLink className="size-4" aria-hidden={true} />
              </a>
            </Button>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <iframe
              src={googleMapsEmbedLink()}
              title="Mapa da unidade Risco Zero Proteção Veicular em São José, Santa Catarina"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[320px] w-full border-0 md:h-[380px]"
              aria-label="Mapa com localização da Risco Zero Proteção Veicular"
            />
          </div>
        </div>

        {carouselMedia.length > 0 ? (
          <Carousel
            opts={{ loop: carouselMedia.length > 1 }}
            setApi={setCarouselApi}
            className="mx-10"
          >
            <CarouselContent>
              {carouselMedia.map((photo) => (
                <CarouselItem key={photo.id}>
                  <figure>
                    <img
                      src={photo.imageUrl}
                      alt={photo.alt}
                      className="aspect-[4/3] w-full rounded-2xl border border-border object-cover shadow-raised"
                    />
                    {photo.title ? (
                      <figcaption className="mt-2 text-sm text-muted-foreground">
                        {photo.title}
                      </figcaption>
                    ) : null}
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
            {carouselMedia.length > 1 ? (
              <>
                <CarouselPrevious aria-label="Imagem anterior da unidade" />
                <CarouselNext aria-label="Próxima imagem da unidade" />
              </>
            ) : null}
          </Carousel>
        ) : null}
      </div>
    </Section>
  );
}
