export interface OptionDef {
  value: string;
  label: string;
}

export const BODY_TYPES: OptionDef[] = [
  { value: "slim", label: "Стройное" },
  { value: "athletic", label: "Спортивное" },
  { value: "average", label: "Среднее" },
  { value: "curvy", label: "Плотное" },
];

export const HAIR_COLORS: OptionDef[] = [
  { value: "black", label: "Чёрный" },
  { value: "brown", label: "Каштановый" },
  { value: "blonde", label: "Блонд" },
  { value: "red", label: "Рыжий" },
  { value: "gray", label: "Седой" },
];

export const HAIR_LENGTHS: OptionDef[] = [
  { value: "bald", label: "Лысый" },
  { value: "short", label: "Короткие" },
  { value: "medium", label: "Средние" },
  { value: "long", label: "Длинные" },
];

export const EYE_COLORS: OptionDef[] = [
  { value: "brown", label: "Карие" },
  { value: "blue", label: "Голубые" },
  { value: "green", label: "Зелёные" },
  { value: "gray", label: "Серые" },
];

export const NOSE_TYPES: OptionDef[] = [
  { value: "straight", label: "Прямой" },
  { value: "aquiline", label: "С горбинкой" },
  { value: "button", label: "Курносый" },
  { value: "wide", label: "Широкий" },
];

export const LIPS_TYPES: OptionDef[] = [
  { value: "thin", label: "Тонкие" },
  { value: "medium", label: "Средние" },
  { value: "full", label: "Пухлые" },
];

export const FACIAL_HAIR_OPTIONS: OptionDef[] = [
  { value: "none", label: "Нет" },
  { value: "stubble", label: "Щетина" },
  { value: "beard", label: "Борода" },
  { value: "mustache", label: "Усы" },
];

export const CLOTHING_STYLES: OptionDef[] = [
  { value: "sportswear", label: "Спортивная одежда" },
  { value: "casual", label: "Кэжуал" },
  { value: "business", label: "Деловой стиль" },
  { value: "streetwear", label: "Стритвир" },
];

export interface VoiceOption {
  id: string;
  name: string;
  gender: "male" | "female";
  description: string;
}

export const VOICE_LIBRARY: VoiceOption[] = [
  { id: "aidos", name: "Айдос", gender: "male", description: "Энергичный, уверенный — тренер, мотиватор" },
  { id: "aigerim", name: "Айгерим", gender: "female", description: "Тёплый, спокойный — коуч, психолог" },
  { id: "arman", name: "Арман", gender: "male", description: "Глубокий, размеренный — эксперт, бизнес" },
  { id: "dana", name: "Дана", gender: "female", description: "Живой, дружелюбный — блогер, лайфстайл" },
  { id: "nurlan", name: "Нурлан", gender: "male", description: "Молодой, динамичный — фитнес, спорт" },
  { id: "saltanat", name: "Салтанат", gender: "female", description: "Мягкий, вдохновляющий — нутрициолог, велнес" },
];

export interface NicheCategoryDef {
  id: string;
  label: string;
  subcategories: string[];
}

export const NICHE_CATEGORIES: NicheCategoryDef[] = [
  { id: "fitness", label: "Фитнес и спорт", subcategories: ["Персональный тренинг", "Групповые тренировки", "Йога и растяжка", "Бодибилдинг"] },
  { id: "health", label: "Здоровье и нутрициология", subcategories: ["Питание", "Похудение", "Велнес"] },
  { id: "coaching", label: "Лайф-коучинг и продуктивность", subcategories: ["Целеполагание", "Тайм-менеджмент", "Карьерный коучинг"] },
  { id: "psychology", label: "Психология и осознанность", subcategories: ["Медитация", "Отношения", "Личная терапия"] },
  { id: "beauty", label: "Бьюти и уход", subcategories: ["Уход за кожей", "Макияж", "Волосы"] },
  { id: "style", label: "Мода и стиль", subcategories: ["Стилист", "Шопинг-гид"] },
  { id: "travel", label: "Путешествия", subcategories: ["Бюджетные поездки", "Люкс-туризм"] },
  { id: "family", label: "Семья и родительство", subcategories: ["Воспитание детей", "Многодетные семьи"] },
  { id: "finance", label: "Финансы и инвестиции", subcategories: ["Личные финансы", "Инвестиции"] },
  { id: "business", label: "Бизнес и предпринимательство", subcategories: ["Малый бизнес", "Маркетинг"] },
  { id: "other", label: "Другое", subcategories: [] },
];
