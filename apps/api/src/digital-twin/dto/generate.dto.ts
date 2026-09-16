import { IsIn, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class GenerateRequestDto {
  @IsIn(["PHOTO", "VIDEO", "TEXT"])
  type!: "PHOTO" | "VIDEO" | "TEXT";

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  prompt!: string;
}
