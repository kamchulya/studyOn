export interface GeneratePreviewParams {
  characterId: string;
  bodyType: string;
  hairColor: string;
  hairLength: string;
  eyeColor: string;
  noseType?: string;
  lipsType?: string;
  facialHair?: string;
  clothingStyle: string;
}

export interface GeneratePreviewResult {
  previewImageUrl: string;
}

export interface ImageProvider {
  generatePreview(params: GeneratePreviewParams): Promise<GeneratePreviewResult>;
}

export const IMAGE_PROVIDER = "IMAGE_PROVIDER";
