export const SITE = {
  name: "Risco Zero",
  fullName: "Risco Zero Proteção Veicular",
  segment: "Proteção patrimonial mutualista, assistência e benefícios",
  whatsapp: "(48) 99122-7241",
  whatsappDigits: "5548991227241",
  address: "Av. Josué di Bernardi, 239 – Campinas, São José – SC, 88101-260",
  addressShort: "Campinas, São José – SC",
  mapsQuery: "Av. Josué di Bernardi, 239 - Campinas, São José - SC, 88101-260",
  serviceHours: "Horário de atendimento configurável na área administrativa.",
  consentVersion: "v1.0",
  disclaimer:
    "Disponibilidade, limites e condições conforme opção contratada e regulamento aplicável.",
} as const;

export const CITIES = ["São José", "Florianópolis", "Palhoça", "Biguaçu"] as const;
export const SAO_JOSE_LOCALITIES = ["Campinas", "Kobrasol", "Barreiros", "Forquilhinhas"] as const;
export const TRAVEL_CORRIDORS = ["BR-101", "Via Expressa"] as const;

export const SOURCES = ["Google Ads", "Meta Ads", "Orgânico", "Indicação", "WhatsApp"] as const;

export const whatsappLink = (message?: string) =>
  `https://wa.me/${SITE.whatsappDigits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

export const googleMapsLink = () =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`;

export const googleMapsEmbedLink = () =>
  `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapsQuery)}&output=embed`;

export const APP_CONFIG = {
  apiBaseUrl: (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "/api",
  useMockApi:
    ((import.meta.env["VITE_USE_MOCK_API"] as string | undefined) ?? "true").toLowerCase() !==
    "false",
  version: "1.0.0-demo",
  environment: import.meta.env.DEV ? "desenvolvimento" : "produção",
} as const;
