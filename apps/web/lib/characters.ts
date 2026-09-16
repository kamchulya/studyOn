import type { CharacterDto } from "@studyon/shared";
import { apiFetch } from "./api";
import { getAccessToken } from "./auth";

export async function getCharacters(): Promise<CharacterDto[]> {
  const token = getAccessToken();
  if (!token) return [];
  const res = await apiFetch("/characters", { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return [];
  return res.json();
}

export async function getCharacter(id: string): Promise<CharacterDto | null> {
  const token = getAccessToken();
  if (!token) return null;
  const res = await apiFetch(`/characters/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return null;
  return res.json();
}
