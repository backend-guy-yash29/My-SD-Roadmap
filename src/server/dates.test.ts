import { describe, expect, it } from "vitest";
import { addDays, isValidTimezone, localDate, streaks } from "./dates";

describe("localDate", () => {
  it("uses the user's timezone", () => {
    const instant = new Date("2026-03-01T20:30:00Z");
    expect(localDate(instant, "UTC")).toBe("2026-03-01");
    expect(localDate(instant, "Asia/Kolkata")).toBe("2026-03-02");
    expect(localDate(instant, "America/Los_Angeles")).toBe("2026-03-01");
  });
});

describe("isValidTimezone", () => {
  it("accepts IANA names only", () => {
    expect(isValidTimezone("Asia/Kolkata")).toBe(true);
    expect(isValidTimezone("Mars/Base")).toBe(false);
  });
});

describe("addDays", () => {
  it("crosses month and year boundaries", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });
});

describe("streaks", () => {
  it("counts back from today", () => {
    expect(streaks(["2026-05-08", "2026-05-09", "2026-05-10"], "2026-05-10").current).toBe(3);
  });
  it("stays alive through today when the last study day was yesterday", () => {
    expect(streaks(["2026-05-08", "2026-05-09"], "2026-05-10").current).toBe(2);
  });
  it("breaks after a missed day", () => {
    expect(streaks(["2026-05-07", "2026-05-08"], "2026-05-10").current).toBe(0);
  });
  it("tracks the longest run", () => {
    const days = ["2026-01-01", "2026-01-02", "2026-01-03", "2026-02-10", "2026-02-11"];
    expect(streaks(days, "2026-02-11")).toEqual({ current: 2, longest: 3 });
  });
  it("is zero with no study days", () => {
    expect(streaks([], "2026-02-11")).toEqual({ current: 0, longest: 0 });
  });
});
