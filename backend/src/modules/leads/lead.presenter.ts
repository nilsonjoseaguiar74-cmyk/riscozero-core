import type { Prisma } from "@prisma/client";

export const leadPresentationInclude = { owner: true, consent: true, tracking: true } satisfies Prisma.LeadInclude;
export type LeadWithPresentation = Prisma.LeadGetPayload<{ include: typeof leadPresentationInclude }>;

export function presentLead(lead: LeadWithPresentation) {
  const tracking = lead.tracking;
  return {
    id: lead.id, name: lead.name, whatsapp: lead.whatsapp, plate: lead.plate, city: lead.city,
    vehicleType: lead.vehicleType ?? "carro", vehicleYear: lead.vehicleYear ?? "", bestTime: lead.bestTime ?? "",
    contactPreference: lead.contactPreference ?? "qualquer", consent: lead.consent?.granted ?? true,
    stage: lead.stage, priority: lead.priority, ownerId: lead.ownerId, ...(lead.owner ? { ownerName: lead.owner.name } : {}),
    source: lead.source, ...(lead.campaign ? { campaign: lead.campaign } : {}), tags: lead.tags,
    ...(lead.lossReason ? { lossReason: lead.lossReason } : {}), ...(lead.notes ? { notes: lead.notes } : {}),
    tracking: {
      ...(tracking?.utmSource ? { utmSource: tracking.utmSource } : {}), ...(tracking?.utmMedium ? { utmMedium: tracking.utmMedium } : {}),
      ...(tracking?.utmCampaign ? { utmCampaign: tracking.utmCampaign } : {}), ...(tracking?.utmTerm ? { utmTerm: tracking.utmTerm } : {}),
      ...(tracking?.utmContent ? { utmContent: tracking.utmContent } : {}), ...(tracking?.referrer ? { referrer: tracking.referrer } : {}),
      ...(tracking?.landingPage ? { landingPage: tracking.landingPage } : {}), ...(tracking?.gclid ? { gclid: tracking.gclid } : {}),
      ...(tracking?.gbraid ? { gbraid: tracking.gbraid } : {}), ...(tracking?.wbraid ? { wbraid: tracking.wbraid } : {}),
      ...(tracking?.fbclid ? { fbclid: tracking.fbclid } : {}), ...(tracking?.deviceType ? { deviceType: tracking.deviceType } : {}),
      ...(tracking?.browser ? { browser: tracking.browser } : {}), ...(tracking?.operatingSystem ? { operatingSystem: tracking.operatingSystem } : {}),
      ...(tracking?.firstVisitAt ? { firstVisitAt: tracking.firstVisitAt.toISOString() } : {}),
      ...(tracking?.conversionPage ? { conversionPage: tracking.conversionPage } : {}),
      ...(tracking?.conversionCta ? { conversionCta: tracking.conversionCta } : {}),
      ...(lead.consent?.version ? { consentVersion: lead.consent.version } : {}),
    }, createdAt: lead.createdAt.toISOString(), updatedAt: lead.updatedAt.toISOString(), stageChangedAt: lead.stageChangedAt.toISOString(),
  };
}
