export enum PlanCode {
  ENTRY = "ENTRY",
  LITE = "LITE",
  PRO = "PRO",
  SCALE = "SCALE",
}

export interface PlanDefinition {
  code: PlanCode;
  title: string;
  /** Цена в тенге за месяц. Ориентировочная — не привязана к рублёвым цифрам roadmap.md, требует валидации перед запуском. */
  priceKztMonthly: number;
  tokensPerMonth: number;
  maxCharacters: number;
  video30sPerMonth: number;
  carouselsPerMonth: number;
  postsPerMonth: number;
}

// Структура (лимиты) взята из roadmap.md п.2.4, цены пересчитаны под тенге ориентировочно.
export const PLANS: PlanDefinition[] = [
  {
    code: PlanCode.ENTRY,
    title: "Entry",
    priceKztMonthly: 9900,
    tokensPerMonth: 240,
    maxCharacters: 1,
    video30sPerMonth: 4,
    carouselsPerMonth: 1,
    postsPerMonth: 1,
  },
  {
    code: PlanCode.LITE,
    title: "Lite",
    priceKztMonthly: 24900,
    tokensPerMonth: 920,
    maxCharacters: 1,
    video30sPerMonth: 16,
    carouselsPerMonth: 4,
    postsPerMonth: 4,
  },
  {
    code: PlanCode.PRO,
    title: "Pro",
    priceKztMonthly: 44900,
    tokensPerMonth: 1750,
    maxCharacters: 3,
    video30sPerMonth: 30,
    carouselsPerMonth: 8,
    postsPerMonth: 8,
  },
  {
    code: PlanCode.SCALE,
    title: "Scale",
    priceKztMonthly: 99900,
    tokensPerMonth: 5250,
    maxCharacters: 10,
    video30sPerMonth: 90,
    carouselsPerMonth: 24,
    postsPerMonth: 24,
  },
];

export function getPlan(code: PlanCode): PlanDefinition {
  const plan = PLANS.find((p) => p.code === code);
  if (!plan) {
    throw new Error(`Unknown plan code: ${code}`);
  }
  return plan;
}
