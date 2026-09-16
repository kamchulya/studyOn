import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { PlanPicker } from "@/components/PlanPicker";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Привет, {user.email}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-8 text-slate-300">
        <p>
          Баланс токенов: <span className="font-semibold text-white">{user.tokensBalance}</span>
        </p>
        <p>
          Текущий тариф:{" "}
          <span className="font-semibold text-white">{user.activePlan ?? "нет активной подписки"}</span>
        </p>
        <Link
          href="/characters"
          className="rounded-md border border-brand px-4 py-2 text-sm font-medium text-brand hover:bg-brand hover:text-white"
        >
          Мои персонажи
        </Link>
      </div>

      <h2 className="mt-10 text-lg font-semibold">Тарифы</h2>
      <div className="mt-4">
        <PlanPicker activePlan={user.activePlan} />
      </div>
    </main>
  );
}
