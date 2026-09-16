import { NextRequest } from "next/server";
import { proxyAuthenticated } from "@/lib/apiProxy";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return proxyAuthenticated(req, `/generation-jobs/${params.id}/schedule`, "POST");
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return proxyAuthenticated(req, `/generation-jobs/${params.id}/schedule`, "DELETE");
}
