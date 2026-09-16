export interface GenerateImageParams {
  sourcePhotoUrls: string[];
  prompt: string;
}

export interface GenerationResult {
  status: "READY" | "PROCESSING" | "FAILED";
  resultUrl?: string;
  externalJobId?: string;
  errorMessage?: string;
}

export interface ImageEditProvider {
  generate(params: GenerateImageParams): Promise<GenerationResult>;
  checkStatus(externalJobId: string): Promise<GenerationResult>;
}

export const IMAGE_EDIT_PROVIDER = "IMAGE_EDIT_PROVIDER";
