"use client";

import { useEffect, useRef, useState } from "react";
import type { GenerationJobDto, GenerationJobType } from "@studyon/shared";

const POLL_INTERVAL_MS = 3000;

function JobResult({ job }: { job: GenerationJobDto }) {
  if (job.status === "PENDING" || job.status === "PROCESSING") {
    return <p className="text-sm text-slate-500">Генерируем… ({job.status === "PENDING" ? "в очереди" : "в процессе"})</p>;
  }
  if (job.status === "FAILED") {
    return <p className="text-sm text-red-600">{job.errorMessage ?? "Генерация завершилась ошибкой"}</p>;
  }
  if (job.resultUrl && job.type === "PHOTO") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={job.resultUrl} alt="Результат генерации" className="mt-2 max-h-96 rounded-lg" />;
  }
  if (job.resultUrl && job.type === "VIDEO") {
    return <video src={job.resultUrl} controls className="mt-2 max-h-96 rounded-lg" />;
  }
  return null;
}

export function GenerationPanel({
  initialJobs,
  initialType = "PHOTO",
}: {
  initialJobs: GenerationJobDto[];
  initialType?: GenerationJobType;
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
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" checked={type === "PHOTO"} onChange={() => setType("PHOTO")} />
            Фото
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={type === "VIDEO"} onChange={() => setType("VIDEO")} />
            Видео
          </label>
        </div>

        <div>
          <label className="block text-sm text-slate-500" htmlFor="gen-prompt">
            {type === "PHOTO" ? "Опишите, что нужно изменить" : "Текст, который персонаж скажет"}
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
                : "Например: расскажи, почему автоматизация экономит бизнесу время и деньги"
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
                {job.type === "PHOTO" ? "Фото" : "Видео"} · {job.prompt}
              </p>
              <JobResult job={job} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
