import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GenerateImageParams, GenerationResult, ImageEditProvider } from "./image-edit-provider.interface";

/**
 * Flux (через fal.ai) для редактирования фото по референсу + текстовому промпту.
 * Реализовано по документированной структуре fal.ai queue API (submit → request_id,
 * поллинг статуса, забор результата) — я не могу здесь вызвать API вживую, так что
 * при первом реальном запуске сверьте путь/поля запроса с актуальной документацией
 * https://fal.ai/models/<FAL_MODEL_ID>/api и поправьте при необходимости.
 */
@Injectable()
export class FluxImageEditProvider implements ImageEditProvider {
  private readonly logger = new Logger(FluxImageEditProvider.name);

  constructor(private readonly config: ConfigService) {}

  private get modelId(): string {
    return this.config.get<string>("FAL_MODEL_ID") ?? "fal-ai/flux-pro/kontext";
  }

  private get apiKey(): string {
    return this.config.get<string>("FAL_KEY") ?? "";
  }

  async generate(params: GenerateImageParams): Promise<GenerationResult> {
    if (!this.apiKey) {
      return { status: "FAILED", errorMessage: "FAL_KEY не задан — Flux-провайдер не настроен." };
    }

    try {
      const res = await fetch(`https://queue.fal.run/${this.modelId}`, {
        method: "POST",
        headers: {
          Authorization: `Key ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: params.prompt,
          image_url: params.sourcePhotoUrls[0],
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        this.logger.error(`fal.ai submit failed: ${res.status} ${text}`);
        return { status: "FAILED", errorMessage: `Flux: ошибка запуска генерации (${res.status})` };
      }

      const data = (await res.json()) as { request_id: string; status?: string };
      return { status: "PROCESSING", externalJobId: data.request_id };
    } catch (err) {
      this.logger.error("fal.ai submit threw", err as Error);
      return { status: "FAILED", errorMessage: "Flux: не удалось запустить генерацию" };
    }
  }

  async checkStatus(externalJobId: string): Promise<GenerationResult> {
    if (!this.apiKey) {
      return { status: "FAILED", errorMessage: "FAL_KEY не задан." };
    }

    try {
      const statusRes = await fetch(`https://queue.fal.run/${this.modelId}/requests/${externalJobId}/status`, {
        headers: { Authorization: `Key ${this.apiKey}` },
      });
      if (!statusRes.ok) {
        return { status: "FAILED", errorMessage: `Flux: ошибка проверки статуса (${statusRes.status})` };
      }
      const statusData = (await statusRes.json()) as { status: string };

      if (statusData.status !== "COMPLETED") {
        return { status: "PROCESSING", externalJobId };
      }

      const resultRes = await fetch(`https://queue.fal.run/${this.modelId}/requests/${externalJobId}`, {
        headers: { Authorization: `Key ${this.apiKey}` },
      });
      if (!resultRes.ok) {
        return { status: "FAILED", errorMessage: `Flux: ошибка получения результата (${resultRes.status})` };
      }
      const resultData = (await resultRes.json()) as { images?: { url: string }[] };
      const resultUrl = resultData.images?.[0]?.url;
      if (!resultUrl) {
        return { status: "FAILED", errorMessage: "Flux: в ответе нет ссылки на изображение" };
      }
      return { status: "READY", resultUrl };
    } catch (err) {
      this.logger.error("fal.ai status check threw", err as Error);
      return { status: "FAILED", errorMessage: "Flux: не удалось проверить статус генерации" };
    }
  }
}
