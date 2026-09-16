import type { DigitalTwinDto } from "@studyon/shared";
import { apiFetch } from "./api";
import { getAccessToken } from "./auth";

export async function getDigitalTwin(): Promise<DigitalTwinDto | null> {
  const token = getAccessToken();
  if (!token) return null;
  const res = await apiFetch("/digital-twin", { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return null;
  const data = await res.json();
  return data ?? null;
}
