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

export default async function DigitalTwinPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  await requireUser();
  const twin = await getDigitalTwin();
  const initialType = searchParams.type === "video" ? "VIDEO" : "PHOTO";

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-2xl text-slate-900">Цифровой образ</h1>

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
            <GenerationPanel initialJobs={await getJobs()} initialType={initialType} />
          </div>
        </div>
      )}
    </main>
  );
}
