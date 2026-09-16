import type { GenerationJobDto } from "@studyon/shared";

export function JobResult({ job }: { job: GenerationJobDto }) {
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
  if (job.resultText && job.type === "TEXT") {
    return (
      <p className="mt-2 whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-sm text-slate-700">
        {job.resultText}
      </p>
    );
  }
  return null;
}
