// Shared helpers for opening hours (used by DoctorSpace and PartnersDirectory)

export interface DayHours {
  open: string; // "HH:mm"
  close: string; // "HH:mm"
}

// Keyed by JS weekday number (0 = Sunday, 1 = Monday, … 6 = Saturday)
export type WeeklyHours = Record<number, DayHours>;

// Display order starting on Monday
export const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

// Localized full day name for a JS weekday number
export function dayName(locale: string, dayNum: number): string {
  const base = new Date();
  base.setDate(base.getDate() + ((dayNum - base.getDay() + 7) % 7));
  return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(base);
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// "Lundi – Vendredi" style label, localized through Intl
export function formatDays(locale: string, days: number[]): string {
  const sorted = [...days].sort((a, b) => a - b);
  const isRange = sorted.every((d, i) => i === 0 || d === sorted[i - 1] + 1);
  if (isRange) {
    if (sorted.length === 1) return capitalize(dayName(locale, sorted[0]));
    return `${capitalize(dayName(locale, sorted[0]))} – ${capitalize(dayName(locale, sorted[sorted.length - 1]))}`;
  }
  return sorted.map((d) => capitalize(dayName(locale, d))).join(", ");
}

export function formatTime(locale: string, t: string): string {
  const [h, m] = t.split(":").map(Number);
  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(new Date(2026, 0, 1, h, m));
}

// Convert a per-day map into compact entries grouping consecutive days with identical hours
export function mergeDays(hours: WeeklyHours): { days: number[]; open: string; close: string }[] {
  const result: { days: number[]; open: string; close: string }[] = [];
  for (const day of DAY_ORDER) {
    const h = hours[day];
    if (!h) continue;
    const last = result[result.length - 1];
    if (
      last &&
      last.open === h.open &&
      last.close === h.close &&
      last.days[last.days.length - 1] === day - 1
    ) {
      last.days.push(day);
    } else {
      result.push({ days: [day], open: h.open, close: h.close });
    }
  }
  return result;
}

// Convert grouped entries back into a per-day map
export function hoursToMap(entries: { days: number[]; open: string; close: string }[]): WeeklyHours {
  const map: WeeklyHours = {};
  for (const e of entries) {
    for (const d of e.days) {
      map[d] = { open: e.open, close: e.close };
    }
  }
  return map;
}

export function getOpenStatus(hours: { days: number[]; open: string; close: string }[]) {
  const now = new Date();
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const openToday = hours.some((h) => h.days.includes(day));
  const openNow = hours.some((h) => {
    if (!h.days.includes(day)) return false;
    const [oh, om] = h.open.split(":").map(Number);
    const [ch, cm] = h.close.split(":").map(Number);
    return minutes >= oh * 60 + om && minutes < ch * 60 + cm;
  });
  return { openToday, openNow };
}
