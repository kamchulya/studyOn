import { Injectable } from "@nestjs/common";
import { GenerateImageParams, GenerationResult, ImageEditProvider } from "./image-edit-provider.interface";

/**
 * Заглушка на время, пока не подключён FLUX_EDIT_PROVIDER=flux (fal.ai).
 * Реального редактирования не делает — возвращает исходное фото как есть, чтобы
 * можно было проверить весь пайплайн (загрузка → генерация → показ результата).
 */
@Injectable()
export class MockImageEditProvider implements ImageEditProvider {
  async generate(params: GenerateImageParams): Promise<GenerationResult> {
    return { status: "READY", resultUrl: params.sourcePhotoUrls[0] };
  }

  async checkStatus(): Promise<GenerationResult> {
    return { status: "READY" };
  }
}
