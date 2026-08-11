import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { AuthPrincipal } from "../../common/auth.types";

@Injectable()
export class SettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async getDemoMode(associationId: string) {
    const settings = await this.prisma.associationSettings.findUnique({
      where: { associationId },
      select: { demoModeEnabled: true },
    });
    return { enabled: settings?.demoModeEnabled ?? true };
  }

  async updateDemoMode(user: AuthPrincipal, enabled: boolean) {
    const settings = await this.prisma.associationSettings.upsert({
      where: { associationId: user.associationId },
      update: { demoModeEnabled: enabled },
      create: { associationId: user.associationId, demoModeEnabled: enabled },
      select: { demoModeEnabled: true },
    });
    await this.audit.record({
      associationId: user.associationId,
      userId: user.sub,
      userName: user.sub,
      action: "settings.demo_mode.update",
      resource: "association_settings",
      metadata: { enabled },
    });
    return { enabled: settings.demoModeEnabled };
  }
}
