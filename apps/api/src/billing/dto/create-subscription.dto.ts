import { IsEnum } from "class-validator";
import { PlanCode } from "@studyon/shared";

export class CreateSubscriptionRequestDto {
  @IsEnum(PlanCode)
  plan!: PlanCode;
}
