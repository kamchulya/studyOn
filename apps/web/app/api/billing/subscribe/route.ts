import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const token = getAccessToken();
  if (!token) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  const body = await req.json();
  const apiRes = await apiFetch("/billing/subscribe", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const data = await apiRes.json();
  return NextResponse.json(data, { status: apiRes.status });
}
