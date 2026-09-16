"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateCharacterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Не удалось создать персонажа");
        return;
      }
      router.push(`/characters/${data.id}/edit`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="block text-sm text-slate-400" htmlFor="character-name">
          Имя персонажа
        </label>
        <input
          id="character-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={80}
          placeholder="Например, Нурлан"
          className="mt-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand/90 disabled:opacity-50"
      >
        {loading ? "Создаём…" : "Создать персонажа"}
      </button>
      {error && <p className="w-full text-sm text-red-400">{error}</p>}
    </form>
  );
}
