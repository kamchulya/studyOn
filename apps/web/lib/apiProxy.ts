import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "./api";
import { getAccessToken } from "./auth";

/**
 * Общий прокси для клиентских мутаций: берёт JWT из httpOnly-cookie (недоступной
 * клиентскому JS напрямую) и пробрасывает запрос на Nest API с Authorization-заголовком.
 */
export async function proxyAuthenticated(
  req: NextRequest,
  path: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
) {
  const token = getAccessToken();
  if (!token) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  const body = method === "DELETE" || method === "GET" ? undefined : await req.text();
  const apiRes = await apiFetch(path, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  const data = await apiRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: apiRes.status });
}

/**
 * Как proxyAuthenticated, но для multipart/form-data (загрузка файлов) — тело нельзя
 * читать как текст, поэтому пробрасываем FormData из входящего запроса как есть.
 */
export async function proxyAuthenticatedForm(req: NextRequest, path: string) {
  const token = getAccessToken();
  if (!token) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  const formData = await req.formData();
  const apiRes = await apiFetch(path, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await apiRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: apiRes.status });
}
