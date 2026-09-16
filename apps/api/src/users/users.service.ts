import { Injectable } from "@nestjs/common";
import { PlanCode } from "@studyon/shared";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(email: string, passwordHash: string) {
    return this.prisma.user.create({ data: { email, passwordHash } });
  }

  async getActivePlan(userId: string): Promise<PlanCode | null> {
    const activeSub = await this.prisma.subscription.findFirst({
      where: { userId, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });
    // Prisma's generated enum and @studyon/shared's PlanCode are distinct nominal
    // types with identical string values — safe to assert across the boundary.
    return (activeSub?.plan as PlanCode | undefined) ?? null;
  }
}
