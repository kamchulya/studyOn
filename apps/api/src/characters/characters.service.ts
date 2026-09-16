import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Character } from "@prisma/client";
import { CharacterDto, getPlan } from "@studyon/shared";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { IMAGE_PROVIDER, ImageProvider } from "./providers/image-provider.interface";
import { UpdateAppearanceRequestDto } from "./dto/update-appearance.dto";
import { UpdateVoiceRequestDto } from "./dto/update-voice.dto";
import { UpdateNicheRequestDto } from "./dto/update-niche.dto";

@Injectable()
export class CharactersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
    @Inject(IMAGE_PROVIDER) private readonly imageProvider: ImageProvider,
  ) {}

  async create(userId: string, name: string): Promise<CharacterDto> {
    const activePlan = await this.users.getActivePlan(userId);
    if (!activePlan) {
      throw new ForbiddenException("Нужна активная подписка, чтобы создать персонажа");
    }
    const planDef = getPlan(activePlan);
    const existingCount = await this.prisma.character.count({ where: { userId } });
    if (existingCount >= planDef.maxCharacters) {
      throw new ForbiddenException(
        `Достигнут лимит персонажей по тарифу ${planDef.title} (${planDef.maxCharacters})`,
      );
    }

    const character = await this.prisma.character.create({ data: { userId, name } });
    return this.toDto(character);
  }

  async list(userId: string): Promise<CharacterDto[]> {
    const characters = await this.prisma.character.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return characters.map((c) => this.toDto(c));
  }

  async getOwned(userId: string, id: string): Promise<Character> {
    const character = await this.prisma.character.findUnique({ where: { id } });
    if (!character || character.userId !== userId) {
      throw new NotFoundException("Персонаж не найден");
    }
    return character;
  }

  async getById(userId: string, id: string): Promise<CharacterDto> {
    return this.toDto(await this.getOwned(userId, id));
  }

  async delete(userId: string, id: string): Promise<void> {
    await this.getOwned(userId, id);
    await this.prisma.character.delete({ where: { id } });
  }

  async updateAppearance(userId: string, id: string, dto: UpdateAppearanceRequestDto): Promise<CharacterDto> {
    await this.getOwned(userId, id);
    const character = await this.prisma.character.update({ where: { id }, data: dto });
    return this.toDto(character);
  }

  async updateVoice(userId: string, id: string, dto: UpdateVoiceRequestDto): Promise<CharacterDto> {
    await this.getOwned(userId, id);
    const character = await this.prisma.character.update({
      where: { id },
      data: {
        voiceMode: dto.voiceMode,
        voiceId: dto.voiceMode === "LIBRARY" ? dto.voiceId : null,
        voicePrompt: dto.voiceMode === "CUSTOM_PROMPT" ? dto.voicePrompt : null,
      },
    });
    return this.toDto(character);
  }

  async updateNiche(userId: string, id: string, dto: UpdateNicheRequestDto): Promise<CharacterDto> {
    await this.getOwned(userId, id);
    const character = await this.prisma.character.update({ where: { id }, data: dto });
    return this.toDto(character);
  }

  async generatePreview(userId: string, id: string): Promise<CharacterDto> {
    const existing = await this.getOwned(userId, id);
    if (!existing.bodyType || !existing.hairColor || !existing.hairLength || !existing.eyeColor || !existing.clothingStyle) {
      throw new BadRequestException("Сначала заполните раздел «Внешность»");
    }

    const { previewImageUrl } = await this.imageProvider.generatePreview({
      characterId: id,
      bodyType: existing.bodyType,
      hairColor: existing.hairColor,
      hairLength: existing.hairLength,
      eyeColor: existing.eyeColor,
      noseType: existing.noseType ?? undefined,
      lipsType: existing.lipsType ?? undefined,
      facialHair: existing.facialHair ?? undefined,
      clothingStyle: existing.clothingStyle,
    });

    const character = await this.prisma.character.update({ where: { id }, data: { previewImageUrl } });
    return this.toDto(character);
  }

  async complete(userId: string, id: string): Promise<CharacterDto> {
    const existing = await this.getOwned(userId, id);

    const appearanceDone = Boolean(
      existing.bodyType && existing.hairColor && existing.hairLength && existing.eyeColor && existing.clothingStyle,
    );
    const voiceDone = Boolean(
      existing.voiceMode === "LIBRARY" ? existing.voiceId : existing.voiceMode === "CUSTOM_PROMPT" ? existing.voicePrompt : false,
    );
    const nicheDone = Boolean(existing.nicheCategory);

    if (!appearanceDone || !voiceDone || !nicheDone) {
      throw new BadRequestException("Заполните все три раздела (Внешность, Голос, Ниша), прежде чем завершить");
    }

    const character = await this.prisma.character.update({ where: { id }, data: { status: "READY" } });
    return this.toDto(character);
  }

  private toDto(character: Character): CharacterDto {
    return {
      id: character.id,
      name: character.name,
      status: character.status,
      bodyType: character.bodyType,
      hairColor: character.hairColor,
      hairLength: character.hairLength,
      eyeColor: character.eyeColor,
      noseType: character.noseType,
      lipsType: character.lipsType,
      facialHair: character.facialHair,
      clothingStyle: character.clothingStyle,
      previewImageUrl: character.previewImageUrl,
      voiceMode: character.voiceMode,
      voiceId: character.voiceId,
      voicePrompt: character.voicePrompt,
      nicheCategory: character.nicheCategory,
      nicheSubcategory: character.nicheSubcategory,
      nicheCustomText: character.nicheCustomText,
      createdAt: character.createdAt.toISOString(),
      updatedAt: character.updatedAt.toISOString(),
    };
  }
}
