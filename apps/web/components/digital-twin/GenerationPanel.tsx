"use client";

import { useEffect, useRef, useState } from "react";
import type { GenerationJobDto, GenerationJobType } from "@studyon/shared";
import { JobResult } from "@/components/content/JobResult";

const POLL_INTERVAL_MS = 3000;

const TYPE_LABELS: Record<GenerationJobType, string> = {
  PHOTO: "Фото",
  VIDEO: "Видео",
  TEXT: "Текст",
};

export function GenerationPanel({
  initialJobs,
  initialType = "PHOTO",
  types = ["PHOTO", "VIDEO"],
}: {
  initialJobs: GenerationJobDto[];
  initialType?: GenerationJobType;
  types?: GenerationJobType[];
}) {
  const [type, setType] = useState<GenerationJobType>(initialType);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [jobs, setJobs] = useState<GenerationJobDto[]>(initialJobs);
  const pollTimers = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  useEffect(() => {
    return () => {
      Object.values(pollTimers.current).forEach(clearInterval);
    };
  }, []);

  function pollJob(id: string) {
    pollTimers.current[id] = setInterval(async () => {
      const res = await fetch(`/api/generation-jobs/${id}`);
      if (!res.ok) return;
      const updated: GenerationJobDto = await res.json();
      setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)));
      if (updated.status === "READY" || updated.status === "FAILED") {
        clearInterval(pollTimers.current[id]);
        delete pollTimers.current[id];
      }
    }, POLL_INTERVAL_MS);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/digital-twin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, prompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Не удалось запустить генерацию");
        return;
      }
      const job = data as GenerationJobDto;
      setJobs((prev) => [job, ...prev]);
      if (job.status === "PENDING" || job.status === "PROCESSING") {
        pollJob(job.id);
      }
      setPrompt("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="max-w-xl space-y-4">
        {types.length > 1 && (
          <div className="flex gap-4 text-sm">
            {types.map((t) => (
              <label key={t} className="flex items-center gap-2">
                <input type="radio" checked={type === t} onChange={() => setType(t)} />
                {TYPE_LABELS[t]}
              </label>
            ))}
          </div>
        )}

        <div>
          <label className="block text-sm text-slate-500" htmlFor="gen-prompt">
            {type === "PHOTO"
              ? "Опишите, что нужно изменить"
              : type === "VIDEO"
                ? "Текст, который персонаж скажет"
                : "Тема поста"}
          </label>
          <textarea
            id="gen-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            maxLength={1000}
            rows={3}
            placeholder={
              type === "PHOTO"
                ? "Например: деловой костюм, лёгкий макияж, нейтральный фон"
                : type === "VIDEO"
                  ? "Например: расскажи, почему автоматизация экономит бизнесу время и деньги"
                  : "Например: 3 привычки, которые помогают держать форму при плотном графике"
            }
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand/90 disabled:opacity-50"
        >
          {submitting ? "Запускаем…" : "Сгенерировать"}
        </button>
      </form>

      {jobs.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-medium text-slate-500">Результаты</h3>
          {jobs.map((job) => (
            <div key={job.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">
                {TYPE_LABELS[job.type]} · {job.prompt}
              </p>
              <JobResult job={job} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
