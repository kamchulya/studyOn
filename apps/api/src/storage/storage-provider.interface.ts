export interface UploadFileParams {
  buffer: Buffer;
  filename: string;
  contentType: string;
}

export interface UploadFileResult {
  url: string;
}

export interface StorageProvider {
  upload(params: UploadFileParams): Promise<UploadFileResult>;
}

export const STORAGE_PROVIDER = "STORAGE_PROVIDER";
