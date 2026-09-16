import { requireUser } from "@/lib/auth";
import { PlanPicker } from "@/components/PlanPicker";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-2xl text-slate-900">Привет, {user.email}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-8 text-slate-600">
        <p>
          Баланс токенов: <span className="font-semibold text-slate-900">{user.tokensBalance}</span>
        </p>
        <p>
          Текущий тариф:{" "}
          <span className="font-semibold text-slate-900">{user.activePlan ?? "нет активной подписки"}</span>
        </p>
      </div>

      <h2 className="mt-10 text-lg font-semibold text-slate-900">Тарифы</h2>
      <div className="mt-4">
        <PlanPicker activePlan={user.activePlan} />
      </div>
    </main>
  );
}
