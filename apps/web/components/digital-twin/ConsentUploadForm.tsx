"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ConsentUploadForm() {
  const router = useRouter();
  const [consent, setConsent] = useState(false);
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [voice, setVoice] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!consent) {
      setError("Нужно подтвердить согласие на обработку фото/голоса");
      return;
    }
    if (!photos || photos.length === 0) {
      setError("Загрузите хотя бы одно фото");
      return;
    }

    const formData = new FormData();
    formData.set("consent", "true");
    Array.from(photos)
      .slice(0, 3)
      .forEach((file) => formData.append("photos", file));
    if (voice && voice.length > 0) {
      formData.append("voice", voice[0]);
    }

    setLoading(true);
    try {
      const res = await fetch("/api/digital-twin", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Не удалось загрузить файлы");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-5">
      <div className="rounded-lg border border-amber-700/50 bg-amber-950/30 p-4 text-sm text-amber-200">
        <p className="font-medium">Согласие на обработку биометрии</p>
        <p className="mt-1 text-amber-200/80">
          Загружая своё фото и голос, вы подтверждаете, что это именно вы (или у вас есть явное согласие
          человека на фото/голосе), и разрешаете обработку этих данных для генерации фото и видео с вашим
          цифровым образом. Это персональные данные специальной категории — без явного согласия мы их не
          используем.
        </p>
        <label className="mt-3 flex items-center gap-2">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          Подтверждаю и даю согласие
        </label>
      </div>

      <div>
        <label className="block text-sm text-slate-400">Ваши фото (до 3)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setPhotos(e.target.files)}
          className="mt-1 block w-full text-sm text-slate-300"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-400">Ваш голос — аудиофайл (необязательно)</label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setVoice(e.target.files)}
          className="mt-1 block w-full text-sm text-slate-300"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand/90 disabled:opacity-50"
      >
        {loading ? "Загружаем…" : "Сохранить цифровой образ"}
      </button>
    </form>
  );
}
