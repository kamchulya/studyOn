import { Module } from "@nestjs/common";
import { CharactersService } from "./characters.service";
import { CharactersController } from "./characters.controller";
import { VoicesController } from "./voices.controller";
import { UsersModule } from "../users/users.module";
import { IMAGE_PROVIDER } from "./providers/image-provider.interface";
import { MockImageProvider } from "./providers/mock-image.provider";
import { VOICE_PROVIDER } from "./providers/voice-provider.interface";
import { MockVoiceProvider } from "./providers/mock-voice.provider";

@Module({
  imports: [UsersModule],
  controllers: [CharactersController, VoicesController],
  providers: [
    CharactersService,
    MockImageProvider,
    MockVoiceProvider,
    { provide: IMAGE_PROVIDER, useExisting: MockImageProvider },
    { provide: VOICE_PROVIDER, useExisting: MockVoiceProvider },
  ],
})
export class CharactersModule {}
