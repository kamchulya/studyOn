import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtPayload } from "../auth/jwt.strategy";
import { DigitalTwinService } from "./digital-twin.service";
import { GenerationService } from "./generation.service";
import { GenerateRequestDto } from "./dto/generate.dto";
import { STORAGE_PROVIDER, StorageProvider } from "../storage/storage-provider.interface";

type UploadedFilesMap = { photos?: Express.Multer.File[]; voice?: Express.Multer.File[] };

@UseGuards(JwtAuthGuard)
@Controller()
export class DigitalTwinController {
  constructor(
    private readonly digitalTwin: DigitalTwinService,
    private readonly generation: GenerationService,
    @Inject(STORAGE_PROVIDER) private readonly storage: StorageProvider,
  ) {}

  @Get("digital-twin")
  async get(@CurrentUser() user: JwtPayload, @Res({ passthrough: true }) res: Response) {
    // Nest sends an empty body (no Content-Type) for a bare `null`/`undefined`
    // return value instead of the JSON text "null", which breaks callers that
    // always call res.json() on a 200. Serialize explicitly so the body is
    // always valid JSON, even when the user has no digital twin yet.
    const twin = await this.digitalTwin.getByUser(user.sub);
    res.json(twin);
  }

  @Post("digital-twin")
  @UseInterceptors(FileFieldsInterceptor([{ name: "photos", maxCount: 3 }, { name: "voice", maxCount: 1 }]))
  async create(
    @CurrentUser() user: JwtPayload,
    @Body("consent") consent: string,
    @UploadedFiles() files: UploadedFilesMap,
  ) {
    const photoFiles = files.photos ?? [];
    if (photoFiles.length === 0) {
      throw new BadRequestException("Нужно загрузить хотя бы одно фото");
    }

    const photoUrls = await Promise.all(
      photoFiles.map((f) => this.storage.upload({ buffer: f.buffer, filename: f.originalname, contentType: f.mimetype })),
    ).then((results) => results.map((r) => r.url));

    let voiceUrl: string | undefined;
    const voiceFile = files.voice?.[0];
    if (voiceFile) {
      const uploaded = await this.storage.upload({
        buffer: voiceFile.buffer,
        filename: voiceFile.originalname,
        contentType: voiceFile.mimetype,
      });
      voiceUrl = uploaded.url;
    }

    return this.digitalTwin.createOrReplace(user.sub, consent, photoUrls, voiceUrl);
  }

  @Post("digital-twin/generate")
  generate(@CurrentUser() user: JwtPayload, @Body() dto: GenerateRequestDto) {
    return this.generation.create(user.sub, dto.type, dto.prompt);
  }

  @Get("generation-jobs")
  list(@CurrentUser() user: JwtPayload) {
    return this.generation.list(user.sub);
  }

  @Get("generation-jobs/:id")
  status(@CurrentUser() user: JwtPayload, @Param("id") id: string) {
    return this.generation.getStatus(user.sub, id);
  }
}
