import type { FinancePoint, FinanceRange, FinanceSeries, FinanceSummary } from "@/types";

/*
 * Sample money numbers for Sunrise Residency.
 * The rent numbers here match the residents list, so every card tells the same story.
 */

const EXPECTED_RENT = 9_24_000;
const COLLECTED_RENT = 8_44_000;
const DUE_RENT = 52_000;
const OVERDUE_RENT = 28_000; // = 3 overdue residents in residents.ts

const MONTH_REVENUE = 9_20_000;
const MONTH_EXPENSES = 4_10_000;

/** A gentle, repeatable wave so the sample chart looks natural (no randomness = same picture every load). */
function wave(i: number, seed: number, speed: number) {
  return Math.sin(i * speed + seed) * 0.55 + Math.sin(i * speed * 0.35 + seed * 2.1) * 0.45;
}

/** Make a list of values that follow the wave and add up exactly to `total`. */
function spread(count: number, total: number, seed: number, swing: number, trend = 0) {
  const speed = count > 12 ? 0.42 : 0.9; // longer ranges move more slowly, so the line reads calmly
  const raw = Array.from({ length: count }, (_, i) => 1 + wave(i, seed, speed) * swing + (i / count) * trend);
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map((v) => Math.round((v / sum) * total));
}

const dayMonth = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });
const weekday = new Intl.DateTimeFormat("en-IN", { weekday: "short" });
const monthShort = new Intl.DateTimeFormat("en-IN", { month: "short" });
const monthLong = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" });

function buildSeries(range: FinanceRange, today: Date): FinanceSeries {
  let points: FinancePoint[] = [];

  if (range === "12m") {
    const revenue = spread(12, 98_40_000, 0.6, 0.06, 0.28);
    const expenses = spread(12, 46_20_000, 2.4, 0.08, 0.12);
    points = revenue.map((r, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - (11 - i), 1);
      return { label: monthShort.format(d), fullLabel: monthLong.format(d), revenue: r, expenses: expenses[i] };
    });
  }

  if (range === "30d") {
    const revenue = spread(30, MONTH_REVENUE, 1.2, 0.3);
    const expenses = spread(30, MONTH_EXPENSES, 3.1, 0.25);
    points = revenue.map((r, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (29 - i));
      return { label: dayMonth.format(d), fullLabel: dayMonth.format(d), revenue: r, expenses: expenses[i] };
    });
  }

  if (range === "7d") {
    const revenue = spread(7, 2_14_000, 0.4, 0.4);
    const expenses = spread(7, 96_000, 2.2, 0.35);
    points = revenue.map((r, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return {
        label: weekday.format(d),
        fullLabel: `${weekday.format(d)}, ${dayMonth.format(d)}`,
        revenue: r,
        expenses: expenses[i],
      };
    });
  }

  return {
    range,
    points,
    totalRevenue: points.reduce((a, p) => a + p.revenue, 0),
    totalExpenses: points.reduce((a, p) => a + p.expenses, 0),
  };
}

export function getFinanceSummary(today: Date): FinanceSummary {
  return {
    monthLabel: new Intl.DateTimeFormat("en-IN", { month: "long" }).format(today),
    revenue: MONTH_REVENUE,
    revenueChange: 12,
    expenses: MONTH_EXPENSES,
    netProfit: MONTH_REVENUE - MONTH_EXPENSES,
    netProfitChange: 4,
    expectedRent: EXPECTED_RENT,
    collectedRent: COLLECTED_RENT,
    dueRent: DUE_RENT,
    overdueRent: OVERDUE_RENT,
    collectionRate: Math.round((COLLECTED_RENT / EXPECTED_RENT) * 100),
    collectionChange: 6,
    series: {
      "12m": buildSeries("12m", today),
      "30d": buildSeries("30d", today),
      "7d": buildSeries("7d", today),
    },
  };
}
