"use client";

import { useState } from "react";
import {
  BODY_TYPES,
  CLOTHING_STYLES,
  EYE_COLORS,
  FACIAL_HAIR_OPTIONS,
  HAIR_COLORS,
  HAIR_LENGTHS,
  LIPS_TYPES,
  NOSE_TYPES,
  type CharacterDto,
  type OptionDef,
} from "@studyon/shared";

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: OptionDef[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm text-slate-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900"
      >
        <option value="" disabled>
          Выберите…
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function AppearanceStep({
  character,
  onSaved,
}: {
  character: CharacterDto;
  onSaved: (updated: CharacterDto) => void;
}) {
  const [form, setForm] = useState({
    bodyType: character.bodyType ?? "",
    hairColor: character.hairColor ?? "",
    hairLength: character.hairLength ?? "",
    eyeColor: character.eyeColor ?? "",
    noseType: character.noseType ?? "",
    lipsType: character.lipsType ?? "",
    facialHair: character.facialHair ?? "",
    clothingStyle: character.clothingStyle ?? "",
  });
  const [previewUrl, setPreviewUrl] = useState(character.previewImageUrl);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(): Promise<CharacterDto | null> {
    setError(null);
    const body = {
      ...form,
      noseType: form.noseType || undefined,
      lipsType: form.lipsType || undefined,
      facialHair: form.facialHair || undefined,
    };
    const res = await fetch(`/api/characters/${character.id}/appearance`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message ?? "Не удалось сохранить внешность");
      return null;
    }
    return data as CharacterDto;
  }

  async function handlePreview() {
    setPreviewing(true);
    try {
      const saved = await save();
      if (!saved) return;
      const res = await fetch(`/api/characters/${character.id}/preview`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Не удалось сгенерировать превью");
        return;
      }
      setPreviewUrl(data.previewImageUrl);
    } finally {
      setPreviewing(false);
    }
  }

  async function handleNext() {
    setSaving(true);
    try {
      const saved = await save();
      if (saved) onSaved({ ...saved, previewImageUrl: previewUrl });
    } finally {
      setSaving(false);
    }
  }

  const requiredFilled =
    form.bodyType && form.hairColor && form.hairLength && form.eyeColor && form.clothingStyle;

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900">Шаг 1 — Внешность</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Select label="Комплекция" value={form.bodyType} options={BODY_TYPES} onChange={(v) => set("bodyType", v)} />
        <Select label="Цвет волос" value={form.hairColor} options={HAIR_COLORS} onChange={(v) => set("hairColor", v)} />
        <Select label="Длина волос" value={form.hairLength} options={HAIR_LENGTHS} onChange={(v) => set("hairLength", v)} />
        <Select label="Цвет глаз" value={form.eyeColor} options={EYE_COLORS} onChange={(v) => set("eyeColor", v)} />
        <Select label="Нос" value={form.noseType} options={NOSE_TYPES} onChange={(v) => set("noseType", v)} />
        <Select label="Губы" value={form.lipsType} options={LIPS_TYPES} onChange={(v) => set("lipsType", v)} />
        <Select
          label="Растительность на лице"
          value={form.facialHair}
          options={FACIAL_HAIR_OPTIONS}
          onChange={(v) => set("facialHair", v)}
        />
        <Select
          label="Стиль одежды"
          value={form.clothingStyle}
          options={CLOTHING_STYLES}
          onChange={(v) => set("clothingStyle", v)}
        />
      </div>

      <div className="mt-6 flex items-center gap-4">
        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="Превью персонажа" className="h-24 w-24 rounded-lg object-cover" />
        )}
        <button
          type="button"
          onClick={handlePreview}
          disabled={!requiredFilled || previewing}
          className="rounded-md border border-brand px-4 py-2 text-sm font-medium text-brand hover:bg-brand hover:text-white disabled:opacity-50"
        >
          {previewing ? "Генерируем…" : "Показать превью"}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleNext}
        disabled={!requiredFilled || saving}
        className="mt-6 rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand/90 disabled:opacity-50"
      >
        {saving ? "Сохраняем…" : "Далее"}
      </button>
    </div>
  );
}
