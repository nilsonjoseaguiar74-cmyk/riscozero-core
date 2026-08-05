import type { LeadWithPresentation } from "./lead.presenter";
import { presentLead } from "./lead.presenter";

const date = new Date("2026-08-05T12:00:00.000Z");
const lead: LeadWithPresentation = {
  id: "lead-1", associationId: "association-1", name: "Pessoa Teste", whatsapp: "48991234567",
  plate: "ABC1D23", city: "São José", vehicleType: "carro", vehicleYear: "2020", bestTime: null,
  contactPreference: "whatsapp", stage: "novo_contato", priority: "media", ownerId: null, source: "Google",
  campaign: "campanha", tags: [], lossReason: null, notes: null, idempotencyKey: "private-key",
  createdAt: date, updatedAt: date, stageChangedAt: date, version: 1, owner: null,
  consent: { id: "consent-1", associationId: "association-1", leadId: "lead-1", granted: true,
    version: "v1.0", grantedAt: date, createdAt: date, updatedAt: date },
  tracking: { id: "tracking-1", associationId: "association-1", leadId: "lead-1", utmSource: "Google",
    utmMedium: "cpc", utmCampaign: "campanha", utmTerm: null, utmContent: null, referrer: null,
    landingPage: "/", gclid: "click-id", gbraid: null, wbraid: null, fbclid: null, deviceType: "mobile",
    browser: null, operatingSystem: null, firstVisitAt: date, conversionPage: "/solicitar-cotacao",
    conversionCta: "form", createdAt: date, updatedAt: date },
};

describe("presentLead", () => {
  it("preserva o contrato público sem expor campos internos de idempotência", () => {
    const result = presentLead(lead);
    expect(result).toMatchObject({ id: "lead-1", consent: true, tracking: { utmSource: "Google" } });
    expect(result).not.toHaveProperty("idempotencyKey");
    expect(result).not.toHaveProperty("associationId");
  });
});
