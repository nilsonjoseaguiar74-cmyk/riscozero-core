import { IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateDemoModeDto {
  @ApiProperty() @IsBoolean() enabled!: boolean;
}
