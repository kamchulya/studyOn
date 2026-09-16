"use client";

import { useState } from "react";
import { PLANS, PlanCode } from "@studyon/shared";

const kzt = new Intl.NumberFormat("ru-KZ", { maximumFractionDigits: 0 });

export function PlanPicker({ activePlan }: { activePlan: PlanCode | null }) {
  const [loadingPlan, setLoadingPlan] = useState<PlanCode | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function subscribe(plan: PlanCode) {
    setError(null);
    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/billing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Не удалось создать подписку");
        return;
      }
      window.location.href = data.paymentUrl;
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {PLANS.map((plan) => {
        const isActive = plan.code === activePlan;
        return (
          <div key={plan.code} className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-slate-900">{plan.title}</h3>
            <p className="mt-1 text-2xl font-bold text-slate-900">{kzt.format(plan.priceKztMonthly)} ₸</p>
            <button
              onClick={() => subscribe(plan.code)}
              disabled={isActive || loadingPlan !== null}
              className="mt-4 w-full rounded-md bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-50"
            >
              {isActive ? "Активен" : loadingPlan === plan.code ? "Подождите…" : "Оформить"}
            </button>
          </div>
        );
      })}
      {error && <p className="col-span-full text-sm text-red-600">{error}</p>}
    </div>
  );
}
