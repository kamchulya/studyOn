import { Injectable } from "@nestjs/common";
import { GenerateTextParams, TextGenerationResult, TextProvider } from "./text-provider.interface";

/**
 * Заглушка на время, пока не подключён LLM_PROVIDER=openai.
 * Реального текста не пишет — честно возвращает помеченный черновик, чтобы
 * можно было проверить весь пайплайн (генерация → сохранение → показ результата).
 */
@Injectable()
export class MockTextProvider implements TextProvider {
  async generate(params: GenerateTextParams): Promise<TextGenerationResult> {
    return {
      status: "READY",
      resultText: `[Черновик по теме: «${params.prompt}»]\n\nЭто заглушка мок-провайдера — реального текста здесь нет. Подключите OPENAI_API_KEY и LLM_PROVIDER=openai, чтобы получать настоящие посты.`,
    };
  }

  async checkStatus(): Promise<TextGenerationResult> {
    return { status: "READY" };
  }
}
