import { SettingsService } from "./settings.service";

describe("SettingsService", () => {
  const prisma = {
    associationSettings: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  };
  const audit = { record: jest.fn() };
  const service = new SettingsService(prisma as never, audit as never);
  const user = {
    sub: "user-1",
    associationId: "association-1",
    role: "gestor" as const,
    sid: "session-1",
  };

  beforeEach(() => jest.clearAllMocks());

  it("mantém o modo demonstração habilitado por padrão", async () => {
    prisma.associationSettings.findUnique.mockResolvedValue(null);
    await expect(service.getDemoMode(user.associationId)).resolves.toEqual({ enabled: true });
  });

  it("persiste a alteração no escopo da associação e registra auditoria", async () => {
    prisma.associationSettings.upsert.mockResolvedValue({ demoModeEnabled: false });

    await expect(service.updateDemoMode(user, false)).resolves.toEqual({ enabled: false });
    expect(prisma.associationSettings.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { associationId: user.associationId } }),
    );
    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({ associationId: user.associationId, metadata: { enabled: false } }),
    );
  });
});
