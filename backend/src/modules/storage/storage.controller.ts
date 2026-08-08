import { Controller, Get, Param, StreamableFile } from "@nestjs/common";
import { Public } from "../../common/decorators/public.decorator";
import { StorageService } from "./storage.service";

@Controller("uploads")
export class StorageController {
  constructor(private readonly storage: StorageService) {}
  @Public()
  @Get(":namespace/:filename")
  open(@Param("namespace") namespace: string, @Param("filename") filename: string): StreamableFile {
    return this.storage.open(`${namespace}/${filename}`);
  }
}
