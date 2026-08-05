import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  record(input: {
    associationId: string; userId?: string; userName: string; action: string;
    resource: string; resourceId?: string; result?: string; ip?: string; device?: string;
    metadata?: Record<string, string | number | boolean | null>;
  }): Promise<unknown> {
    const ip = input.ip ?? "indisponível";
    const maskedIp = ip.includes(".") ? `${ip.split(".").slice(0, 2).join(".")}.*.*` : "mascarado";
    return this.prisma.auditEntry.create({ data: {
      associationId: input.associationId, userId: input.userId, userName: input.userName,
      action: input.action, resource: input.resource, resourceId: input.resourceId,
      result: input.result ?? "sucesso", maskedIp, device: (input.device ?? "desconhecido").slice(0, 160),
      metadata: input.metadata,
    }});
  }

  list(associationId: string, search?: string) {
    return this.prisma.auditEntry.findMany({
      where: { associationId, ...(search ? { OR: [
        { action: { contains: search, mode: "insensitive" } },
        { resource: { contains: search, mode: "insensitive" } },
        { userName: { contains: search, mode: "insensitive" } },
      ] } : {}) }, orderBy: { createdAt: "desc" }, take: 200,
    });
  }
}
