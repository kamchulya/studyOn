export interface NavItem {
  label: string;
  href?: string;
  status: "ready" | "soon";
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Персонажи",
    items: [
      { label: "Создать персонажа", href: "/characters", status: "ready" },
      { label: "Мои персонажи", href: "/characters", status: "ready" },
      { label: "Цифровой образ", href: "/digital-twin", status: "ready" },
    ],
  },
  {
    title: "Контент",
    items: [
      { label: "Создать контент", href: "/studio", status: "ready" },
      { label: "Планер", href: "/planner", status: "ready" },
      { label: "Мой контент", href: "/content", status: "ready" },
    ],
  },
  {
    title: "Товары",
    items: [{ label: "Создать", status: "soon" }],
  },
  {
    title: "Управление",
    items: [
      { label: "Подписки", href: "/dashboard", status: "ready" },
      { label: "Рефералка", status: "soon" },
      { label: "Гайд по ИИ-блогерам", status: "soon" },
      { label: "Сообщество", status: "soon" },
    ],
  },
];
