"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function MockCheckout() {
  const router = useRouter();
  const params = useSearchParams();
  const paymentId = params.get("paymentId");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function confirm() {
    if (!paymentId) return;
    setStatus("loading");
    const res = await fetch("/api/billing/mock-confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId }),
    });
    if (!res.ok) {
      setStatus("error");
      return;
    }
    setStatus("done");
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 800);
  }

  return (
    <main className="mx-auto mt-24 max-w-sm rounded-xl border border-slate-200 bg-white p-8 text-center">
      <h1 className="text-xl font-semibold text-slate-900">Тестовая оплата (Kaspi Pay — заглушка)</h1>
      <p className="mt-2 text-sm text-slate-500">
        В проде здесь будет реальный экран Kaspi Pay. Пока используется мок-провайдер для проверки
        сквозного сценария.
      </p>
      <button
        onClick={confirm}
        disabled={status === "loading" || status === "done"}
        className="mt-6 w-full rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand/90 disabled:opacity-50"
      >
        {status === "loading" && "Подтверждаем…"}
        {status === "done" && "Оплачено ✓"}
        {status === "error" && "Ошибка, попробуйте снова"}
        {status === "idle" && "Подтвердить оплату"}
      </button>
    </main>
  );
}

export default function MockCheckoutPage() {
  return (
    <Suspense>
      <MockCheckout />
    </Suspense>
  );
}
