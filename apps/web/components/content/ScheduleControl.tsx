"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { GenerationJobDto } from "@studyon/shared";

export function ScheduleControl({ job }: { job: GenerationJobDto }) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function schedule(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;
    setSubmitting(true);
    try {
      await fetch(`/api/generation-jobs/${job.id}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduledFor: new Date(date).toISOString() }),
      });
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function unschedule() {
    setSubmitting(true);
    try {
      await fetch(`/api/generation-jobs/${job.id}/schedule`, { method: "DELETE" });
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  if (job.scheduledFor) {
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">
          Запланировано на {new Date(job.scheduledFor).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
        </span>
        <button
          onClick={unschedule}
          disabled={submitting}
          className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
        >
          Снять
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={schedule} className="flex items-center gap-2 text-sm">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-slate-900"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-md border border-brand px-3 py-1 font-medium text-brand hover:bg-brand hover:text-white disabled:opacity-50"
      >
        Запланировать
      </button>
    </form>
  );
}
