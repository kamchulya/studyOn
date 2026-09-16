"use client";

import { useState } from "react";
import { NICHE_CATEGORIES, type CharacterDto } from "@studyon/shared";

export function NicheStep({
  character,
  onCompleted,
  onBack,
}: {
  character: CharacterDto;
  onCompleted: (updated: CharacterDto) => void;
  onBack: () => void;
}) {
  const [category, setCategory] = useState(character.nicheCategory ?? "");
  const [subcategory, setSubcategory] = useState(character.nicheSubcategory ?? "");
  const [customText, setCustomText] = useState(character.nicheCustomText ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selectedCategory = NICHE_CATEGORIES.find((c) => c.id === category);

  async function handleFinish() {
    setError(null);
    setSaving(true);
    try {
      const nicheRes = await fetch(`/api/characters/${character.id}/niche`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nicheCategory: category,
          nicheSubcategory: subcategory || undefined,
          nicheCustomText: customText || undefined,
        }),
      });
      const nicheData = await nicheRes.json();
      if (!nicheRes.ok) {
        setError(nicheData.message ?? "Не удалось сохранить нишу");
        return;
      }

      const completeRes = await fetch(`/api/characters/${character.id}/complete`, { method: "POST" });
      const completeData = await completeRes.json();
      if (!completeRes.ok) {
        setError(completeData.message ?? "Не удалось завершить создание персонажа");
        return;
      }
      onCompleted(completeData as CharacterDto);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900">Шаг 3 — Ниша</h2>

      <div className="mt-4">
        <label className="block text-sm text-slate-500">Категория</label>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubcategory("");
          }}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900"
        >
          <option value="" disabled>
            Выберите…
          </option>
          {NICHE_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory && selectedCategory.subcategories.length > 0 && (
        <div className="mt-4">
          <label className="block text-sm text-slate-500">Под-специализация (необязательно)</label>
          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900"
          >
            <option value="">Не выбрано</option>
            {selectedCategory.subcategories.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-4">
        <label className="block text-sm text-slate-500" htmlFor="niche-custom">
          Своя ниша текстом (необязательно)
        </label>
        <input
          id="niche-custom"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          maxLength={300}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900"
          placeholder="Например: женский фитнес после 40"
        />
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:border-slate-400"
        >
          Назад
        </button>
        <button
          type="button"
          onClick={handleFinish}
          disabled={!category || saving}
          className="rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand/90 disabled:opacity-50"
        >
          {saving ? "Завершаем…" : "Готово"}
        </button>
      </div>
    </div>
  );
}
