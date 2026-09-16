import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { StorageProvider, UploadFileParams, UploadFileResult } from "../storage-provider.interface";

const UPLOADS_DIR = join(__dirname, "..", "..", "..", "uploads");

/**
 * Хранилище по умолчанию для локальной разработки — пишет на диск и отдаёт статикой
 * через ServeStaticModule (/uploads/*). На Railway контейнер эфемерный: файлы пропадут
 * при передеплое/рестарте — для продакшена нужен STORAGE_PROVIDER=r2.
 */
@Injectable()
export class LocalDiskStorageProvider implements StorageProvider {
  constructor(private readonly config: ConfigService) {}

  async upload({ buffer, filename }: UploadFileParams): Promise<UploadFileResult> {
    await mkdir(UPLOADS_DIR, { recursive: true });
    const safeName = `${randomUUID()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    await writeFile(join(UPLOADS_DIR, safeName), buffer);

    const base = this.config.get<string>("API_PUBLIC_URL") ?? `http://localhost:${this.config.get<string>("API_PORT") ?? "4000"}`;
    return { url: `${base}/uploads/${safeName}` };
  }
}
