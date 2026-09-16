import { GenerationResult } from "./image-edit-provider.interface";

export interface GenerateVideoParams {
  sourcePhotoUrls: string[];
  sourceVoiceUrl?: string;
  script: string;
}

export interface VideoAvatarProvider {
  generate(params: GenerateVideoParams): Promise<GenerationResult>;
  checkStatus(externalJobId: string): Promise<GenerationResult>;
}

export const VIDEO_AVATAR_PROVIDER = "VIDEO_AVATAR_PROVIDER";
