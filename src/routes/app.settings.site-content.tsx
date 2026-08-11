import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, ImagePlus, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorState, LoadingState, NoPermissionState } from "@/components/common/StateViews";
import { useAuth } from "@/contexts/AuthContext";
import { apiErrorMessage, queryKeys, services } from "@/services";
import type { SiteMediaCard, SiteTestimonial } from "@/types";

export const Route = createFileRoute("/app/settings/site-content")({
  component: SiteContentSettingsRoute,
});

const validateImage = (file: File, maxMb: number) => {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    return "Envie uma imagem JPEG, PNG ou WebP.";
  if (file.size > maxMb * 1024 * 1024) return `A imagem deve ter no máximo ${maxMb} MB.`;
  return null;
};

function SiteContentSettingsRoute() {
  const { can } = useAuth();
  const client = useQueryClient();
  const unit = useQuery({
    queryKey: queryKeys.unitSection,
    queryFn: () => services.siteContent.getUnitSection(),
  });
  const testimonials = useQuery({
    queryKey: queryKeys.testimonials,
    queryFn: () => services.siteContent.getTestimonials(),
  });
  const refresh = async () => {
    await Promise.all([
      client.invalidateQueries({ queryKey: queryKeys.unitSection }),
      client.invalidateQueries({ queryKey: queryKeys.testimonials }),
    ]);
  };

  if (!can("settings.manage")) return <NoPermissionState area="a gestão do conteúdo do site" />;
  if (unit.isLoading || testimonials.isLoading)
    return <LoadingState label="Carregando conteúdo do site" />;
  if (unit.isError || testimonials.isError)
    return (
      <ErrorState
        error={unit.error ?? testimonials.error}
        onRetry={() => {
          void unit.refetch();
          void testimonials.refetch();
        }}
      />
    );

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-gold">Conteúdo do Site</p>
        <h1 className="display-2 mt-2 text-foreground">Gestão da Home pública</h1>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
          Atualize o conteúdo institucional, as imagens da unidade e os depoimentos publicados na
          Home.
        </p>
      </div>
      <Tabs defaultValue="home">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="home">Home / Institucional</TabsTrigger>
          <TabsTrigger value="testimonials">Depoimentos</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="mt-5 space-y-6">
          <UnitTextForm content={unit.data!} onSaved={refresh} />

          <div className="rounded-lg border border-brand/20 bg-brand-soft p-4 text-sm text-foreground">
            Gerencie aqui as imagens institucionais da unidade. A imagem marcada como
            <strong> Principal</strong> será utilizada no hero da Home. As imagens
            <strong> Secundária</strong> e <strong>Complementar</strong> serão utilizadas na galeria
            da unidade.
          </div>

          <MediaManager
            items={unit.data!.media.toSorted((a, b) => a.order - b.order)}
            onSaved={refresh}
          />
        </TabsContent>
        <TabsContent value="testimonials" className="mt-5">
          <TestimonialManager
            items={(testimonials.data ?? []).toSorted((a, b) => a.order - b.order)}
            onSaved={refresh}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UnitTextForm({
  content,
  onSaved,
}: {
  content: { title: string; description: string; address: string };
  onSaved: () => Promise<void>;
}) {
  const [form, setForm] = useState({
    title: content.title,
    description: content.description,
    address: content.address,
  });
  useEffect(
    () =>
      setForm({ title: content.title, description: content.description, address: content.address }),
    [content],
  );
  const mutation = useMutation({
    mutationFn: () => services.siteContent.updateUnitSection(form),
    onSuccess: async () => {
      await onSaved();
      toast.success("Conteúdo institucional atualizado.");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });
  return (
    <form
      className="card-elevated grid gap-4 p-5"
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate();
      }}
    >
      <h2 className="heading-3">Informações da unidade</h2>
      <Field label="Título">
        <Input
          value={form.title}
          minLength={3}
          maxLength={160}
          required
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </Field>
      <Field label="Descrição">
        <Textarea
          value={form.description}
          minLength={10}
          maxLength={600}
          required
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </Field>
      <Field label="Endereço">
        <Input
          value={form.address}
          minLength={5}
          maxLength={240}
          required
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </Field>
      <Button className="w-fit" disabled={mutation.isPending}>
        {mutation.isPending ? "Salvando…" : "Salvar informações"}
      </Button>
    </form>
  );
}

