import { IsIn, IsOptional } from "class-validator";
import {
  BODY_TYPES,
  CLOTHING_STYLES,
  EYE_COLORS,
  FACIAL_HAIR_OPTIONS,
  HAIR_COLORS,
  HAIR_LENGTHS,
  LIPS_TYPES,
  NOSE_TYPES,
} from "@studyon/shared";

const values = (list: { value: string }[]) => list.map((o) => o.value);

export class UpdateAppearanceRequestDto {
  @IsIn(values(BODY_TYPES))
  bodyType!: string;

  @IsIn(values(HAIR_COLORS))
  hairColor!: string;

  @IsIn(values(HAIR_LENGTHS))
  hairLength!: string;

  @IsIn(values(EYE_COLORS))
  eyeColor!: string;

  @IsOptional()
  @IsIn(values(NOSE_TYPES))
  noseType?: string;

  @IsOptional()
  @IsIn(values(LIPS_TYPES))
  lipsType?: string;

  @IsOptional()
  @IsIn(values(FACIAL_HAIR_OPTIONS))
  facialHair?: string;

  @IsIn(values(CLOTHING_STYLES))
  clothingStyle!: string;
}
