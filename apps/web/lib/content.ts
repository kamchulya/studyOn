import type { GenerationJobDto } from "@studyon/shared";
import { apiFetch } from "./api";
import { getAccessToken } from "./auth";

export async function getGenerationJobs(): Promise<GenerationJobDto[]> {
  const token = getAccessToken();
  if (!token) return [];
  const res = await apiFetch("/generation-jobs", { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return [];
  return res.json();
}

export async function getScheduledJobs(): Promise<GenerationJobDto[]> {
  const token = getAccessToken();
  if (!token) return [];
  const res = await apiFetch("/generation-jobs/scheduled", { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return [];
  return res.json();
}
