import Link from "next/link";

const FORMATS = [
  {
    key: "video",
    label: "ВИДЕО",
    title: "Видео",
    description: "Короткие ролики с AI-аватаром для любой платформы",
    price: "от 52 токенов",
    href: "/digital-twin?type=video",
    ready: true,
  },
  {
    key: "photo",
    label: "ФОТО",
    title: "Фото",
    description: "Одно фото по брифу — с аватаром, товаром или выбранным фоном",
    price: "от 1 токена",
    href: "/digital-twin?type=photo",
    ready: true,
  },
  {
    key: "carousel",
    label: "КАРУСЕЛЬ",
    title: "Карусель",
    description: "Любая тема, разложенная по слайдам",
    price: "от 5 токенов",
    href: undefined,
    ready: false,
  },
  {
    key: "text",
    label: "ТЕКСТ",
    title: "Текст",
    description: "От короткого поста до лонгрида, с картинкой или без",
    price: "от 1 токена",
    href: "/studio/text",
    ready: true,
  },
];

export default function StudioPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-2xl text-slate-900">Студия</h1>
      <p className="mt-1 text-slate-500">Выберите формат контента для создания</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FORMATS.map((format) => {
          const card = (
            <div
              className={`flex h-56 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all ${
                format.ready ? "hover:border-brand hover:shadow-sm" : "opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
                  {format.label}
                </span>
                {!format.ready && (
                  <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
                    скоро
                  </span>
                )}
              </div>
              <div>
                <p className="font-display text-xl text-slate-900">{format.title}</p>
                <p className="mt-1 text-xs text-slate-500">{format.description}</p>
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <p className="text-xs font-medium text-slate-900">{format.price}</p>
                </div>
              </div>
            </div>
          );

          return format.ready && format.href ? (
            <Link key={format.key} href={format.href}>
              {card}
            </Link>
          ) : (
            <div key={format.key} className="cursor-not-allowed">
              {card}
            </div>
          );
        })}
      </div>
    </main>
  );
}
