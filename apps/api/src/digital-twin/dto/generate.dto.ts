import { IsIn, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class GenerateRequestDto {
  @IsIn(["PHOTO", "VIDEO"])
  type!: "PHOTO" | "VIDEO";

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  prompt!: string;
}
