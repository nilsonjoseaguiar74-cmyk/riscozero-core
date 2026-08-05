import type { AnalyticsLead } from "./dashboard";
import { buildDashboardOverview } from "./dashboard";

const date = new Date("2026-08-05T12:00:00.000Z");
const makeLead = (id: string, stage: AnalyticsLead["stage"], source: string): AnalyticsLead => ({
  id, associationId: "association-1", name: `Lead ${id}`, whatsapp: "48991234567", plate: "ABC1D23",
  city: "São José", vehicleType: "carro", vehicleYear: "2020", bestTime: null, contactPreference: null,
  stage, priority: "media", ownerId: null, source, campaign: null, tags: [], lossReason: null, notes: null,
  idempotencyKey: null, createdAt: date, updatedAt: date, stageChangedAt: date, version: 1,
  owner: null, tracking: null, stageHistory: [],
});

describe("dashboard comercial", () => {
  it("calcula totais, conversão, origem e funil a partir dos leads", () => {
    const result = buildDashboardOverview([
      makeLead("1", "novo_contato", "Google"),
      makeLead("2", "adesao_concluida", "Indicação"),
    ]);
    expect(result.metrics.find((metric) => metric.key === "total")?.value).toBe(2);
    expect(result.metrics.find((metric) => metric.key === "conversion")?.value).toBe(50);
    expect(result.bySource).toEqual(expect.arrayContaining([{ label: "Google", value: 1 }]));
    expect(result.funnel.find((item) => item.label === "adesao_concluida")?.value).toBe(1);
  });
});
