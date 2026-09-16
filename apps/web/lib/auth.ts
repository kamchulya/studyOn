import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserDto } from "@studyon/shared";
import { apiFetch } from "./api";

export const ACCESS_TOKEN_COOKIE = "studyon_access_token";
export const REFRESH_TOKEN_COOKIE = "studyon_refresh_token";

export function getAccessToken(): string | undefined {
  return cookies().get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getCurrentUser(): Promise<UserDto | null> {
  const token = getAccessToken();
  if (!token) return null;

  const res = await apiFetch("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function requireUser(): Promise<UserDto> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
