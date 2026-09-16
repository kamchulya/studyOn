import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getGenerationJobs } from "@/lib/content";
import { JobResult } from "@/components/content/JobResult";
import { ScheduleControl } from "@/components/content/ScheduleControl";

const TYPE_LABELS = { PHOTO: "Фото", VIDEO: "Видео", TEXT: "Текст" } as const;

export default async function ContentPage() {
  await requireUser();
  const jobs = await getGenerationJobs();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-2xl text-slate-900">Мой контент</h1>
      <p className="mt-1 text-slate-500">Архив всей сгенерированной фото/видео/текстовой продукции</p>

      {jobs.length === 0 ? (
        <p className="mt-8 text-slate-500">
          Пока пусто — начните в{" "}
          <Link href="/studio" className="text-brand underline">
            Студии
          </Link>
          .
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  {TYPE_LABELS[job.type]} · {job.prompt}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date(job.createdAt).toLocaleDateString("ru-RU")}
                </p>
              </div>
              <JobResult job={job} />
              {job.status === "READY" && (
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <ScheduleControl job={job} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
