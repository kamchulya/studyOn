import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { AuthResponseDto, UserDto } from "@studyon/shared";
import { UsersService } from "../users/users.service";

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(email: string, password: string): Promise<AuthResponseDto> {
    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new ConflictException("Пользователь с таким email уже существует");
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await this.users.create(email, passwordHash);
    return this.issueTokens(user.id, user.email, 0, null);
  }

  async login(email: string, password: string): Promise<AuthResponseDto> {
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Неверный email или пароль");
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException("Неверный email или пароль");
    }
    const activePlan = await this.users.getActivePlan(user.id);
    return this.issueTokens(user.id, user.email, user.tokensBalance, activePlan);
  }

  async refresh(refreshToken: string): Promise<AuthResponseDto> {
    let payload: { sub: string };
    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>("JWT_REFRESH_SECRET"),
      });
    } catch {
      throw new UnauthorizedException("Невалидный refresh-токен");
    }
    const user = await this.users.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException("Пользователь не найден");
    }
    const activePlan = await this.users.getActivePlan(user.id);
    return this.issueTokens(user.id, user.email, user.tokensBalance, activePlan);
  }

  private async issueTokens(
    userId: string,
    email: string,
    tokensBalance: number,
    activePlan: UserDto["activePlan"],
  ): Promise<AuthResponseDto> {
    const payload = { sub: userId, email };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>("JWT_SECRET"),
      expiresIn: this.config.get<string>("JWT_ACCESS_TTL") ?? "15m",
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>("JWT_REFRESH_SECRET"),
      expiresIn: this.config.get<string>("JWT_REFRESH_TTL") ?? "30d",
    });
    return {
      accessToken,
      refreshToken,
      user: { id: userId, email, tokensBalance, activePlan },
    };
  }
}
