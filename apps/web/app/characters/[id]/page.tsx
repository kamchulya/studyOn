import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getCharacter } from "@/lib/characters";
import { NICHE_CATEGORIES, VOICE_LIBRARY } from "@studyon/shared";

export default async function CharacterPage({ params }: { params: { id: string } }) {
  await requireUser();
  const character = await getCharacter(params.id);
  if (!character) {
    notFound();
  }

  const niche = NICHE_CATEGORIES.find((c) => c.id === character.nicheCategory);
  const voice = VOICE_LIBRARY.find((v) => v.id === character.voiceId);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/characters" className="text-sm text-slate-400 hover:text-white">
        ← Мои персонажи
      </Link>

      <div className="mt-4 flex items-center gap-6">
        {character.previewImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={character.previewImageUrl} alt={character.name} className="h-32 w-32 rounded-xl object-cover" />
        )}
        <div>
          <h1 className="text-2xl font-semibold">{character.name}</h1>
          <p className="text-sm text-slate-400">{character.status === "READY" ? "Готов" : "Черновик"}</p>
        </div>
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-slate-400">Голос</dt>
          <dd>{voice ? voice.name : character.voicePrompt ? `По описанию: ${character.voicePrompt}` : "—"}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-400">Ниша</dt>
          <dd>
            {niche?.label}
            {character.nicheSubcategory ? ` — ${character.nicheSubcategory}` : ""}
            {character.nicheCustomText ? ` (${character.nicheCustomText})` : ""}
          </dd>
        </div>
      </dl>

      {character.status !== "READY" && (
        <Link
          href={`/characters/${character.id}/edit`}
          className="mt-8 inline-block rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand/90"
        >
          Продолжить настройку
        </Link>
      )}
    </main>
  );
}
