import { NextRequest } from "next/server";
import { proxyAuthenticated, proxyAuthenticatedForm } from "@/lib/apiProxy";

export async function GET(req: NextRequest) {
  return proxyAuthenticated(req, "/digital-twin", "GET");
}

export async function POST(req: NextRequest) {
  return proxyAuthenticatedForm(req, "/digital-twin");
}