function MediaManager({
  items,
  onSaved,
}: {
  items: SiteMediaCard[];
  onSaved: () => Promise<void>;
}) {
  const primary = items.find((item) => item.active && item.position === "primary");
  const empty = { title: "", alt: "", position: "secondary" as SiteMediaCard["position"] };
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const run = useMutation({
    mutationFn: async (action: () => Promise<unknown>) => action(),
    onSuccess: async () => {
      await onSaved();
      toast.success("Imagens atualizadas.");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (editing) {
      run.mutate(() => services.siteContent.updateMedia(editing, form));
      setEditing(null);
      setForm(empty);
      return;
    }
    if (!file) return toast.error("Selecione uma imagem.");
    const error = validateImage(file, 5);
    if (error) return toast.error(error);
    run.mutate(() => services.siteContent.createMedia({ ...form, order: items.length }, file));
    setFile(null);
    setForm(empty);
  };
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (!items[target]) return;
    const next = [...items];
    [next[index], next[target]] = [next[target]!, next[index]!];
    run.mutate(() =>
      services.siteContent.reorderMedia(next.map((item, order) => ({ id: item.id, order }))),
    );
  };
  return (
    <section className="space-y-5">
      <div className="card-elevated overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <p className="eyebrow text-gold">Hero da Home</p>
          <h2 className="mt-1 text-lg font-semibold">Imagem de fundo publicada</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A camada azul de 65% é aplicada automaticamente. Recomendação: imagem horizontal, 1920 ×
            1080 px.
          </p>
        </div>
        {primary ? (
          <div className="relative aspect-[16/7] min-h-48 overflow-hidden bg-brand">
            <img
              src={primary.imageUrl}
              alt={primary.alt}
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-brand/65" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
              <div>
                <p className="font-semibold">{primary.title || "Imagem principal"}</p>
                <p className="text-xs text-white/75">Prévia com a opacidade aplicada</p>
              </div>
              <Badge className="bg-gold text-gold-foreground">Publicada no hero</Badge>
            </div>
          </div>
        ) : (
          <div className="flex min-h-48 items-center justify-center bg-brand px-6 text-center text-sm text-brand-foreground/80">
            Envie uma imagem abaixo e escolha a posição “Principal” para publicá-la no hero.
          </div>
        )}
      </div>
      <form className="card-elevated grid gap-5 p-5 sm:p-6 md:grid-cols-2" onSubmit={submit}>
        <div className="md:col-span-2">
          <h2 className="heading-3">
            {editing ? "Editar informações da imagem" : "Enviar nova imagem"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Use “Principal” para o hero e as demais posições para o carrossel da unidade.
          </p>
        </div>
        {!editing ? (
          <Field label="Arquivo (JPEG, PNG ou WebP; até 5 MB)">
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </Field>
        ) : null}
        <Field label="Título">
          <Input
            value={form.title}
            maxLength={120}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </Field>
        <Field label="Texto alternativo">
          <Input
            value={form.alt}
            minLength={3}
            maxLength={240}
            required
            onChange={(e) => setForm({ ...form, alt: e.target.value })}
          />
        </Field>
        <Field label="Uso da imagem">
          <select
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={form.position}
            onChange={(e) =>
              setForm({ ...form, position: e.target.value as SiteMediaCard["position"] })
            }
          >
            <option value="primary">Hero da Home (principal)</option>
            <option value="secondary">Carrossel da unidade (secundária)</option>
            <option value="complementary">Carrossel da unidade (complementar)</option>
          </select>
        </Field>
        <div className="flex gap-2 md:col-span-2">
          <Button disabled={run.isPending}>
            <ImagePlus className="size-4" />
            {editing ? "Salvar edição" : "Adicionar imagem"}
          </Button>
          {editing ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditing(null);
                setForm(empty);
              }}
            >
              Cancelar
            </Button>
          ) : null}
        </div>
      </form>
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {items.map((item, index) => (
          <article key={item.id} className="card-elevated p-4">
            <img
              src={item.imageUrl}
              alt={item.alt}
              className="aspect-[16/10] w-full rounded-lg object-cover"
            />
            <div className="mt-3 flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{item.title || "Sem título"}</p>
                <p className="text-sm text-muted-foreground">{item.alt}</p>
              </div>
              <Badge variant={item.active ? "default" : "secondary"}>
                {item.active ? "Ativa" : "Inativa"}
              </Badge>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditing(item.id);
                  setForm({ title: item.title ?? "", alt: item.alt, position: item.position });
                }}
              >
                <Pencil className="size-4" />
                Editar
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={index === 0}
                onClick={() => move(index, -1)}
              >
                <ArrowUp className="size-4" />
                Subir
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={index === items.length - 1}
                onClick={() => move(index, 1)}
              >
                <ArrowDown className="size-4" />
                Descer
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={item.position === "primary"}
                onClick={() => run.mutate(() => services.siteContent.setPrimaryMedia(item.id))}
              >
                Usar no hero
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  run.mutate(() =>
                    services.siteContent.updateMedia(item.id, { active: !item.active }),
                  )
                }
              >
                {item.active ? "Desativar" : "Ativar"}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (window.confirm("Excluir esta imagem permanentemente?"))
                    run.mutate(() => services.siteContent.deleteMedia(item.id));
                }}
              >
                <Trash2 className="size-4" />
                Excluir
              </Button>
            </div>
          </article>
        ))}
      </div>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
          Nenhuma imagem cadastrada. A Home continuará sem placeholder visual.
        </p>
      ) : null}
    </section>
  );
}

