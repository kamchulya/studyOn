import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { setAuthCookies } from "../_shared";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const apiRes = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify(body) });
  const data = await apiRes.json();

  if (!apiRes.ok) {
    return NextResponse.json(data, { status: apiRes.status });
  }

  const response = NextResponse.json({ user: data.user });
  return setAuthCookies(response, data);
}
