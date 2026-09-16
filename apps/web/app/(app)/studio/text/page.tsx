import { requireUser } from "@/lib/auth";
import { getGenerationJobs } from "@/lib/content";
import { GenerationPanel } from "@/components/digital-twin/GenerationPanel";

export default async function TextStudioPage() {
  await requireUser();
  const jobs = (await getGenerationJobs()).filter((j) => j.type === "TEXT");

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-2xl text-slate-900">Текстовые посты</h1>
      <p className="mt-1 text-slate-500">Опишите тему — получите готовый черновик поста</p>

      <div className="mt-8">
        <GenerationPanel initialJobs={jobs} initialType="TEXT" types={["TEXT"]} />
      </div>
    </main>
  );
}
