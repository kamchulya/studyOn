import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { DigitalTwinService } from "./digital-twin.service";
import { IMAGE_EDIT_PROVIDER, ImageEditProvider } from "./providers/image-edit-provider.interface";
import { VIDEO_AVATAR_PROVIDER, VideoAvatarProvider } from "./providers/video-avatar-provider.interface";
import { TEXT_PROVIDER, TextProvider } from "./providers/text-provider.interface";

@Injectable()
export class GenerationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly digitalTwin: DigitalTwinService,
    @Inject(IMAGE_EDIT_PROVIDER) private readonly imageProvider: ImageEditProvider,
    @Inject(VIDEO_AVATAR_PROVIDER) private readonly videoProvider: VideoAvatarProvider,
    @Inject(TEXT_PROVIDER) private readonly textProvider: TextProvider,
  ) {}

  async create(userId: string, type: "PHOTO" | "VIDEO" | "TEXT", prompt: string) {
    if (type === "TEXT") {
      const job = await this.prisma.generationJob.create({
        data: { userId, type, prompt, status: "PENDING" },
      });
      const result = await this.textProvider.generate({ prompt });
      return this.prisma.generationJob.update({
        where: { id: job.id },
        data: {
          status: result.status,
          resultText: result.resultText,
          errorMessage: result.errorMessage,
          externalJobId: result.externalJobId,
        },
      });
    }

    const twin = await this.digitalTwin.getOwnedOrThrow(userId);

    const job = await this.prisma.generationJob.create({
      data: { userId, digitalTwinId: twin.id, type, prompt, status: "PENDING" },
    });

    const result =
      type === "PHOTO"
        ? await this.imageProvider.generate({ sourcePhotoUrls: twin.sourcePhotoUrls, prompt })
        : await this.videoProvider.generate({
            sourcePhotoUrls: twin.sourcePhotoUrls,
            sourceVoiceUrl: twin.sourceVoiceUrl ?? undefined,
            script: prompt,
          });

    return this.prisma.generationJob.update({
      where: { id: job.id },
      data: {
        status: result.status,
        resultUrl: result.resultUrl,
        errorMessage: result.errorMessage,
        externalJobId: result.externalJobId,
      },
    });
  }

  async list(userId: string) {
    return this.prisma.generationJob.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  }

  async listScheduled(userId: string) {
    return this.prisma.generationJob.findMany({
      where: { userId, scheduledFor: { not: null } },
      orderBy: { scheduledFor: "asc" },
    });
  }

  async getStatus(userId: string, id: string) {
    const job = await this.getOwned(userId, id);

    if ((job.status === "PENDING" || job.status === "PROCESSING") && job.externalJobId) {
      const provider =
        job.type === "PHOTO" ? this.imageProvider : job.type === "VIDEO" ? this.videoProvider : this.textProvider;
      const result = await provider.checkStatus(job.externalJobId);
      return this.prisma.generationJob.update({
        where: { id: job.id },
        data: {
          status: result.status,
          resultUrl: (result as { resultUrl?: string }).resultUrl ?? job.resultUrl,
          errorMessage: result.errorMessage,
        },
      });
    }

    return job;
  }

  async schedule(userId: string, id: string, scheduledFor: string) {
    await this.getOwned(userId, id);
    return this.prisma.generationJob.update({ where: { id }, data: { scheduledFor: new Date(scheduledFor) } });
  }

  async unschedule(userId: string, id: string) {
    await this.getOwned(userId, id);
    return this.prisma.generationJob.update({ where: { id }, data: { scheduledFor: null } });
  }

  private async getOwned(userId: string, id: string) {
    const job = await this.prisma.generationJob.findUnique({ where: { id } });
    if (!job || job.userId !== userId) {
      throw new NotFoundException("Задача генерации не найдена");
    }
    return job;
  }
}
