import { VoiceOption } from "@studyon/shared";

export interface SynthesizePreviewParams {
  prompt: string;
}

export interface SynthesizePreviewResult {
  status: "pending" | "ready";
  sampleUrl?: string;
}

export interface VoiceProvider {
  listVoices(): Promise<VoiceOption[]>;
  synthesizePreview(params: SynthesizePreviewParams): Promise<SynthesizePreviewResult>;
}

export const VOICE_PROVIDER = "VOICE_PROVIDER";
