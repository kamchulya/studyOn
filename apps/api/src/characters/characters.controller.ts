import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtPayload } from "../auth/jwt.strategy";
import { CharactersService } from "./characters.service";
import { CreateCharacterRequestDto } from "./dto/create-character.dto";
import { UpdateAppearanceRequestDto } from "./dto/update-appearance.dto";
import { UpdateVoiceRequestDto } from "./dto/update-voice.dto";
import { UpdateNicheRequestDto } from "./dto/update-niche.dto";

@UseGuards(JwtAuthGuard)
@Controller("characters")
export class CharactersController {
  constructor(private readonly characters: CharactersService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateCharacterRequestDto) {
    return this.characters.create(user.sub, dto.name);
  }

  @Get()
  list(@CurrentUser() user: JwtPayload) {
    return this.characters.list(user.sub);
  }

  @Get(":id")
  getById(@CurrentUser() user: JwtPayload, @Param("id") id: string) {
    return this.characters.getById(user.sub, id);
  }

  @Delete(":id")
  delete(@CurrentUser() user: JwtPayload, @Param("id") id: string) {
    return this.characters.delete(user.sub, id);
  }

  @Patch(":id/appearance")
  updateAppearance(
    @CurrentUser() user: JwtPayload,
    @Param("id") id: string,
    @Body() dto: UpdateAppearanceRequestDto,
  ) {
    return this.characters.updateAppearance(user.sub, id, dto);
  }

  @Patch(":id/voice")
  updateVoice(@CurrentUser() user: JwtPayload, @Param("id") id: string, @Body() dto: UpdateVoiceRequestDto) {
    return this.characters.updateVoice(user.sub, id, dto);
  }

  @Patch(":id/niche")
  updateNiche(@CurrentUser() user: JwtPayload, @Param("id") id: string, @Body() dto: UpdateNicheRequestDto) {
    return this.characters.updateNiche(user.sub, id, dto);
  }

  @Post(":id/preview")
  generatePreview(@CurrentUser() user: JwtPayload, @Param("id") id: string) {
    return this.characters.generatePreview(user.sub, id);
  }

  @Post(":id/complete")
  complete(@CurrentUser() user: JwtPayload, @Param("id") id: string) {
    return this.characters.complete(user.sub, id);
  }
}
