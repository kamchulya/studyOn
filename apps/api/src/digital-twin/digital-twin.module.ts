import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DigitalTwinController } from "./digital-twin.controller";
import { DigitalTwinService } from "./digital-twin.service";
import { GenerationService } from "./generation.service";
import { StorageModule } from "../storage/storage.module";
import { IMAGE_EDIT_PROVIDER } from "./providers/image-edit-provider.interface";
import { MockImageEditProvider } from "./providers/mock-image-edit.provider";
import { FluxImageEditProvider } from "./providers/flux-image-edit.provider";
import { VIDEO_AVATAR_PROVIDER } from "./providers/video-avatar-provider.interface";
import { MockVideoAvatarProvider } from "./providers/mock-video-avatar.provider";
import { HeygenVideoAvatarProvider } from "./providers/heygen-video-avatar.provider";

@Module({
  imports: [ConfigModule, StorageModule],
  controllers: [DigitalTwinController],
  providers: [
    DigitalTwinService,
    GenerationService,
    MockImageEditProvider,
    FluxImageEditProvider,
    MockVideoAvatarProvider,
    HeygenVideoAvatarProvider,
    {
      provide: IMAGE_EDIT_PROVIDER,
      inject: [ConfigService, MockImageEditProvider, FluxImageEditProvider],
      useFactory: (config: ConfigService, mock: MockImageEditProvider, flux: FluxImageEditProvider) =>
        config.get<string>("IMAGE_EDIT_PROVIDER") === "flux" ? flux : mock,
    },
    {
      provide: VIDEO_AVATAR_PROVIDER,
      inject: [ConfigService, MockVideoAvatarProvider, HeygenVideoAvatarProvider],
      useFactory: (config: ConfigService, mock: MockVideoAvatarProvider, heygen: HeygenVideoAvatarProvider) =>
        config.get<string>("VIDEO_AVATAR_PROVIDER") === "heygen" ? heygen : mock,
    },
  ],
})
export class DigitalTwinModule {}
