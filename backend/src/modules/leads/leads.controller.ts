import { Body, Controller, Get, Headers, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { RequirePermissions } from "../../common/decorators/permissions.decorator";
import type { AuthPrincipal } from "../../common/auth.types";
import { PrismaService } from "../../database/prisma.service";
import { AssignLeadDto, ChangeStageDto, CreateActivityDto, CreateLeadDto, LeadFiltersDto, UpdateLeadDto } from "./leads.dto";
import { LeadsService } from "./leads.service";

@ApiTags("public") @Controller("public/leads")
export class PublicLeadsController {
  constructor(private readonly leads: LeadsService, private readonly prisma: PrismaService) {}
  @Public() @Throttle({ default: { limit: 10, ttl: 60_000 } }) @Post()
  async create(@Body() dto: CreateLeadDto, @Headers("idempotency-key") key?: string) {
    const association = await this.prisma.association.findFirst({ orderBy: { createdAt: "asc" } });
    if (!association) throw new Error("Associação não configurada.");
    return this.leads.createPublic(association.id, dto, key?.slice(0, 120));
  }
}

@ApiTags("leads") @ApiBearerAuth() @Controller("leads") @RequirePermissions("crm.view")
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}
  @Get() list(@CurrentUser() user: AuthPrincipal, @Query() filters: LeadFiltersDto) { return this.leads.list(user, filters); }
  @Get(":id") get(@CurrentUser() user: AuthPrincipal, @Param("id") id: string) { return this.leads.get(user, id); }
  @Patch(":id") @RequirePermissions("crm.edit") update(@CurrentUser() user: AuthPrincipal, @Param("id") id: string, @Body() dto: UpdateLeadDto) { return this.leads.update(user, id, dto); }
  @Patch(":id/assign") @RequirePermissions("crm.edit") assign(@CurrentUser() user: AuthPrincipal, @Param("id") id: string, @Body() dto: AssignLeadDto) { return this.leads.assign(user, id, dto); }
  @Patch(":id/stage") @RequirePermissions("crm.edit") stage(@CurrentUser() user: AuthPrincipal, @Param("id") id: string, @Body() dto: ChangeStageDto) { return this.leads.changeStage(user, id, dto); }
  @Post(":id/activities") @RequirePermissions("crm.edit") activity(@CurrentUser() user: AuthPrincipal, @Param("id") id: string, @Body() dto: CreateActivityDto) { return this.leads.addActivity(user, id, dto); }
}
