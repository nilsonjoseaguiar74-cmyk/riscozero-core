import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { services, apiErrorMessage } from "@/services";
import { captureTracking, trackEvent } from "@/services/tracking";
import { SITE, CITIES, whatsappLink } from "@/config/site";
import { maskPhone, normalizePlate } from "@/lib/format";
import type { ContactPreference, VehicleType } from "@/types";

const schema = z.object({
  name: z.string().trim().min(5, "Informe seu nome completo.").max(100, "Nome muito longo."),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\(\d{2}\)\s9?\d{4}-\d{4}$/, "Informe um WhatsApp válido com DDD."),
  plate: z
    .string()
    .trim()
    .min(7, "Informe a placa com 7 caracteres.")
    .max(7, "Informe a placa com 7 caracteres."),
  city: z.string().min(1, "Selecione a cidade."),
  vehicleType: z.string().optional(),
  vehicleYear: z
    .string()
    .trim()
    .regex(/^((19|20)\d{2})?$/, "Informe o ano aproximado com 4 dígitos.")
    .optional(),
  bestTime: z.string().optional(),
  contactPreference: z.string().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "É necessário autorizar o contato para prosseguir." }),
  }),
  website: z.string().max(0).optional(),
});

type FormValues = z.input<typeof schema>;

const DRAFT_KEY = "rz.lead.draft";

