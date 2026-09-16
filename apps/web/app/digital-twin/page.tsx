import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getDigitalTwin } from "@/lib/digitalTwin";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { ConsentUploadForm } from "@/components/digital-twin/ConsentUploadForm";
import { GenerationPanel } from "@/components/digital-twin/GenerationPanel";
import type { GenerationJobDto } from "@studyon/shared";

async function getJobs(): Promise<GenerationJobDto[]> {
  const token = getAccessToken();
  if (!token) return [];
  const res = await apiFetch("/generation-jobs", { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return [];
  return res.json();
}

export default async function DigitalTwinPage() {
  await requireUser();
  const twin = await getDigitalTwin();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Цифровой образ</h1>
        <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white">
          ← Дашборд
        </Link>
      </div>

      {!twin ? (
        <div className="mt-8">
          <ConsentUploadForm />
        </div>
      ) : (
        <div className="mt-8">
          <div className="flex gap-3">
            {twin.sourcePhotoUrls.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={url} src={url} alt="Ваше фото" className="h-24 w-24 rounded-lg object-cover" />
            ))}
          </div>
          <div className="mt-8">
            <GenerationPanel initialJobs={await getJobs()} />
          </div>
        </div>
      )}
    </main>
  );
}
