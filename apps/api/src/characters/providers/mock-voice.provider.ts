import { Injectable } from "@nestjs/common";
import { VOICE_LIBRARY } from "@studyon/shared";
import { SynthesizePreviewParams, SynthesizePreviewResult, VoiceProvider } from "./voice-provider.interface";

/**
 * Заглушка на время, пока не подключён реальный TTS-провайдер (ElevenLabs).
 * Библиотека голосов — статический список из @studyon/shared, без аудио-сэмплов.
 */
@Injectable()
export class MockVoiceProvider implements VoiceProvider {
  async listVoices() {
    return VOICE_LIBRARY;
  }

  async synthesizePreview(_params: SynthesizePreviewParams): Promise<SynthesizePreviewResult> {
    return { status: "pending" };
  }
}
