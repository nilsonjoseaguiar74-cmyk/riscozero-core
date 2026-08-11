import type { CreateLeadRequest, TrackingContext } from "@/types";

const NAMES = [
  "Mariana Souza",
  "Carlos Henrique Martins",
  "Fernanda Lima",
  "João Pedro Almeida",
  "Camila Rodrigues",
  "Rafael Oliveira",
  "Juliana Cardoso",
  "Bruno Ferreira",
  "Amanda Martins",
  "Lucas Vieira",
] as const;

const CITIES = ["São José", "Florianópolis", "Palhoça", "Biguaçu"] as const;
const CAMPAIGNS = [
  { source: "google", medium: "cpc", campaign: "demo-google-sao-jose", label: "Google Ads" },
  {
    source: "meta",
    medium: "paid-social",
    campaign: "demo-meta-grande-floripa",
    label: "Meta Ads",
  },
  { source: "direct", medium: "none", campaign: "demo-cotacao-florianopolis", label: "Direto" },
  { source: "indicacao", medium: "referral", campaign: "demo-protecao-sc", label: "Indicação" },
] as const;

const DEVICES: NonNullable<TrackingContext["deviceType"]>[] = ["mobile", "desktop", "tablet"];

export interface SimulatedLeadDraft {
  payload: CreateLeadRequest;
  sourceLabel: string;
}

const pick = <T>(values: readonly T[]): T => values[Math.floor(Math.random() * values.length)]!;

const demoPhone = (): string => {
  const suffix = String((Date.now() + Math.floor(Math.random() * 10_000)) % 100_000_000).padStart(
    8,
    "0",
  );
  return `(00) 9${suffix.slice(0, 4)}-${suffix.slice(4)}`;
};

const demoPlate = (): string => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const letter = () => letters[Math.floor(Math.random() * letters.length)]!;
  const digit = () => String(Math.floor(Math.random() * 10));
  return `${letter()}${letter()}${letter()}${digit()}${letter()}${digit()}${digit()}`;
};

export const createSimulatedLead = (): SimulatedLeadDraft => {
  const campaign = pick(CAMPAIGNS);
  return {
    sourceLabel: campaign.label,
    payload: {
      name: pick(NAMES),
      whatsapp: demoPhone(),
      plate: demoPlate(),
      city: pick(CITIES),
      vehicleType: pick(["carro", "moto"] as const),
      vehicleYear: String(2016 + Math.floor(Math.random() * 10)),
      contactPreference: "whatsapp",
      consent: true,
      tracking: {
        utmSource: campaign.source,
        utmMedium: campaign.medium,
        utmCampaign: campaign.campaign,
        landingPage: "/solicitar-cotacao",
        conversionPage: "/solicitar-cotacao",
        conversionCta: "simulator_demo",
        deviceType: pick(DEVICES),
        consentVersion: "demo-v1.0",
      },
    },
  };
};

export const isSimulatedLead = (lead: {
  campaign?: string;
  tracking: { conversionCta?: string; utmCampaign?: string };
}): boolean =>
  lead.tracking.conversionCta === "simulator_demo" ||
  lead.tracking.utmCampaign?.startsWith("demo-") === true ||
  lead.campaign?.startsWith("demo-") === true;