export function LeadForm({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [startedTracked, setStartedTracked] = useState(false);
  const submittedRef = useRef(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      whatsapp: "",
      plate: "",
      city: "",
      vehicleType: "",
      vehicleYear: "",
      bestTime: "",
      contactPreference: "",
      consent: false as unknown as true,
      website: "",
    },
  });

  useEffect(() => {
    trackEvent("form_view", { formulario: compact ? "cotacao_hero" : "cotacao" });
    try {
      const raw = window.sessionStorage.getItem(DRAFT_KEY);
      if (raw) form.reset({ ...form.getValues(), ...(JSON.parse(raw) as Partial<FormValues>) });
    } catch {
      /* rascunho indisponível */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = form.watch((values) => {
      try {
        window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...values, consent: false }));
      } catch {
        /* rascunho indisponível */
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      trackEvent("form_submit", { formulario: compact ? "cotacao_hero" : "cotacao" });
      return services.leads.create({
        name: values.name,
        whatsapp: values.whatsapp,
        plate: normalizePlate(values.plate),
        city: values.city,
        ...(compact
          ? {}
          : {
              vehicleType: (values.vehicleType || undefined) as VehicleType | undefined,
              vehicleYear: values.vehicleYear || undefined,
              bestTime: values.bestTime || undefined,
              contactPreference: (values.contactPreference || undefined) as
                | ContactPreference
                | undefined,
            }),
        consent: true,
        tracking: {
          ...captureTracking(),
          conversionCta: compact ? "hero_form" : "pagina_cotacao",
        },
      });
    },
    onSuccess: () => {
      trackEvent("form_success", { formulario: compact ? "cotacao_hero" : "cotacao" });
      try {
        window.sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        /* rascunho indisponível */
      }
      void navigate({ to: "/obrigado" });
    },
    onError: () => {
      submittedRef.current = false;
      trackEvent("form_error", { formulario: compact ? "cotacao_hero" : "cotacao" });
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    if (values.website) return; // honeypot
    if (submittedRef.current || mutation.isPending) return;
    submittedRef.current = true;
    mutation.mutate(values);
  });

  const onFirstInteraction = () => {
    if (startedTracked) return;
    setStartedTracked(true);
    trackEvent("form_start", { formulario: compact ? "cotacao_hero" : "cotacao" });
  };

  const errors = form.formState.errors;

  return (
    <form
      onSubmit={onSubmit}
      onFocusCapture={onFirstInteraction}
      noValidate
      className="card-elevated space-y-4 p-5 text-foreground sm:p-6"
      aria-label="Formulário de cotação"
    >
      <div>
        <h2 className="text-lg font-[650] text-foreground">Receba as opções para o seu veículo</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Preencha os dados essenciais e nossa equipe entrará em contato.
        </p>
      </div>

      {mutation.isError ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{apiErrorMessage(mutation.error)}</AlertDescription>
        </Alert>
      ) : null}

      <div className={compact ? "grid gap-3.5" : "grid gap-4 sm:grid-cols-2"}>
        <Field id="name" label="Nome completo" error={errors.name?.message}>
          <Input id="name" autoComplete="name" {...form.register("name")} />
        </Field>

        <Field id="whatsapp" label="WhatsApp" error={errors.whatsapp?.message}>
          <Input
            id="whatsapp"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(48) 90000-0000"
            {...form.register("whatsapp", {
              onChange: (e) => form.setValue("whatsapp", maskPhone(e.target.value)),
            })}
          />
        </Field>

        <Field id="plate" label="Placa do veículo" error={errors.plate?.message}>
          <Input
            id="plate"
            placeholder="ABC1D23"
            className="uppercase"
            {...form.register("plate", {
              onChange: (e) => form.setValue("plate", normalizePlate(e.target.value)),
            })}
          />
        </Field>

        <Field id="city" label="Cidade" error={errors.city?.message}>
          <Select value={form.watch("city")} onValueChange={(v) => form.setValue("city", v)}>
            <SelectTrigger id="city">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
              <SelectItem value="Outra">Outra cidade</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {!compact ? (
          <>
            <Field id="vehicleType" label="Tipo de veículo (opcional)">
              <Select
                value={form.watch("vehicleType") ?? ""}
                onValueChange={(v) => form.setValue("vehicleType", v)}
              >
                <SelectTrigger id="vehicleType">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carro">Carro</SelectItem>
                  <SelectItem value="moto">Moto</SelectItem>
                  <SelectItem value="caminhonete">Caminhonete</SelectItem>
                  <SelectItem value="utilitario">Utilitário</SelectItem>
                  <SelectItem value="caminhao">Caminhão</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field
              id="vehicleYear"
              label="Ano aproximado (opcional)"
              error={errors.vehicleYear?.message}
            >
              <Input
                id="vehicleYear"
                inputMode="numeric"
                placeholder="2018"
                {...form.register("vehicleYear")}
              />
            </Field>

            <Field id="bestTime" label="Melhor horário (opcional)">
              <Select
                value={form.watch("bestTime") ?? ""}
                onValueChange={(v) => form.setValue("bestTime", v)}
              >
                <SelectTrigger id="bestTime">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manhã">Manhã</SelectItem>
                  <SelectItem value="Tarde">Tarde</SelectItem>
                  <SelectItem value="Noite">Noite</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field id="contactPreference" label="Preferência de atendimento (opcional)">
              <Select
                value={form.watch("contactPreference") ?? ""}
                onValueChange={(v) => form.setValue("contactPreference", v)}
              >
                <SelectTrigger id="contactPreference">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="ligacao">Ligação</SelectItem>
                  <SelectItem value="qualquer">Qualquer opção</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </>
        ) : null}
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Não preencher</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...form.register("website")} />
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="consent"
          checked={Boolean(form.watch("consent"))}
          onCheckedChange={(checked) =>
            form.setValue("consent", (checked === true) as unknown as true, {
              shouldValidate: true,
            })
          }
          aria-describedby="consent-help"
          className="mt-0.5"
        />
        <div>
          <Label htmlFor="consent" className="text-sm font-normal leading-relaxed">
            Autorizo o contato da equipe da {SITE.name} pelos dados informados.
          </Label>
          <p id="consent-help" className="mt-1 text-xs text-muted-foreground">
            Consentimento registrado na versão {SITE.consentVersion}.
          </p>
          {errors.consent?.message ? (
            <p role="alert" className="mt-1 text-xs font-medium text-destructive">
              {errors.consent.message}
            </p>
          ) : null}
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Enviando solicitação
          </>
        ) : (
          "Solicitar cotação"
        )}
      </Button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Cotação sem compromisso. Atendimento para São José e Grande Florianópolis.
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Prefere conversar agora?{" "}
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent("whatsapp_click", { origem: "formulario" })}
          className="font-medium text-foreground underline"
        >
          Falar com a equipe pelo WhatsApp
        </a>
        .
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
