import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";
import { NICHE_CATEGORIES } from "@studyon/shared";

const CATEGORY_IDS = NICHE_CATEGORIES.map((c) => c.id);

export class UpdateNicheRequestDto {
  @IsIn(CATEGORY_IDS)
  nicheCategory!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  nicheSubcategory?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  nicheCustomText?: string;
}
