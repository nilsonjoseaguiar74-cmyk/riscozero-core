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
import type { SiteMediaCard } from "@/types";

function InstitutionalGallery({
  title,
  description,
  media,
  ariaLabel,
}: {
  title: string;
  description: string;
  media: SiteMediaCard[];
  ariaLabel: string;
}) {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api || media.length < 2) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => window.clearInterval(interval);
  }, [api, media.length]);

  if (media.length === 0) return null;

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>

      <Carousel
        opts={{ loop: media.length > 1 }}
        setApi={setApi}
        className="mx-0 sm:mx-10"
        aria-label={ariaLabel}
      >
        <CarouselContent>
          {media.map((photo) => (
            <CarouselItem key={photo.id}>
              <figure>
                <img
                  src={photo.imageUrl}
                  alt={photo.alt}
                  className="aspect-[16/10] w-full rounded-2xl border border-border object-cover shadow-raised"
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

        {media.length > 1 ? (
          <>
            <CarouselPrevious aria-label={`Imagem anterior — ${title}`} />
            <CarouselNext aria-label={`Próxima imagem — ${title}`} />
          </>
        ) : null}
      </Carousel>
    </div>
  );
}

export function UnitSection() {
  const { data: content } = useQuery({
    queryKey: queryKeys.unitSection,
    queryFn: () => services.siteContent.getUnitSection(),
  });

  const activeMedia = useMemo(
    () => content?.media.filter((item) => item.active).toSorted((a, b) => a.order - b.order) ?? [],
    [content?.media],
  );

  const establishmentMedia = useMemo(
    () => activeMedia.filter((item) => item.position === "secondary"),
    [activeMedia],
  );

  const institutionalMedia = useMemo(
    () => activeMedia.filter((item) => item.position === "complementary"),
    [activeMedia],
  );

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

        <InstitutionalGallery
          title="Galeria do estabelecimento"
          description="Conheça a estrutura física e os ambientes da nossa unidade."
          media={establishmentMedia}
          ariaLabel="Galeria de imagens do estabelecimento"
        />
      </div>

      {institutionalMedia.length > 0 ? (
        <div className="mt-12 border-t border-border pt-10">
          <InstitutionalGallery
            title="Outras fotos institucionais"
            description="Registros da empresa, equipe, ações e outros momentos institucionais."
            media={institutionalMedia}
            ariaLabel="Galeria de outras fotos institucionais"
          />
        </div>
      ) : null}
    </Section>
  );
}
