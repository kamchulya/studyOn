import { NextRequest } from "next/server";
import { proxyAuthenticated } from "@/lib/apiProxy";

export async function POST(req: NextRequest) {
  return proxyAuthenticated(req, "/characters", "POST");
}
