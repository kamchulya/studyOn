import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { StorageProvider, UploadFileParams, UploadFileResult } from "../storage-provider.interface";

/**
 * S3-совместимое хранилище (Cloudflare R2). Обязательно для Railway — контейнер
 * эфемерный, локальный диск не переживёт передеплой. Включается STORAGE_PROVIDER=r2
 * + переменные R2_ENDPOINT/R2_ACCESS_KEY_ID/R2_SECRET_ACCESS_KEY/R2_BUCKET/R2_PUBLIC_BASE_URL.
 */
@Injectable()
export class S3StorageProvider implements StorageProvider {
  private readonly client: S3Client;

  constructor(private readonly config: ConfigService) {
    this.client = new S3Client({
      region: "auto",
      endpoint: this.config.get<string>("R2_ENDPOINT"),
      credentials: {
        accessKeyId: this.config.get<string>("R2_ACCESS_KEY_ID") ?? "",
        secretAccessKey: this.config.get<string>("R2_SECRET_ACCESS_KEY") ?? "",
      },
    });
  }

  async upload({ buffer, filename, contentType }: UploadFileParams): Promise<UploadFileResult> {
    const bucket = this.config.get<string>("R2_BUCKET");
    const publicBase = this.config.get<string>("R2_PUBLIC_BASE_URL");
    const key = `${randomUUID()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    await this.client.send(
      new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: contentType }),
    );

    return { url: `${publicBase}/${key}` };
  }
}
