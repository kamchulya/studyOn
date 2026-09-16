import { PlanCode } from "./plans";

export type VoiceMode = "LIBRARY" | "CUSTOM_PROMPT";
export type CharacterStatus = "DRAFT" | "READY";

export interface RegisterDto {
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}

export interface UserDto {
  id: string;
  email: string;
  tokensBalance: number;
  activePlan: PlanCode | null;
}

export interface CreateSubscriptionDto {
  plan: PlanCode;
}

export interface CreateSubscriptionResponseDto {
  subscriptionId: string;
  paymentUrl: string;
}

export interface CharacterDto {
  id: string;
  name: string;
  status: CharacterStatus;

  bodyType: string | null;
  hairColor: string | null;
  hairLength: string | null;
  eyeColor: string | null;
  noseType: string | null;
  lipsType: string | null;
  facialHair: string | null;
  clothingStyle: string | null;
  previewImageUrl: string | null;

  voiceMode: VoiceMode | null;
  voiceId: string | null;
  voicePrompt: string | null;

  nicheCategory: string | null;
  nicheSubcategory: string | null;
  nicheCustomText: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateCharacterDto {
  name: string;
}

export interface UpdateAppearanceDto {
  bodyType: string;
  hairColor: string;
  hairLength: string;
  eyeColor: string;
  noseType?: string;
  lipsType?: string;
  facialHair?: string;
  clothingStyle: string;
}

export interface UpdateVoiceDto {
  voiceMode: VoiceMode;
  voiceId?: string;
  voicePrompt?: string;
}

export interface UpdateNicheDto {
  nicheCategory: string;
  nicheSubcategory?: string;
  nicheCustomText?: string;
}

export interface DigitalTwinDto {
  id: string;
  userId: string;
  consentGivenAt: string;
  sourcePhotoUrls: string[];
  sourceVoiceUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type GenerationJobType = "PHOTO" | "VIDEO" | "TEXT";
export type GenerationJobStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED";

export interface GenerationJobDto {
  id: string;
  userId: string;
  digitalTwinId: string | null;
  type: GenerationJobType;
  status: GenerationJobStatus;
  prompt: string;
  resultUrl: string | null;
  resultText: string | null;
  errorMessage: string | null;
  externalJobId: string | null;
  scheduledFor: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateRequestDto {
  type: GenerationJobType;
  prompt: string;
}

export interface ScheduleRequestDto {
  scheduledFor: string;
}
