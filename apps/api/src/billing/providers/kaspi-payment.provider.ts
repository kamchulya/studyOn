import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CreatePaymentParams, CreatePaymentResult, PaymentProvider } from "../payment-provider.interface";

/**
 * Заготовка под Kaspi Pay. Требует оформленного мерчант-доступа (см. план Фазы 0,
 * раздел "Открытый вопрос") — конкретные эндпоинты и формат запроса подставляются,
 * когда будут ключи и документация мерчант-кабинета.
 */
@Injectable()
export class KaspiPaymentProvider implements PaymentProvider {
  private readonly logger = new Logger(KaspiPaymentProvider.name);

  constructor(private readonly config: ConfigService) {}

  async createPayment(_params: CreatePaymentParams): Promise<CreatePaymentResult> {
    const merchantId = this.config.get<string>("KASPI_MERCHANT_ID");
    if (!merchantId) {
      this.logger.error("KASPI_MERCHANT_ID не задан — интеграция с Kaspi Pay ещё не настроена");
    }
    throw new Error(
      "KaspiPaymentProvider не реализован: нужен мерчант-доступ Kaspi Pay. " +
        "До этого используйте PAYMENT_PROVIDER=mock.",
    );
  }
}
