import Link from "next/link";

const FORMATS = [
  {
    key: "video",
    title: "Видео",
    description: "Короткие ролики с AI-аватаром для любой платформы",
    price: "от 52 токенов",
    href: "/digital-twin?type=video",
    icon: "🎬",
    ready: true,
  },
  {
    key: "photo",
    title: "Фото",
    description: "Одно фото по брифу — с аватаром, товаром или выбранным фоном",
    price: "от 1 токена",
    href: "/digital-twin?type=photo",
    icon: "📷",
    ready: true,
  },
  {
    key: "carousel",
    title: "Карусель",
    description: "Любая тема, разложенная по слайдам",
    price: "от 5 токенов",
    href: undefined,
    icon: "🗂️",
    ready: false,
  },
  {
    key: "text",
    title: "Текст",
    description: "От короткого поста до лонгрида, с картинкой или без",
    price: "от 1 токена",
    href: undefined,
    icon: "📝",
    ready: false,
  },
];

export default function StudioPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-2xl font-semibold text-slate-900">Студия</h1>
      <p className="mt-1 text-slate-500">Выберите формат контента для создания</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FORMATS.map((format) => {
          const card = (
            <div
              className={`flex h-56 flex-col justify-between rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-light to-white p-5 transition-shadow ${
                format.ready ? "hover:shadow-md" : "opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{format.icon}</span>
                {!format.ready && (
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-slate-500">
                    скоро
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{format.title}</p>
                <p className="mt-1 text-xs text-slate-500">{format.description}</p>
                <p className="mt-3 text-xs font-medium text-brand">{format.price}</p>
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
