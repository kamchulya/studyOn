import Link from "next/link";
import { PLANS } from "@studyon/shared";

const kzt = new Intl.NumberFormat("ru-KZ", { maximumFractionDigits: 0 });

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="flex items-center justify-between pb-16">
        <span className="text-xl font-semibold text-brand">StudyOn</span>
        <nav className="flex gap-4 text-sm">
          <Link href="/login" className="text-slate-600 hover:text-slate-900">
            Войти
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand/90"
          >
            Начать бесплатно
          </Link>
        </nav>
      </header>

      <section className="pb-20 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
          Постоянный поток контента для тренеров, коучей и блогеров — без камеры и монтажёра
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
          Соберите своего цифрового аватара один раз — голос, внешность, экспертиза — и получайте
          говорящие видео, фото, карусели и посты под свою нишу каждый день.
        </p>
        <Link
          href="/register"
          className="mt-8 inline-block rounded-md bg-brand px-6 py-3 text-lg font-medium text-white hover:bg-brand/90"
        >
          Собрать своего аватара
        </Link>
      </section>

      <section id="pricing" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <div
            key={plan.code}
            className="flex flex-col rounded-xl border border-slate-200 bg-white p-6"
          >
            <h3 className="text-lg font-semibold text-slate-900">{plan.title}</h3>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {kzt.format(plan.priceKztMonthly)} ₸<span className="text-base font-normal text-slate-500">/мес</span>
            </p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-500">
              <li>{plan.tokensPerMonth} токенов/мес</li>
              <li>{plan.maxCharacters} {plan.maxCharacters === 1 ? "персонаж" : "персонажа"}</li>
              <li>{plan.video30sPerMonth} видео по 30с</li>
              <li>{plan.carouselsPerMonth} каруселей</li>
              <li>{plan.postsPerMonth} постов</li>
            </ul>
            <Link
              href="/register"
              className="mt-6 rounded-md border border-brand px-4 py-2 text-center text-sm font-medium text-brand hover:bg-brand hover:text-white"
            >
              Выбрать
            </Link>
          </div>
        ))}
      </section>
    </main>
  );
}
