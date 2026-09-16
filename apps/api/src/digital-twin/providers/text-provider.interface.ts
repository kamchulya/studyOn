export interface GenerateTextParams {
  prompt: string;
}

export interface TextGenerationResult {
  status: "READY" | "PROCESSING" | "FAILED";
  resultText?: string;
  externalJobId?: string;
  errorMessage?: string;
}

export interface TextProvider {
  generate(params: GenerateTextParams): Promise<TextGenerationResult>;
  checkStatus(externalJobId: string): Promise<TextGenerationResult>;
}

export const TEXT_PROVIDER = "TEXT_PROVIDER";
