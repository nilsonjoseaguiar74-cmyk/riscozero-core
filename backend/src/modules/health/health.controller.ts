import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../../common/decorators/public.decorator";
import { PrismaService } from "../../database/prisma.service";

@ApiTags("health") @Public() @Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}
  @Get("live") live() { return { status: "ok", timestamp: new Date().toISOString() }; }
  @Get("ready") async ready() { try { await this.prisma.$queryRaw`SELECT 1`; return { status: "ready", database: "ok" }; }
    catch { throw new ServiceUnavailableException({ status: "not_ready", database: "unavailable" }); } }
}
