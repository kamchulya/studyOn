import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCharacterRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name!: string;
}
