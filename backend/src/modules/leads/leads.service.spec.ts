import { ForbiddenException } from "@nestjs/common";
import { LeadsService } from "./leads.service";

describe("LeadsService - modo demonstração", () => {
  it("bloqueia apenas a criação identificada como simulador quando a flag está desligada", async () => {
    const prisma = {
      associationSettings: {
        findUnique: jest.fn().mockResolvedValue({ demoModeEnabled: false }),
      },
      lead: { findFirst: jest.fn() },
    };
    const service = new LeadsService(prisma as never, { record: jest.fn() } as never);

    await expect(
      service.createPublic("association-1", {
        name: "Pessoa Demonstração",
        whatsapp: "48991234567",
        plate: "ABC1D23",
        city: "São José",
        consent: true,
        tracking: { conversionCta: "simulator_demo", utmCampaign: "demo-apresentacao" },
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.lead.findFirst).not.toHaveBeenCalled();
  });
});
