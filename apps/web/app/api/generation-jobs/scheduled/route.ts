import { NextRequest } from "next/server";
import { proxyAuthenticated } from "@/lib/apiProxy";

export async function GET(req: NextRequest) {
  return proxyAuthenticated(req, "/generation-jobs/scheduled", "GET");
}
