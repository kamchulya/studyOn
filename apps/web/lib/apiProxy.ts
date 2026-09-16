import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "./api";
import { getAccessToken } from "./auth";

/**
 * Общий прокси для клиентских мутаций: берёт JWT из httpOnly-cookie (недоступной
 * клиентскому JS напрямую) и пробрасывает запрос на Nest API с Authorization-заголовком.
 */
export async function proxyAuthenticated(req: NextRequest, path: string, method: "POST" | "PATCH" | "DELETE") {
  const token = getAccessToken();
  if (!token) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  const body = method === "DELETE" ? undefined : await req.text();
  const apiRes = await apiFetch(path, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  const data = await apiRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: apiRes.status });
}
