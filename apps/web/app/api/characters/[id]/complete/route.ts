import { NextRequest } from "next/server";
import { proxyAuthenticated } from "@/lib/apiProxy";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return proxyAuthenticated(req, `/characters/${params.id}/complete`, "POST");
}
