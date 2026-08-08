import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  StreamableFile,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createReadStream } from "node:fs";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";

export interface UploadedImage {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

export interface StoredFile {
  storageKey: string;
  publicUrl: string;
}

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const hasValidSignature = (file: UploadedImage): boolean => {
  const bytes = file.buffer;
  if (file.mimetype === "image/jpeg")
    return bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (file.mimetype === "image/png")
    return (
      bytes.length > 8 &&
      bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    );
  if (file.mimetype === "image/webp")
    return (
      bytes.length > 12 &&
      bytes.toString("ascii", 0, 4) === "RIFF" &&
      bytes.toString("ascii", 8, 12) === "WEBP"
    );
  return false;
};

@Injectable()
export class StorageService {
  constructor(private readonly config: ConfigService) {}

  private settings() {
    const uploadDir = this.config.get<string>("UPLOAD_DIR")?.trim();
    const publicBaseUrl = this.config
      .get<string>("PUBLIC_UPLOAD_BASE_URL")
      ?.trim()
      .replace(/\/$/, "");
    if (!uploadDir || !publicBaseUrl) {
      throw new ServiceUnavailableException(
        "Storage não configurado. Defina UPLOAD_DIR e PUBLIC_UPLOAD_BASE_URL.",
      );
    }
    return { uploadDir: resolve(uploadDir), publicBaseUrl };
  }

  async upload(
    file: UploadedImage,
    namespace: "unit" | "testimonial",
    maxBytes: number,
  ): Promise<StoredFile> {
    const extension = EXTENSIONS[file.mimetype];
    if (!extension || file.size <= 0 || file.size > maxBytes || !hasValidSignature(file)) {
      throw new BadRequestException(
        "Imagem inválida. Envie JPEG, PNG ou WebP dentro do limite permitido.",
      );
    }
    const { uploadDir, publicBaseUrl } = this.settings();
    const storageKey = `${namespace}/${randomUUID()}${extension}`;
    const directory = join(uploadDir, namespace);
    await mkdir(directory, { recursive: true });
    await writeFile(join(uploadDir, storageKey), file.buffer, { flag: "wx" });
    return { storageKey, publicUrl: `${publicBaseUrl}/${storageKey}` };
  }

  async delete(storageKey: string): Promise<void> {
    if (!/^(unit|testimonial)\/[0-9a-f-]+\.(jpg|png|webp)$/.test(storageKey)) {
      throw new BadRequestException("Chave de storage inválida.");
    }
    const { uploadDir } = this.settings();
    await unlink(join(uploadDir, storageKey)).catch((error: unknown) => {
      if ((error as { code?: string }).code !== "ENOENT") throw error;
    });
  }

  open(storageKey: string): StreamableFile {
    if (
      !/^(unit|testimonial)\/[0-9a-f-]+\.(jpg|png|webp)$/.test(storageKey) ||
      extname(storageKey) === ""
    ) {
      throw new NotFoundException();
    }
    const { uploadDir } = this.settings();
    return new StreamableFile(createReadStream(join(uploadDir, storageKey)));
  }
}
