import { Controller, Get } from "@nestjs/common";
import { PLANS } from "@studyon/shared";

@Controller("plans")
export class PlansController {
  @Get()
  list() {
    return PLANS;
  }
}
