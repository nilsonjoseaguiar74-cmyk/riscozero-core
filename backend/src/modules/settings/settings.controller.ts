import { Body, Controller, Get, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequirePermissions } from "../../common/decorators/permissions.decorator";
import type { AuthPrincipal } from "../../common/auth.types";
import { UpdateDemoModeDto } from "./settings.dto";
import { SettingsService } from "./settings.service";

@ApiTags("settings")
@ApiBearerAuth()
@Controller("settings/demo-mode")
@RequirePermissions("settings.manage")
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  get(@CurrentUser() user: AuthPrincipal) {
    return this.settings.getDemoMode(user.associationId);
  }

  @Patch()
  update(@CurrentUser() user: AuthPrincipal, @Body() dto: UpdateDemoModeDto) {
    return this.settings.updateDemoMode(user, dto.enabled);
  }
}
