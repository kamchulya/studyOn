import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { DigitalTwinService } from "./digital-twin.service";
import { IMAGE_EDIT_PROVIDER, ImageEditProvider } from "./providers/image-edit-provider.interface";
import { VIDEO_AVATAR_PROVIDER, VideoAvatarProvider } from "./providers/video-avatar-provider.interface";

@Injectable()
export class GenerationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly digitalTwin: DigitalTwinService,
    @Inject(IMAGE_EDIT_PROVIDER) private readonly imageProvider: ImageEditProvider,
    @Inject(VIDEO_AVATAR_PROVIDER) private readonly videoProvider: VideoAvatarProvider,
  ) {}

  async create(userId: string, type: "PHOTO" | "VIDEO", prompt: string) {
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

  async getStatus(userId: string, id: string) {
    const job = await this.prisma.generationJob.findUnique({ where: { id } });
    if (!job || job.userId !== userId) {
      throw new NotFoundException("Задача генерации не найдена");
    }

    if ((job.status === "PENDING" || job.status === "PROCESSING") && job.externalJobId) {
      const provider = job.type === "PHOTO" ? this.imageProvider : this.videoProvider;
      const result = await provider.checkStatus(job.externalJobId);
      return this.prisma.generationJob.update({
        where: { id: job.id },
        data: {
          status: result.status,
          resultUrl: result.resultUrl ?? job.resultUrl,
          errorMessage: result.errorMessage,
        },
      });
    }

    return job;
  }
}
