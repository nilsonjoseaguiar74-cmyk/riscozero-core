import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ImagePlus, Pencil, Star, ToggleLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { queryKeys, services } from "@/services";

export const Route = createFileRoute("/app/settings/site-content")({
  component: SiteContentSettingsRoute,
});

const plannedEndpoints = [
  "POST /site-content/media",
  "PATCH /site-content/media/:id",
  "DELETE /site-content/media/:id",
  "PATCH /site-content/media/order",
];

function SiteContentSettingsRoute() {
  const { data: unitContent } = useQuery({
    queryKey: queryKeys.unitSection,
    queryFn: () => services.siteContent.getUnitSection(),
  });
  const { data: testimonials = [] } = useQuery({
    queryKey: queryKeys.testimonials,
    queryFn: () => services.siteContent.getTestimonials(),
  });

  const orderedMedia = [...(unitContent?.media ?? [])].sort((a, b) => a.order - b.order);
  const orderedTestimonials = [...testimonials].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow text-gold">Conteúdo do Site</p>
        <h1 className="display-2 mt-2 text-foreground">Gestão da Home pública</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Área preparada para que o gestor administre textos, depoimentos e mídia da Home sem
          alterar código. As ações abaixo são visuais nesta etapa; upload e persistência serão
          conectados posteriormente ao backend NestJS e ao storage.
        </p>
      </div>

      <section className="card-elevated p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="heading-3 text-foreground">Nossa Unidade</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Configure imagens, textos alternativos, posição, ordem e status de exibição.
            </p>
          </div>
          <Button disabled aria-label="Adicionar imagem da unidade quando upload estiver conectado">
            <ImagePlus className="size-4" aria-hidden={true} />
            Adicionar imagem
          </Button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="unit-title">Título da seção</Label>
            <Input id="unit-title" value={unitContent?.title ?? ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit-address">Endereço</Label>
            <Input id="unit-address" value={unitContent?.address ?? ""} readOnly />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="unit-description">Descrição</Label>
            <Textarea id="unit-description" value={unitContent?.description ?? ""} readOnly />
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {orderedMedia.length > 0 ? (
            orderedMedia.map((media) => (
              <article key={media.id} className="rounded-xl border border-border bg-background p-4">
                <div className="grid gap-4 lg:grid-cols-[160px_1fr]">
                  <img
                    src={media.imageUrl}
                    alt={media.alt}
                    className="aspect-[4/3] w-full rounded-lg border border-border object-cover"
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <ReadOnlyField label="Título" value={media.title ?? "Sem título"} />
                    <ReadOnlyField label="Alt text" value={media.alt} />
                    <ReadOnlyField label="Posição" value={media.position} />
                    <ReadOnlyField label="Ordem" value={String(media.order)} />
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Badge variant={media.active ? "default" : "secondary"}>
                        {media.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 self-end">
                      <Button variant="outline" size="sm" disabled>
                        <Pencil className="size-4" aria-hidden={true} /> Editar
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        Definir como principal
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        <ToggleLeft className="size-4" aria-hidden={true} /> Ativar/desativar
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        <Trash2 className="size-4" aria-hidden={true} /> Remover
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-background p-5 text-sm text-muted-foreground">
              Nenhuma imagem cadastrada. A Home continuará exibindo título, descrição, endereço,
              mapa e CTA sem placeholder visual.
            </div>
          )}
        </div>
      </section>

      <section className="card-elevated p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="heading-3 text-foreground">Depoimentos</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Conteúdo inicial oficial do Google preparado para futura gestão de ordem e status.
            </p>
          </div>
          <Button disabled aria-label="Adicionar depoimento quando persistência estiver conectada">
            <Star className="size-4" aria-hidden={true} />
            Adicionar depoimento
          </Button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {orderedTestimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="rounded-xl border border-border bg-background p-4"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <ReadOnlyField label="Nome" value={testimonial.name} />
                <ReadOnlyField label="Origem" value={testimonial.source} />
                <ReadOnlyField label="Nota" value={`${testimonial.rating}/5`} />
                <ReadOnlyField label="Ordem" value={String(testimonial.order)} />
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Badge variant={testimonial.active ? "default" : "secondary"}>
                    {testimonial.active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Texto</Label>
                  <Textarea value={testimonial.quote} readOnly />
                </div>
                <div className="flex flex-wrap gap-2 sm:col-span-2">
                  <Button variant="outline" size="sm" disabled>
                    <Pencil className="size-4" aria-hidden={true} /> Editar
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Alterar ordem
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <ToggleLeft className="size-4" aria-hidden={true} /> Ativar/desativar
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <Trash2 className="size-4" aria-hidden={true} /> Remover
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card-elevated p-5">
        <h2 className="text-base font-[650] text-foreground">Contratos planejados do backend</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Endpoints documentados como pendência técnica; não estão implementados nesta entrega.
        </p>
        <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {plannedEndpoints.map((endpoint) => (
            <li key={endpoint} className="rounded-lg border border-border bg-background px-3 py-2">
              <code>{endpoint}</code>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  const id = `${label.toLowerCase().replaceAll(" ", "-")}-${value.slice(0, 8)}`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} readOnly />
    </div>
  );
}
