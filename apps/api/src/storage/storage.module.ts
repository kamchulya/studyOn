import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { STORAGE_PROVIDER } from "./storage-provider.interface";
import { LocalDiskStorageProvider } from "./providers/local-disk-storage.provider";
import { S3StorageProvider } from "./providers/s3-storage.provider";

@Module({
  imports: [ConfigModule],
  providers: [
    LocalDiskStorageProvider,
    S3StorageProvider,
    {
      provide: STORAGE_PROVIDER,
      inject: [ConfigService, LocalDiskStorageProvider, S3StorageProvider],
      useFactory: (config: ConfigService, local: LocalDiskStorageProvider, s3: S3StorageProvider) =>
        config.get<string>("STORAGE_PROVIDER") === "r2" ? s3 : local,
    },
  ],
  exports: [STORAGE_PROVIDER],
})
export class StorageModule {}
