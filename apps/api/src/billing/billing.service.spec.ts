import { BillingService } from "./billing.service";
import { PlanCode } from "@studyon/shared";

describe("BillingService.confirmPayment", () => {
  function setup(initialStatus: "PENDING" | "ACTIVE" | "CANCELLED") {
    const subscription = {
      id: "sub_1",
      userId: "user_1",
      plan: PlanCode.ENTRY,
      status: initialStatus,
      paymentId: "pay_1",
      renewsAt: null as Date | null,
    };

    const prisma = {
      subscription: {
        findUnique: jest.fn().mockResolvedValue(subscription),
        update: jest.fn().mockImplementation(({ data }) => {
          Object.assign(subscription, data);
          return Promise.resolve(subscription);
        }),
      },
    } as any;

    const tokens = {
      applyDelta: jest.fn().mockResolvedValue({ balance: 240, entry: {} }),
    } as any;

    const paymentProvider = { createPayment: jest.fn() } as any;

    const service = new BillingService(prisma, tokens, paymentProvider);
    return { service, prisma, tokens, subscription };
  }

  it("activates a pending subscription and credits tokens exactly once", async () => {
    const { service, tokens, subscription } = setup("PENDING");

    const result = await service.confirmPayment("pay_1");

    expect(result.status).toBe("ACTIVE");
    expect(subscription.renewsAt).toBeInstanceOf(Date);
    expect(tokens.applyDelta).toHaveBeenCalledTimes(1);
    expect(tokens.applyDelta).toHaveBeenCalledWith("user_1", 240, "subscription_credit", "sub_1");
  });

  it("is idempotent: a second confirmation for an already-active subscription does not re-credit tokens", async () => {
    const { service, tokens } = setup("ACTIVE");

    const result = await service.confirmPayment("pay_1");

    expect(result.status).toBe("ACTIVE");
    expect(tokens.applyDelta).not.toHaveBeenCalled();
  });

  it("throws for a cancelled subscription", async () => {
    const { service } = setup("CANCELLED");

    await expect(service.confirmPayment("pay_1")).rejects.toThrow();
  });
});
