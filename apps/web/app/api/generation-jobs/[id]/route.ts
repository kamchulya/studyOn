import { NextRequest } from "next/server";
import { proxyAuthenticated } from "@/lib/apiProxy";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return proxyAuthenticated(req, `/generation-jobs/${params.id}`, "GET");
}
