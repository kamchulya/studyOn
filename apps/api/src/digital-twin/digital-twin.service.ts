import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DigitalTwinService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrReplace(userId: string, consent: string, photoUrls: string[], voiceUrl?: string) {
    if (consent !== "true") {
      throw new BadRequestException("Нужно явное согласие на обработку фото/голоса");
    }
    if (photoUrls.length === 0) {
      throw new BadRequestException("Нужно загрузить хотя бы одно фото");
    }

    return this.prisma.digitalTwin.upsert({
      where: { userId },
      create: { userId, consentGivenAt: new Date(), sourcePhotoUrls: photoUrls, sourceVoiceUrl: voiceUrl },
      update: { sourcePhotoUrls: photoUrls, sourceVoiceUrl: voiceUrl },
    });
  }

  async getByUser(userId: string) {
    return this.prisma.digitalTwin.findUnique({ where: { userId } });
  }

  async getOwnedOrThrow(userId: string) {
    const twin = await this.getByUser(userId);
    if (!twin) {
      throw new NotFoundException("Сначала загрузите фото и дайте согласие");
    }
    return twin;
  }
}
