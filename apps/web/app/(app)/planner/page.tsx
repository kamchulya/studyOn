import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getScheduledJobs } from "@/lib/content";
import { JobResult } from "@/components/content/JobResult";
import { ScheduleControl } from "@/components/content/ScheduleControl";

const TYPE_LABELS = { PHOTO: "Фото", VIDEO: "Видео", TEXT: "Текст" } as const;

export default async function PlannerPage() {
  await requireUser();
  const jobs = await getScheduledJobs();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-2xl text-slate-900">Планер</h1>
      <p className="mt-1 text-slate-500">Контент, у которого назначена дата публикации</p>

      {jobs.length === 0 ? (
        <p className="mt-8 text-slate-500">
          Ничего не запланировано — назначьте дату публикации в{" "}
          <Link href="/content" className="text-brand underline">
            Моём контенте
          </Link>
          .
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-900">
                  {job.scheduledFor &&
                    new Date(job.scheduledFor).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
                </p>
                <p className="text-xs text-slate-500">{TYPE_LABELS[job.type]}</p>
              </div>
              <p className="mt-1 text-xs text-slate-500">{job.prompt}</p>
              <JobResult job={job} />
              <div className="mt-3 border-t border-slate-100 pt-3">
                <ScheduleControl job={job} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
