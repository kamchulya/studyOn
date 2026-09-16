import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtPayload } from "../auth/jwt.strategy";
import { BillingService } from "./billing.service";
import { CreateSubscriptionRequestDto } from "./dto/create-subscription.dto";

@Controller("billing")
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @UseGuards(JwtAuthGuard)
  @Post("subscribe")
  subscribe(@CurrentUser() user: JwtPayload, @Body() dto: CreateSubscriptionRequestDto) {
    return this.billing.createSubscription(user.sub, dto.plan);
  }

  /**
   * Dev-only эндпоинт, имитирующий callback платёжной системы для MockPaymentProvider.
   * Реальный вебхук Kaspi Pay подключается отдельным роутом, когда будет доступ и документация.
   */
  @Post("mock-confirm")
  mockConfirm(@Body("paymentId") paymentId: string) {
    return this.billing.confirmPayment(paymentId);
  }
}
