import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import { CreatePaymentParams, CreatePaymentResult, PaymentProvider } from "../payment-provider.interface";

/**
 * Провайдер-заглушка для локальной разработки, пока не подключён реальный Kaspi Pay.
 * Отдаёт ссылку на страницу /checkout/mock во фронтенде, которая в dev-режиме
 * имитирует экран оплаты и дёргает confirmPayment по кнопке.
 */
@Injectable()
export class MockPaymentProvider implements PaymentProvider {
  constructor(private readonly config: ConfigService) {}

  async createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult> {
    const paymentId = `mock_${randomUUID()}`;
    const webOrigin = this.config.get<string>("WEB_ORIGIN") ?? "http://localhost:3000";
    return {
      paymentId,
      paymentUrl: `${webOrigin}/checkout/mock?paymentId=${paymentId}&subscriptionId=${params.subscriptionId}`,
    };
  }
}
