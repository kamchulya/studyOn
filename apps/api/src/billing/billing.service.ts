import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { getPlan, PlanCode } from "@studyon/shared";
import { PrismaService } from "../prisma/prisma.service";
import { TokensService } from "../tokens/tokens.service";
import { PAYMENT_PROVIDER, PaymentProvider } from "./payment-provider.interface";

const SUBSCRIPTION_PERIOD_DAYS = 30;

@Injectable()
export class BillingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: TokensService,
    @Inject(PAYMENT_PROVIDER) private readonly paymentProvider: PaymentProvider,
  ) {}

  async createSubscription(userId: string, plan: PlanCode) {
    const planDef = getPlan(plan);

    const subscription = await this.prisma.subscription.create({
      data: { userId, plan, status: "PENDING" },
    });

    const payment = await this.paymentProvider.createPayment({
      subscriptionId: subscription.id,
      amountKzt: planDef.priceKztMonthly,
      description: `StudyOn — тариф ${planDef.title}`,
    });

    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: { paymentId: payment.paymentId },
    });

    return { subscriptionId: subscription.id, paymentUrl: payment.paymentUrl };
  }

  /**
   * Вызывается по подтверждению оплаты (webhook/mock-callback). Идемпотентна:
   * повторный вызов для уже активной подписки токены повторно не начислит.
   */
  async confirmPayment(paymentId: string) {
    const subscription = await this.prisma.subscription.findUnique({ where: { paymentId } });
    if (!subscription) {
      throw new NotFoundException("Подписка с таким paymentId не найдена");
    }
    if (subscription.status === "ACTIVE") {
      return subscription;
    }
    if (subscription.status === "CANCELLED") {
      throw new BadRequestException("Подписка отменена");
    }

    const planDef = getPlan(subscription.plan as PlanCode);
    const renewsAt = new Date(Date.now() + SUBSCRIPTION_PERIOD_DAYS * 24 * 60 * 60 * 1000);

    const updated = await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: "ACTIVE", renewsAt },
    });

    await this.tokens.applyDelta(
      subscription.userId,
      planDef.tokensPerMonth,
      "subscription_credit",
      subscription.id,
    );

    return updated;
  }
}
