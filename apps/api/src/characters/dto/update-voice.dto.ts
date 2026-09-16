import { IsIn, IsString, MaxLength, ValidateIf } from "class-validator";
import { VOICE_LIBRARY } from "@studyon/shared";

const VOICE_IDS = VOICE_LIBRARY.map((v) => v.id);

export class UpdateVoiceRequestDto {
  @IsIn(["LIBRARY", "CUSTOM_PROMPT"])
  voiceMode!: "LIBRARY" | "CUSTOM_PROMPT";

  @ValidateIf((dto: UpdateVoiceRequestDto) => dto.voiceMode === "LIBRARY")
  @IsIn(VOICE_IDS)
  voiceId?: string;

  @ValidateIf((dto: UpdateVoiceRequestDto) => dto.voiceMode === "CUSTOM_PROMPT")
  @IsString()
  @MaxLength(500)
  voicePrompt?: string;
}
