import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequirePermissions } from "../../common/decorators/permissions.decorator";
import { Public } from "../../common/decorators/public.decorator";
import type { AuthPrincipal } from "../../common/auth.types";
import type { UploadedImage } from "../storage/storage.service";
import {
  CreateMediaDto,
  CreateTestimonialDto,
  ReorderDto,
  UpdateMediaDto,
  UpdateTestimonialDto,
  UpdateUnitSectionDto,
} from "./site-content.dto";
import { SiteContentService } from "./site-content.service";

@ApiTags("site-content")
@Controller("site-content")
export class SiteContentController {
  constructor(private readonly service: SiteContentService) {}

  @Public() @Get("unit") getUnit() {
    return this.service.getUnitSection();
  }
  @ApiBearerAuth()
  @RequirePermissions("settings.manage")
  @Patch("unit")
  updateUnit(@Body() dto: UpdateUnitSectionDto, @CurrentUser() user: AuthPrincipal) {
    return this.service.updateUnitSection(dto, user);
  }

  @Public() @Get("testimonials") getTestimonials() {
    return this.service.getTestimonials();
  }
  @ApiBearerAuth()
  @RequirePermissions("settings.manage")
  @Post("testimonials")
  createTestimonial(@Body() dto: CreateTestimonialDto, @CurrentUser() user: AuthPrincipal) {
    return this.service.createTestimonial(dto, user);
  }
  @ApiBearerAuth()
  @RequirePermissions("settings.manage")
  @Patch("testimonials/order")
  reorderTestimonials(@Body() dto: ReorderDto, @CurrentUser() user: AuthPrincipal) {
    return this.service.reorderTestimonials(dto, user);
  }
  @ApiBearerAuth()
  @RequirePermissions("settings.manage")
  @Patch("testimonials/:id")
  updateTestimonial(
    @Param("id") id: string,
    @Body() dto: UpdateTestimonialDto,
    @CurrentUser() user: AuthPrincipal,
  ) {
    return this.service.updateTestimonial(id, dto, user);
  }
  @ApiBearerAuth()
  @RequirePermissions("settings.manage")
  @Delete("testimonials/:id")
  @HttpCode(204)
  async deleteTestimonial(@Param("id") id: string, @CurrentUser() user: AuthPrincipal) {
    await this.service.deleteTestimonial(id, user);
  }
  @ApiBearerAuth()
  @RequirePermissions("settings.manage")
  @ApiConsumes("multipart/form-data")
  @Post("testimonials/:id/avatar")
  @UseInterceptors(FileInterceptor("file", { limits: { files: 1, fileSize: 2 * 1024 * 1024 } }))
  setAvatar(
    @Param("id") id: string,
    @UploadedFile() file: UploadedImage | undefined,
    @CurrentUser() user: AuthPrincipal,
  ) {
    if (!file) throw new BadRequestException("Arquivo de imagem obrigatório.");
    return this.service.setAvatar(id, file, user);
  }

  @ApiBearerAuth()
  @RequirePermissions("settings.manage")
  @ApiConsumes("multipart/form-data")
  @Post("media")
  @UseInterceptors(FileInterceptor("file", { limits: { files: 1, fileSize: 5 * 1024 * 1024 } }))
  createMedia(
    @Body() dto: CreateMediaDto,
    @UploadedFile() file: UploadedImage | undefined,
    @CurrentUser() user: AuthPrincipal,
  ) {
    if (!file) throw new BadRequestException("Arquivo de imagem obrigatório.");
    return this.service.createMedia(dto, file, user);
  }
  @ApiBearerAuth()
  @RequirePermissions("settings.manage")
  @Patch("media/order")
  reorderMedia(@Body() dto: ReorderDto, @CurrentUser() user: AuthPrincipal) {
    return this.service.reorderMedia(dto, user);
  }
  @ApiBearerAuth()
  @RequirePermissions("settings.manage")
  @Patch("media/:id/primary")
  setPrimary(@Param("id") id: string, @CurrentUser() user: AuthPrincipal) {
    return this.service.setPrimaryMedia(id, user);
  }
  @ApiBearerAuth()
  @RequirePermissions("settings.manage")
  @Patch("media/:id")
  updateMedia(
    @Param("id") id: string,
    @Body() dto: UpdateMediaDto,
    @CurrentUser() user: AuthPrincipal,
  ) {
    return this.service.updateMedia(id, dto, user);
  }
  @ApiBearerAuth()
  @RequirePermissions("settings.manage")
  @Delete("media/:id")
  @HttpCode(204)
  async deleteMedia(@Param("id") id: string, @CurrentUser() user: AuthPrincipal) {
    await this.service.deleteMedia(id, user);
  }
}
