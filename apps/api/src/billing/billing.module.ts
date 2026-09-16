import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BillingService } from "./billing.service";
import { BillingController } from "./billing.controller";
import { TokensModule } from "../tokens/tokens.module";
import { PAYMENT_PROVIDER } from "./payment-provider.interface";
import { MockPaymentProvider } from "./providers/mock-payment.provider";
import { KaspiPaymentProvider } from "./providers/kaspi-payment.provider";

@Module({
  imports: [TokensModule, ConfigModule],
  controllers: [BillingController],
  providers: [
    BillingService,
    MockPaymentProvider,
    KaspiPaymentProvider,
    {
      provide: PAYMENT_PROVIDER,
      inject: [ConfigService, MockPaymentProvider, KaspiPaymentProvider],
      useFactory: (
        config: ConfigService,
        mock: MockPaymentProvider,
        kaspi: KaspiPaymentProvider,
      ) => (config.get<string>("PAYMENT_PROVIDER") === "kaspi" ? kaspi : mock),
    },
  ],
})
export class BillingModule {}
