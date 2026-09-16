import { Injectable } from "@nestjs/common";
import { GeneratePreviewParams, GeneratePreviewResult, ImageProvider } from "./image-provider.interface";

const PALETTE = ["#16a34a", "#0ea5e9", "#f97316", "#a855f7", "#ec4899", "#eab308"];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Заглушка на время, пока не подключён реальный image-провайдер (Flux/Replicate/Fal.ai).
 * Рисует детерминированную SVG-карточку по атрибутам — без внешних сетевых вызовов,
 * чтобы конструктор можно было проверить end-to-end уже сейчас.
 */
@Injectable()
export class MockImageProvider implements ImageProvider {
  async generatePreview(params: GeneratePreviewParams): Promise<GeneratePreviewResult> {
    const key = [
      params.bodyType,
      params.hairColor,
      params.hairLength,
      params.eyeColor,
      params.noseType ?? "",
      params.lipsType ?? "",
      params.facialHair ?? "",
      params.clothingStyle,
    ].join("|");
    const color = PALETTE[hashString(key) % PALETTE.length];

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
      <rect width="256" height="256" fill="${color}"/>
      <circle cx="128" cy="100" r="48" fill="white" fill-opacity="0.85"/>
      <rect x="58" y="160" width="140" height="80" rx="24" fill="white" fill-opacity="0.85"/>
      <text x="128" y="250" font-family="sans-serif" font-size="11" fill="white" text-anchor="middle">
        StudyOn preview
      </text>
    </svg>`;

    const previewImageUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
    return { previewImageUrl };
  }
}
