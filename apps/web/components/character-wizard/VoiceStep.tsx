"use client";

import { useState } from "react";
import type { CharacterDto, VoiceMode, VoiceOption } from "@studyon/shared";

export function VoiceStep({
  character,
  voices,
  onSaved,
  onBack,
}: {
  character: CharacterDto;
  voices: VoiceOption[];
  onSaved: (updated: CharacterDto) => void;
  onBack: () => void;
}) {
  const [voiceMode, setVoiceMode] = useState<VoiceMode>(character.voiceMode ?? "LIBRARY");
  const [voiceId, setVoiceId] = useState(character.voiceId ?? voices[0]?.id ?? "");
  const [voicePrompt, setVoicePrompt] = useState(character.voicePrompt ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const valid = voiceMode === "LIBRARY" ? Boolean(voiceId) : voicePrompt.trim().length > 0;

  async function handleNext() {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/characters/${character.id}/voice`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voiceMode,
          voiceId: voiceMode === "LIBRARY" ? voiceId : undefined,
          voicePrompt: voiceMode === "CUSTOM_PROMPT" ? voicePrompt : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Не удалось сохранить голос");
        return;
      }
      onSaved(data as CharacterDto);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Шаг 2 — Голос</h2>

      <div className="mt-4 flex gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="radio" checked={voiceMode === "LIBRARY"} onChange={() => setVoiceMode("LIBRARY")} />
          Готовый голос
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={voiceMode === "CUSTOM_PROMPT"}
            onChange={() => setVoiceMode("CUSTOM_PROMPT")}
          />
          Свой голос по описанию
        </label>
      </div>

      {voiceMode === "LIBRARY" ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {voices.map((v) => (
            <label
              key={v.id}
              className={`cursor-pointer rounded-lg border p-3 ${
                voiceId === v.id ? "border-brand bg-brand/10" : "border-slate-800 bg-slate-900/60"
              }`}
            >
              <input
                type="radio"
                name="voiceId"
                className="hidden"
                checked={voiceId === v.id}
                onChange={() => setVoiceId(v.id)}
              />
              <p className="font-medium">{v.name}</p>
              <p className="text-xs text-slate-400">{v.description}</p>
            </label>
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <label className="block text-sm text-slate-400" htmlFor="voice-prompt">
            Опишите желаемый голос (тембр, темп, характер)
          </label>
          <textarea
            id="voice-prompt"
            value={voicePrompt}
            onChange={(e) => setVoicePrompt(e.target.value)}
            maxLength={500}
            rows={3}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white"
            placeholder="Например: тёплый низкий мужской голос, спокойный темп, лёгкий акцент"
          />
          <p className="mt-1 text-xs text-slate-500">
            Синтез по описанию появится позже — сейчас описание сохраняется для будущей генерации.
          </p>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-slate-500"
        >
          Назад
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!valid || saving}
          className="rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand/90 disabled:opacity-50"
        >
          {saving ? "Сохраняем…" : "Далее"}
        </button>
      </div>
    </div>
  );
}
