import Link from "next/link";
import { PLANS, PlanCode } from "@studyon/shared";
import { Faq } from "@/components/Faq";

const kzt = new Intl.NumberFormat("ru-KZ", { maximumFractionDigits: 0 });

const PROCESS_STEPS = [
  {
    n: "01",
    title: "Персонаж",
    tagline: "ВНЕШНОСТЬ, ГОЛОС, НИША",
    description: "Выберите внешность и голос или загрузите свои фото — за пару минут, без камеры.",
  },
  {
    n: "02",
    title: "Бриф",
    tagline: "ЧТО СКАЗАТЬ И КАК ВЫГЛЯДЕТЬ",
    description: "Опишите текстом: тема ролика, стиль одежды, настроение — StudyOn понимает обычный язык.",
  },
  {
    n: "03",
    title: "Генерация",
    tagline: "ВИДЕО, ФОТО, ТЕКСТ",
    description: "AI собирает результат: говорящее видео, фото по брифу или карусель для соцсетей.",
  },
  {
    n: "04",
    title: "Публикация",
    tagline: "ГОТОВО К ПОСТУ",
    description: "Скачайте готовый файл и публикуйте — без монтажёра и студии.",
  },
];

const PRICE_COMPARISON = [
  { label: "Видеограф-фрилансер", value: "~25 000 ₸", note: "за один ролик" },
  { label: "Продакшн-агентство", value: "~80 000 ₸", note: "за один ролик" },
  { label: "StudyOn, тариф Entry", value: "~2 500 ₸", note: "за один ролик" },
];

export default function LandingPage() {
  return (
    <main className="bg-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-8">
        <span className="text-xl font-semibold text-brand">StudyOn</span>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="#pricing" className="text-slate-600 hover:text-slate-900">
            Тарифы
          </Link>
          <Link href="#faq" className="text-slate-600 hover:text-slate-900">
            Вопросы
          </Link>
          <Link href="/login" className="text-slate-600 hover:text-slate-900">
            Войти
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-brand px-5 py-2 font-medium text-white hover:bg-brand/90"
          >
            Начать бесплатно
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-6 pb-24 pt-12 text-center">
        <h1 className="font-display text-4xl leading-tight text-slate-900 sm:text-6xl">
          Контент для тренеров и коучей,{" "}
          <span className="italic text-brand">который не требует камеры</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-slate-500">
          Соберите своего цифрового аватара один раз — голос, внешность, экспертиза — и получайте
          говорящие видео, фото, карусели и посты под свою нишу каждый день.
        </p>
        <Link
          href="/register"
          className="mt-8 inline-block rounded-full bg-brand px-8 py-3 text-lg font-medium text-white hover:bg-brand/90"
        >
          Собрать своего аватара
        </Link>
      </section>

      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
            Как устроено
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Четыре шага до готового контента</h2>

          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step) => (
              <div key={step.n}>
                <span className="font-display text-5xl text-white/15">{step.n}</span>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-widest text-brand">
                  {step.tagline}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
          Сколько стоит ролик
        </p>
        <h2 className="mt-3 font-display text-3xl text-slate-900 sm:text-4xl">
          В десятки раз дешевле съёмки
        </h2>
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {PRICE_COMPARISON.map((row, i) => (
            <div
              key={row.label}
              className={`rounded-2xl border p-8 ${
                i === 2 ? "border-brand bg-brand-light/40" : "border-slate-200"
              }`}
            >
              <p className="font-display text-3xl text-slate-900">{row.value}</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{row.label}</p>
              <p className="mt-1 text-xs text-slate-400">{row.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-slate-400">
          Оценка по рыночным ставкам в РК и себестоимости 30-секундного видео на тарифе Entry —
          ориентир, а не гарантированная цена.
        </p>
      </section>

      <section id="pricing" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-center text-xs font-medium uppercase tracking-widest text-slate-400">
            Тарифы
          </p>
          <h2 className="mt-3 text-center font-display text-3xl text-slate-900 sm:text-4xl">
            Выберите объём
          </h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => {
              const isHero = plan.code === PlanCode.PRO;
              return (
                <div
                  key={plan.code}
                  className={`flex flex-col rounded-2xl p-6 ${
                    isHero
                      ? "bg-slate-950 text-white"
                      : "border border-slate-200 bg-white text-slate-900"
                  }`}
                >
                  <h3 className="text-sm font-medium uppercase tracking-wide opacity-70">
                    {plan.title}
                  </h3>
                  <p className="mt-3 font-display text-3xl">
                    {kzt.format(plan.priceKztMonthly)} ₸
                    <span className={`text-sm font-sans font-normal ${isHero ? "text-white/60" : "text-slate-500"}`}>
                      {" "}/мес
                    </span>
                  </p>
                  <ul className={`mt-5 flex-1 space-y-2 text-sm ${isHero ? "text-white/70" : "text-slate-500"}`}>
                    <li>{plan.tokensPerMonth} токенов/мес</li>
                    <li>{plan.maxCharacters} {plan.maxCharacters === 1 ? "персонаж" : "персонажа"}</li>
                    <li>{plan.video30sPerMonth} видео по 30с</li>
                    <li>{plan.carouselsPerMonth} каруселей</li>
                    <li>{plan.postsPerMonth} постов</li>
                  </ul>
                  {isHero ? (
                    <Link
                      href="/register"
                      className="mt-6 rounded-full bg-white px-4 py-2 text-center text-sm font-medium text-slate-950 hover:bg-white/90"
                    >
                      Выбрать Pro
                    </Link>
                  ) : (
                    <Link
                      href="/register"
                      className="mt-6 text-sm font-medium text-brand hover:underline"
                    >
                      Выбрать →
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-5xl px-6 py-24">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-slate-400">
          Честные ответы
        </p>
        <h2 className="mt-3 text-center font-display text-3xl text-slate-900 sm:text-4xl">
          Частые вопросы
        </h2>
        <div className="mt-14">
          <Faq />
        </div>
      </section>

      <footer className="border-t border-slate-200 py-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} StudyOn</span>
          <div className="flex gap-6">
            <Link href="#pricing" className="hover:text-slate-600">
              Тарифы
            </Link>
            <Link href="#faq" className="hover:text-slate-600">
              Вопросы
            </Link>
            <Link href="/register" className="hover:text-slate-600">
              Начать
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
