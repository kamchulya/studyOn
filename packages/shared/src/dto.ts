import { PlanCode } from "./plans";

export interface RegisterDto {
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}

export interface UserDto {
  id: string;
  email: string;
  tokensBalance: number;
  activePlan: PlanCode | null;
}

export interface CreateSubscriptionDto {
  plan: PlanCode;
}

export interface CreateSubscriptionResponseDto {
  subscriptionId: string;
  paymentUrl: string;
}
