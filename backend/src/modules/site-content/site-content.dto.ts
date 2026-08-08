import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";

export class UpdateUnitSectionDto {
  @IsString() @MinLength(3) @MaxLength(160) title!: string;
  @IsString() @MinLength(10) @MaxLength(600) description!: string;
  @IsString() @MinLength(5) @MaxLength(240) address!: string;
}

export class CreateTestimonialDto {
  @IsString() @MinLength(2) @MaxLength(100) name!: string;
  @IsString() @MinLength(5) @MaxLength(1000) quote!: string;
  @IsString() @MaxLength(80) source = "Google";
  @Type(() => Number) @IsInt() @Min(1) @Max(5) rating!: number;
  @Type(() => Number) @IsInt() @Min(0) order!: number;
  @IsBoolean() active!: boolean;
}

export class UpdateTestimonialDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(100) name?: string;
  @IsOptional() @IsString() @MinLength(5) @MaxLength(1000) quote?: string;
  @IsOptional() @IsString() @MaxLength(80) source?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(5) rating?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) order?: number;
  @IsOptional() @IsBoolean() active?: boolean;
}

export class CreateMediaDto {
  @IsOptional() @IsString() @MaxLength(120) title?: string;
  @IsString() @MinLength(3) @MaxLength(240) alt!: string;
  @IsIn(["primary", "secondary", "complementary"]) position!: string;
  @Type(() => Number) @IsInt() @Min(0) order!: number;
}

export class UpdateMediaDto {
  @IsOptional() @IsString() @MaxLength(120) title?: string;
  @IsOptional() @IsString() @MinLength(3) @MaxLength(240) alt?: string;
  @IsOptional() @IsIn(["primary", "secondary", "complementary"]) position?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) order?: number;
  @IsOptional() @IsBoolean() active?: boolean;
}

export class OrderItemDto {
  @IsUUID() id!: string;
  @Type(() => Number) @IsInt() @Min(0) order!: number;
}

export class ReorderDto {
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
