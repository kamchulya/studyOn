export interface CreatePaymentParams {
  subscriptionId: string;
  amountKzt: number;
  description: string;
}

export interface CreatePaymentResult {
  paymentId: string;
  paymentUrl: string;
}

export interface PaymentProvider {
  createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult>;
}

export const PAYMENT_PROVIDER = "PAYMENT_PROVIDER";
