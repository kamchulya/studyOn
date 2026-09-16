import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TokensService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Начисляет/списывает токены и делает это одной транзакцией с записью в леджер,
   * чтобы баланс на User и история в TokenLedgerEntry никогда не расходились.
   */
  async applyDelta(userId: string, delta: number, reason: string, refId?: string) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId },
        data: { tokensBalance: { increment: delta } },
      });
      const entry = await tx.tokenLedgerEntry.create({
        data: { userId, delta, reason, refId },
      });
      return { balance: user.tokensBalance, entry };
    });
  }

  getBalance(userId: string) {
    return this.prisma.user
      .findUniqueOrThrow({ where: { id: userId } })
      .then((u) => u.tokensBalance);
  }
}