function TestimonialManager({
  items,
  onSaved,
}: {
  items: SiteTestimonial[];
  onSaved: () => Promise<void>;
}) {
  const blank = { name: "", quote: "", source: "Google", rating: 5, active: true };
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const run = useMutation({
    mutationFn: async (action: () => Promise<unknown>) => action(),
    onSuccess: async () => {
      await onSaved();
      toast.success("Depoimentos atualizados.");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      ...form,
      order: editing ? (items.find((i) => i.id === editing)?.order ?? items.length) : items.length,
    };
    run.mutate(() =>
      editing
        ? services.siteContent.updateTestimonial(editing, payload)
        : services.siteContent.createTestimonial(payload),
    );
    setEditing(null);
    setForm(blank);
  };
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (!items[target]) return;
    const next = [...items];
    [next[index], next[target]] = [next[target]!, next[index]!];
    run.mutate(() =>
      services.siteContent.reorderTestimonials(next.map((item, order) => ({ id: item.id, order }))),
    );
  };
  const avatar = (item: SiteTestimonial, file?: File) => {
    if (!file) return;
    const error = validateImage(file, 2);
    if (error) return toast.error(error);
    run.mutate(() => services.siteContent.setTestimonialAvatar(item.id, file));
  };
  return (
    <section className="space-y-5">
      <form className="card-elevated grid gap-4 p-5 md:grid-cols-2" onSubmit={submit}>
        <h2 className="heading-3 md:col-span-2">
          {editing ? "Editar depoimento" : "Adicionar depoimento"}
        </h2>
        <Field label="Nome">
          <Input
            value={form.name}
            minLength={2}
            maxLength={100}
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Origem">
          <Input
            value={form.source}
            maxLength={80}
            required
            onChange={(e) => setForm({ ...form, source: e.target.value })}
          />
        </Field>
        <Field label="Nota (1 a 5)">
          <Input
            type="number"
            min={1}
            max={5}
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          />
        </Field>
        <Field label="Texto">
          <Textarea
            value={form.quote}
            minLength={5}
            maxLength={1000}
            required
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
          />
        </Field>
        <div className="flex gap-2 md:col-span-2">
          <Button disabled={run.isPending}>
            <Star className="size-4" />
            {editing ? "Salvar edição" : "Adicionar depoimento"}
          </Button>
          {editing ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditing(null);
                setForm(blank);
              }}
            >
              Cancelar
            </Button>
          ) : null}
        </div>
      </form>
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((item, index) => (
          <article key={item.id} className="card-elevated p-4">
            <div className="flex gap-3">
              {item.avatarUrl ? (
                <img
                  src={item.avatarUrl}
                  alt={`Foto de ${item.name}`}
                  className="size-14 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-14 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                  {item.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.source} · {item.rating}/5
                </p>
              </div>
              <Badge className="ml-auto" variant={item.active ? "default" : "secondary"}>
                {item.active ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <blockquote className="mt-3 text-sm text-muted-foreground">“{item.quote}”</blockquote>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditing(item.id);
                  setForm({
                    name: item.name,
                    quote: item.quote,
                    source: item.source,
                    rating: item.rating,
                    active: item.active,
                  });
                }}
              >
                <Pencil className="size-4" />
                Editar
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={index === 0}
                onClick={() => move(index, -1)}
              >
                <ArrowUp className="size-4" />
                Subir
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={index === items.length - 1}
                onClick={() => move(index, 1)}
              >
                <ArrowDown className="size-4" />
                Descer
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  run.mutate(() =>
                    services.siteContent.updateTestimonial(item.id, { active: !item.active }),
                  )
                }
              >
                {item.active ? "Desativar" : "Ativar"}
              </Button>
              <label className="inline-flex h-8 cursor-pointer items-center rounded-md border px-3 text-xs font-medium">
                Foto
                <input
                  className="sr-only"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => avatar(item, e.target.files?.[0])}
                />
              </label>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (window.confirm("Excluir este depoimento permanentemente?"))
                    run.mutate(() => services.siteContent.deleteTestimonial(item.id));
                }}
              >
                <Trash2 className="size-4" />
                Excluir
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
