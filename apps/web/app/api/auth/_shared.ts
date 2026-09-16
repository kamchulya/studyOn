import { NextResponse } from "next/server";
import type { AuthResponseDto } from "@studyon/shared";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth";

export function setAuthCookies(response: NextResponse, data: AuthResponseDto) {
  const isProd = process.env.NODE_ENV === "production";
  response.cookies.set(ACCESS_TOKEN_COOKIE, data.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, data.refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
