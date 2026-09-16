import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getCharacter } from "@/lib/characters";
import { apiFetch } from "@/lib/api";
import { CharacterWizard } from "@/components/character-wizard/CharacterWizard";
import type { VoiceOption } from "@studyon/shared";

export default async function EditCharacterPage({ params }: { params: { id: string } }) {
  await requireUser();
  const character = await getCharacter(params.id);
  if (!character) {
    notFound();
  }

  const voicesRes = await apiFetch("/voices");
  const voices: VoiceOption[] = voicesRes.ok ? await voicesRes.json() : [];

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Настройка персонажа: {character.name}</h1>
      <div className="mt-8">
        <CharacterWizard initialCharacter={character} voices={voices} />
      </div>
    </main>
  );
}
