/** A calendar date as "YYYY-MM-DD". */
export type LocalDate = string;

export function isValidTimezone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** The calendar date of `instant` in the IANA timezone `tz`. */
export function localDate(instant: Date, tz: string): LocalDate {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function addDays(date: LocalDate, days: number): LocalDate {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Streaks over study days (dates with at least one first completion).
 * The current streak ends today, or yesterday if today has no completion yet.
 */
export function streaks(studyDays: Iterable<LocalDate>, today: LocalDate) {
  const days = new Set(studyDays);
  let current = 0;
  let cursor = days.has(today) ? today : addDays(today, -1);
  while (days.has(cursor)) {
    current++;
    cursor = addDays(cursor, -1);
  }
  let longest = 0;
  let run = 0;
  let prev: LocalDate | null = null;
  for (const day of [...days].sort()) {
    run = prev !== null && addDays(prev, 1) === day ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = day;
  }
  return { current, longest };
}
