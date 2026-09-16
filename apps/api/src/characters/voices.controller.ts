import { Controller, Get, Inject } from "@nestjs/common";
import { VOICE_PROVIDER, VoiceProvider } from "./providers/voice-provider.interface";

@Controller("voices")
export class VoicesController {
  constructor(@Inject(VOICE_PROVIDER) private readonly voiceProvider: VoiceProvider) {}

  @Get()
  list() {
    return this.voiceProvider.listVoices();
  }
}
