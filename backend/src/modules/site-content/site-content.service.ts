import { Injectable, NotFoundException } from "@nestjs/common";
import type { AuthPrincipal } from "../../common/auth.types";
import { PrismaService } from "../../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { StorageService, type UploadedImage } from "../storage/storage.service";
import type {
  CreateMediaDto,
  CreateTestimonialDto,
  ReorderDto,
  UpdateMediaDto,
  UpdateTestimonialDto,
  UpdateUnitSectionDto,
} from "./site-content.dto";

@Injectable()
export class SiteContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly storage: StorageService,
  ) {}

  private async actor(principal: AuthPrincipal) {
    const user = await this.prisma.user.findUnique({
      where: { id: principal.sub },
      select: { name: true },
    });
    return user?.name ?? "Usuário autenticado";
  }

  private record(
    principal: AuthPrincipal,
    action: string,
    resource: string,
    resourceId?: string,
    metadata?: Record<string, string | number | boolean | null>,
  ) {
    return this.actor(principal).then((userName) =>
      this.audit.record({
        associationId: principal.associationId,
        userId: principal.sub,
        userName,
        action,
        resource,
        resourceId,
        metadata,
      }),
    );
  }

  async getUnitSection() {
    const section = await this.prisma.siteSection.findUnique({ where: { id: "unit" } });
    if (!section) throw new NotFoundException("Conteúdo da unidade não configurado.");
    const media = await this.prisma.siteMedia.findMany({
      where: { section: "unit" },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return {
      title: section.title,
      description: section.description,
      address: section.address,
      media,
    };
  }

  async updateUnitSection(dto: UpdateUnitSectionDto, principal: AuthPrincipal) {
    const section = await this.prisma.siteSection.upsert({
      where: { id: "unit" },
      update: dto,
      create: { id: "unit", ...dto },
    });
    await this.record(principal, "SITE_SECTION_UPDATED", "site_section", section.id);
    return this.getUnitSection();
  }

  getTestimonials() {
    return this.prisma.siteTestimonial.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  }

  async createTestimonial(dto: CreateTestimonialDto, principal: AuthPrincipal) {
    const item = await this.prisma.siteTestimonial.create({ data: dto });
    await this.record(principal, "SITE_TESTIMONIAL_CREATED", "site_testimonial", item.id);
    return item;
  }

  async updateTestimonial(id: string, dto: UpdateTestimonialDto, principal: AuthPrincipal) {
    await this.requireTestimonial(id);
    const item = await this.prisma.siteTestimonial.update({ where: { id }, data: dto });
    await this.record(principal, "SITE_TESTIMONIAL_UPDATED", "site_testimonial", id);
    return item;
  }

  async deleteTestimonial(id: string, principal: AuthPrincipal) {
    const item = await this.requireTestimonial(id);
    await this.prisma.siteTestimonial.delete({ where: { id } });
    if (item.avatarStorageKey) await this.storage.delete(item.avatarStorageKey);
    await this.record(principal, "SITE_TESTIMONIAL_DELETED", "site_testimonial", id);
  }

  async reorderTestimonials(dto: ReorderDto, principal: AuthPrincipal) {
    await this.prisma.$transaction(
      dto.items.map(({ id, order }) =>
        this.prisma.siteTestimonial.update({ where: { id }, data: { order } }),
      ),
    );
    await this.record(principal, "SITE_TESTIMONIAL_REORDERED", "site_testimonial", undefined, {
      count: dto.items.length,
    });
    return this.getTestimonials();
  }

  async setAvatar(id: string, file: UploadedImage, principal: AuthPrincipal) {
    const current = await this.requireTestimonial(id);
    const stored = await this.storage.upload(file, "testimonial", 2 * 1024 * 1024);
    const item = await this.prisma.siteTestimonial.update({
      where: { id },
      data: { avatarUrl: stored.publicUrl, avatarStorageKey: stored.storageKey },
    });
    if (current.avatarStorageKey) await this.storage.delete(current.avatarStorageKey);
    await this.record(principal, "SITE_TESTIMONIAL_UPDATED", "site_testimonial", id, {
      avatarChanged: true,
    });
    return item;
  }

  async createMedia(dto: CreateMediaDto, file: UploadedImage, principal: AuthPrincipal) {
    const stored = await this.storage.upload(file, "unit", 5 * 1024 * 1024);
    try {
      const item = await this.prisma.$transaction(async (tx) => {
        if (dto.position === "primary")
          await tx.siteMedia.updateMany({
            where: { section: "unit", position: "primary" },
            data: { position: "secondary" },
          });
        return tx.siteMedia.create({
          data: {
            section: "unit",
            ...dto,
            imageUrl: stored.publicUrl,
            storageKey: stored.storageKey,
          },
        });
      });
      await this.record(principal, "SITE_MEDIA_CREATED", "site_media", item.id);
      return item;
    } catch (error) {
      await this.storage.delete(stored.storageKey);
      throw error;
    }
  }

  async updateMedia(id: string, dto: UpdateMediaDto, principal: AuthPrincipal) {
    await this.requireMedia(id);
    const item = await this.prisma.$transaction(async (tx) => {
      if (dto.position === "primary")
        await tx.siteMedia.updateMany({
          where: { section: "unit", position: "primary", NOT: { id } },
          data: { position: "secondary" },
        });
      return tx.siteMedia.update({ where: { id }, data: dto });
    });
    await this.record(principal, "SITE_MEDIA_UPDATED", "site_media", id);
    return item;
  }

  async deleteMedia(id: string, principal: AuthPrincipal) {
    const item = await this.requireMedia(id);
    await this.prisma.siteMedia.delete({ where: { id } });
    await this.storage.delete(item.storageKey);
    await this.record(principal, "SITE_MEDIA_DELETED", "site_media", id);
  }

  async reorderMedia(dto: ReorderDto, principal: AuthPrincipal) {
    await this.prisma.$transaction(
      dto.items.map(({ id, order }) =>
        this.prisma.siteMedia.update({ where: { id }, data: { order } }),
      ),
    );
    await this.record(principal, "SITE_MEDIA_REORDERED", "site_media", undefined, {
      count: dto.items.length,
    });
    return (await this.getUnitSection()).media;
  }

  async setPrimaryMedia(id: string, principal: AuthPrincipal) {
    await this.requireMedia(id);
    const item = await this.prisma.$transaction(async (tx) => {
      await tx.siteMedia.updateMany({
        where: { section: "unit", position: "primary", NOT: { id } },
        data: { position: "secondary" },
      });
      return tx.siteMedia.update({ where: { id }, data: { position: "primary" } });
    });
    await this.record(principal, "SITE_MEDIA_PRIMARY_CHANGED", "site_media", id);
    return item;
  }

  private async requireMedia(id: string) {
    const item = await this.prisma.siteMedia.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Imagem não encontrada.");
    return item;
  }

  private async requireTestimonial(id: string) {
    const item = await this.prisma.siteTestimonial.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Depoimento não encontrado.");
    return item;
  }
}
