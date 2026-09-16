import { IsISO8601 } from "class-validator";

export class ScheduleDto {
  @IsISO8601()
  scheduledFor!: string;
}
