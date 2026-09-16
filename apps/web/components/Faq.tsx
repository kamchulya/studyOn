const QUESTIONS = [
  {
    q: "Кому принадлежит цифровой образ?",
    a: "Вам. Загруженные фото и голос используются только для генерации вашего контента и не передаются другим пользователям платформы.",
  },
  {
    q: "Что происходит с токенами при отмене подписки?",
    a: "Уже начисленные токены остаются доступны до конца оплаченного периода. Новые токены при отмене не начисляются, но ничего не сгорает досрочно.",
  },
  {
    q: "Как хранятся моё фото и голос?",
    a: "Только после того, как вы явно даёте согласие на загрузку в конструкторе цифрового образа. Файлы используются исключительно для генерации вашего контента.",
  },
  {
    q: "Можно ли сменить тариф?",
    a: "Да, в любой момент из личного кабинета — новый лимит токенов и персонажей начинает действовать со следующего расчётного периода.",
  },
];

export function Faq() {
  return (
    <div className="mx-auto max-w-2xl divide-y divide-slate-200">
      {QUESTIONS.map((item) => (
        <details key={item.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between text-left font-medium text-slate-900">
            {item.q}
            <span className="ml-4 shrink-0 text-slate-400 transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
