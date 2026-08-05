import { Type } from "class-transformer";
import { Equals, IsArray, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength, ValidateNested } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export const LEAD_STAGES = ["novo_contato", "contato_iniciado", "perfil_identificado", "opcoes_apresentadas", "proposta_adesao", "documentacao_pendente", "adesao_concluida", "nao_convertido"] as const;

export class TrackingDto {
  @IsOptional() @IsString() @MaxLength(200) utmSource?: string;
  @IsOptional() @IsString() @MaxLength(200) utmMedium?: string;
  @IsOptional() @IsString() @MaxLength(300) utmCampaign?: string;
  @IsOptional() @IsString() @MaxLength(300) utmTerm?: string;
  @IsOptional() @IsString() @MaxLength(300) utmContent?: string;
  @IsOptional() @IsString() @MaxLength(1000) referrer?: string;
  @IsOptional() @IsString() @MaxLength(500) landingPage?: string;
  @IsOptional() @IsString() @MaxLength(300) gclid?: string;
  @IsOptional() @IsString() @MaxLength(300) gbraid?: string;
  @IsOptional() @IsString() @MaxLength(300) wbraid?: string;
  @IsOptional() @IsString() @MaxLength(300) fbclid?: string;
  @IsOptional() @IsString() @MaxLength(40) deviceType?: string;
  @IsOptional() @IsString() @MaxLength(80) browser?: string;
  @IsOptional() @IsString() @MaxLength(80) operatingSystem?: string;
  @IsOptional() @IsString() firstVisitAt?: string;
  @IsOptional() @IsString() @MaxLength(500) conversionPage?: string;
  @IsOptional() @IsString() @MaxLength(100) conversionCta?: string;
  @IsOptional() @IsString() @MaxLength(40) consentVersion?: string;
}

export class CreateLeadDto {
  @ApiProperty() @IsString() @MinLength(5) @MaxLength(100) name!: string;
  @ApiProperty() @IsString() @MinLength(10) @MaxLength(24) whatsapp!: string;
  @ApiProperty() @IsString() @MinLength(7) @MaxLength(8) plate!: string;
  @ApiProperty() @IsString() @MinLength(2) @MaxLength(100) city!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() vehicleType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() vehicleYear?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bestTime?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contactPreference?: string;
  @ApiProperty() @Equals(true) consent!: boolean;
  @ApiPropertyOptional() @IsOptional() @ValidateNested() @Type(() => TrackingDto) tracking?: TrackingDto;
  @ApiPropertyOptional({ description: "Honeypot; deve permanecer vazio." }) @IsOptional() @IsString() @MaxLength(0) website?: string;
}

export class LeadFiltersDto {
  @IsOptional() @IsString() @MaxLength(120) search?: string;
  @IsOptional() @IsIn([...LEAD_STAGES, "todas"]) stage?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsString() campaign?: string;
  @IsOptional() @IsString() ownerId?: string;
  @IsOptional() @IsString() from?: string;
  @IsOptional() @IsString() to?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) pageSize = 20;
  @IsOptional() @IsIn(["createdAt", "updatedAt", "name"]) sortBy = "createdAt";
  @IsOptional() @IsIn(["asc", "desc"]) sortDir: "asc" | "desc" = "desc";
}

export class UpdateLeadDto {
  @IsOptional() @IsString() @MaxLength(100) name?: string;
  @IsOptional() @IsString() @MaxLength(24) whatsapp?: string;
  @IsOptional() @IsString() @MaxLength(8) plate?: string;
  @IsOptional() @IsString() @MaxLength(100) city?: string;
  @IsOptional() @IsIn(["baixa", "media", "alta"]) priority?: "baixa" | "media" | "alta";
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @IsOptional() @IsString() @MaxLength(2000) notes?: string;
  @IsOptional() @IsString() lossReason?: string;
}

export class AssignLeadDto { @IsString() userId!: string; }
export class ChangeStageDto { @IsIn(LEAD_STAGES) stage!: typeof LEAD_STAGES[number]; }
export class CreateActivityDto {
  @IsIn(["whatsapp", "ligacao", "mensagem", "observacao", "etapa", "responsavel", "sistema"]) type!: string;
  @IsString() @MinLength(2) @MaxLength(160) title!: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
}
export class CreateTaskDto {
  @IsString() leadId!: string;
  @IsString() @MinLength(2) @MaxLength(160) title!: string;
  @IsString() dueAt!: string;
}
