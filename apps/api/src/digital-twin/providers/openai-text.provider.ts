import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GenerateTextParams, TextGenerationResult, TextProvider } from "./text-provider.interface";

const SYSTEM_PROMPT =
  "Ты — ассистент, который пишет посты для соцсетей на русском языке для тренеров, коучей и блогеров. " +
  "Пиши живо и по делу, без воды и канцелярита, в дружелюбном тоне. Не используй хэштеги без необходимости.";

/**
 * OpenAI Chat Completions — реальная генерация текста поста. Запрос синхронный,
 * поэтому generate() сразу отдаёт READY/FAILED, без поллинга статуса.
 */
@Injectable()
export class OpenAiTextProvider implements TextProvider {
  private readonly logger = new Logger(OpenAiTextProvider.name);

  constructor(private readonly config: ConfigService) {}

  private get apiKey(): string {
    return this.config.get<string>("OPENAI_API_KEY") ?? "";
  }

  private get model(): string {
    return this.config.get<string>("OPENAI_MODEL") ?? "gpt-4o-mini";
  }

  async generate(params: GenerateTextParams): Promise<TextGenerationResult> {
    if (!this.apiKey) {
      return { status: "FAILED", errorMessage: "OPENAI_API_KEY не задан — OpenAI-провайдер не настроен." };
    }

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 800,
          temperature: 0.8,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: params.prompt },
          ],
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        this.logger.error(`OpenAI request failed: ${res.status} ${text}`);
        return { status: "FAILED", errorMessage: `OpenAI: ошибка генерации (${res.status})` };
      }

      const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const resultText = data.choices?.[0]?.message?.content?.trim();
      if (!resultText) {
        return { status: "FAILED", errorMessage: "OpenAI: пустой ответ" };
      }
      return { status: "READY", resultText };
    } catch (err) {
      this.logger.error("OpenAI request threw", err as Error);
      return { status: "FAILED", errorMessage: "OpenAI: не удалось сгенерировать текст" };
    }
  }

  async checkStatus(): Promise<TextGenerationResult> {
    return { status: "READY" };
  }
}
