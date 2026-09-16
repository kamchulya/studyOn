import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getCharacters } from "@/lib/characters";
import { CreateCharacterForm } from "@/components/character-wizard/CreateCharacterForm";

export default async function CharactersPage() {
  await requireUser();
  const characters = await getCharacters();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-2xl font-semibold text-slate-900">Мои персонажи</h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <CreateCharacterForm />
      </div>

      {characters.length === 0 ? (
        <p className="mt-8 text-slate-500">Персонажей пока нет — создайте первого выше.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((c) => (
            <Link
              key={c.id}
              href={c.status === "READY" ? `/characters/${c.id}` : `/characters/${c.id}/edit`}
              className="rounded-xl border border-slate-200 bg-white p-4 hover:border-brand"
            >
              {c.previewImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.previewImageUrl} alt={c.name} className="h-32 w-32 rounded-lg object-cover" />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                  нет превью
                </div>
              )}
              <p className="mt-3 font-medium text-slate-900">{c.name}</p>
              <p className="text-xs text-slate-500">{c.status === "READY" ? "Готов" : "Черновик"}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
