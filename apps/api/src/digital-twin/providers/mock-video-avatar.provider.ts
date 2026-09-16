import { Injectable } from "@nestjs/common";
import { GenerationResult } from "./image-edit-provider.interface";
import { GenerateVideoParams, VideoAvatarProvider } from "./video-avatar-provider.interface";

/**
 * Заглушка на время, пока не подключён VIDEO_AVATAR_PROVIDER=heygen.
 * Видео мок-провайдер правдоподобно не изобразить (нет ни файла, ни синтеза),
 * поэтому честно возвращает FAILED с понятным объяснением, а не фейковый успех.
 */
@Injectable()
export class MockVideoAvatarProvider implements VideoAvatarProvider {
  async generate(_params: GenerateVideoParams): Promise<GenerationResult> {
    return {
      status: "FAILED",
      errorMessage:
        "Видео-провайдер не подключён. Нужен VIDEO_AVATAR_PROVIDER=heygen и HEYGEN_API_KEY в переменных окружения.",
    };
  }

  async checkStatus(): Promise<GenerationResult> {
    return { status: "FAILED", errorMessage: "Видео-провайдер не подключён." };
  }
}
