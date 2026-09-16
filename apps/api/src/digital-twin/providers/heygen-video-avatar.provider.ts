import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GenerationResult } from "./image-edit-provider.interface";
import { GenerateVideoParams, VideoAvatarProvider } from "./video-avatar-provider.interface";

/**
 * HeyGen (говорящее видео по фото). ВАЖНАЯ ОГОВОРКА: я не могу вызвать этот API
 * вживую, чтобы проверить точные пути/поля — HeyGen регулярно меняет версии API,
 * а полноценное создание тренированного фото-аватара у них многошаговое (группа →
 * тренировка → ожидание). Здесь используется более простой путь — Instant/Talking
 * Photo (загрузка одного фото как ассета + видео с ним без предварительной
 * тренировки). Сверьте с https://docs.heygen.com при первом реальном запуске и
 * поправьте endpoint/поля при необходимости — остальная архитектура (интерфейс,
 * поллинг, GenerationJob) менять не придётся.
 */
@Injectable()
export class HeygenVideoAvatarProvider implements VideoAvatarProvider {
  private readonly logger = new Logger(HeygenVideoAvatarProvider.name);

  constructor(private readonly config: ConfigService) {}

  private get apiKey(): string {
    return this.config.get<string>("HEYGEN_API_KEY") ?? "";
  }

  private get voiceId(): string {
    return this.config.get<string>("HEYGEN_VOICE_ID") ?? "";
  }

  async generate(params: GenerateVideoParams): Promise<GenerationResult> {
    if (!this.apiKey) {
      return { status: "FAILED", errorMessage: "HEYGEN_API_KEY не задан — видео-провайдер не настроен." };
    }
    if (!this.voiceId) {
      return {
        status: "FAILED",
        errorMessage: "HEYGEN_VOICE_ID не задан — выберите голос в HeyGen и укажите его id.",
      };
    }

    try {
      const photoRes = await fetch(params.sourcePhotoUrls[0]);
      if (!photoRes.ok) {
        return { status: "FAILED", errorMessage: "Не удалось загрузить исходное фото для HeyGen" };
      }
      const photoBuffer = Buffer.from(await photoRes.arrayBuffer());
      const contentType = photoRes.headers.get("content-type") ?? "image/jpeg";

      const uploadRes = await fetch("https://upload.heygen.com/v1/asset", {
        method: "POST",
        headers: { "X-Api-Key": this.apiKey, "Content-Type": contentType },
        body: photoBuffer,
      });
      if (!uploadRes.ok) {
        const text = await uploadRes.text();
        this.logger.error(`HeyGen asset upload failed: ${uploadRes.status} ${text}`);
        return { status: "FAILED", errorMessage: `HeyGen: ошибка загрузки фото (${uploadRes.status})` };
      }
      const uploadData = (await uploadRes.json()) as { data: { id: string } };
      const talkingPhotoId = uploadData.data.id;

      const generateRes = await fetch("https://api.heygen.com/v2/video/generate", {
        method: "POST",
        headers: { "X-Api-Key": this.apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          video_inputs: [
            {
              character: { type: "talking_photo", talking_photo_id: talkingPhotoId },
              voice: { type: "text", input_text: params.script, voice_id: this.voiceId },
            },
          ],
          dimension: { width: 720, height: 1280 },
        }),
      });
      if (!generateRes.ok) {
        const text = await generateRes.text();
        this.logger.error(`HeyGen video generate failed: ${generateRes.status} ${text}`);
        return { status: "FAILED", errorMessage: `HeyGen: ошибка запуска генерации видео (${generateRes.status})` };
      }
      const generateData = (await generateRes.json()) as { data: { video_id: string } };
      return { status: "PROCESSING", externalJobId: generateData.data.video_id };
    } catch (err) {
      this.logger.error("HeyGen generate threw", err as Error);
      return { status: "FAILED", errorMessage: "HeyGen: не удалось запустить генерацию" };
    }
  }

  async checkStatus(externalJobId: string): Promise<GenerationResult> {
    if (!this.apiKey) {
      return { status: "FAILED", errorMessage: "HEYGEN_API_KEY не задан." };
    }

    try {
      const res = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${externalJobId}`, {
        headers: { "X-Api-Key": this.apiKey },
      });
      if (!res.ok) {
        return { status: "FAILED", errorMessage: `HeyGen: ошибка проверки статуса (${res.status})` };
      }
      const data = (await res.json()) as { data: { status: string; video_url?: string; error?: unknown } };

      if (data.data.status === "completed" && data.data.video_url) {
        return { status: "READY", resultUrl: data.data.video_url };
      }
      if (data.data.status === "failed") {
        return { status: "FAILED", errorMessage: "HeyGen: генерация видео завершилась ошибкой" };
      }
      return { status: "PROCESSING", externalJobId };
    } catch (err) {
      this.logger.error("HeyGen status check threw", err as Error);
      return { status: "FAILED", errorMessage: "HeyGen: не удалось проверить статус генерации" };
    }
  }
}
