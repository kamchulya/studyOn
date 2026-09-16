import { Controller, Get, NotFoundException, UseGuards } from "@nestjs/common";
import { UserDto } from "@studyon/shared";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtPayload } from "../auth/jwt.strategy";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async me(@CurrentUser() authUser: JwtPayload): Promise<UserDto> {
    const user = await this.users.findById(authUser.sub);
    if (!user) {
      throw new NotFoundException("Пользователь не найден");
    }
    const activePlan = await this.users.getActivePlan(user.id);
    return {
      id: user.id,
      email: user.email,
      tokensBalance: user.tokensBalance,
      activePlan,
    };
  }
}
