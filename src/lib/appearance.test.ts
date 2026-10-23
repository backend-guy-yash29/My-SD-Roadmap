import { describe, expect, it } from "vitest";
import {
  appearanceCss,
  contrast,
  DEFAULT_APPEARANCE,
  PALETTES,
  readAppearance,
  resolvedTokens,
} from "./appearance";

describe("appearance", () => {
  it("defaults to Crisp Indigo following the device mode", () => {
    expect(DEFAULT_APPEARANCE).toEqual({
      palette: "crisp",
      mode: "system",
      font: "inter",
      size: "m",
      colors: { light: {}, dark: {} },
    });
  });

  it("fills missing fields and falls back on invalid input", () => {
    expect(readAppearance({ palette: "slate" })).toMatchObject({ palette: "slate", font: "inter" });
    expect(readAppearance({ palette: "neon" })).toEqual(DEFAULT_APPEARANCE);
    expect(readAppearance({ colors: { dark: { heading: "red" } } })).toEqual(DEFAULT_APPEARANCE);
    expect(readAppearance(null)).toEqual(DEFAULT_APPEARANCE);
  });

  it("generates rules for every palette, font and size", () => {
    const css = appearanceCss();
    expect(css).toContain(`:root{--bg:${PALETTES[0].light.bg}`);
    for (const p of PALETTES.slice(1))
      expect(css).toContain(`[data-palette="${p.id}"][data-theme="dim"]`);
    expect(css).toContain(`:root[data-font="serif"]{--font-body:var(--font-serif)}`);
    expect(css).toContain(`:root[data-size="l"]{font-size:112.5%}`);
  });

  it("applies custom colours per mode with readable button text", () => {
    const a = readAppearance({ colors: { dark: { heading: "#ffd700", accent: "#facc15" } } });
    expect(resolvedTokens(a, "light").heading).toBe(PALETTES[0].light.ink);
    const dark = resolvedTokens(a, "dark");
    expect([dark.heading, dark.accent, dark["accent-ink"]]).toEqual([
      "#ffd700",
      "#facc15",
      "#111111",
    ]);
    expect(
      resolvedTokens(readAppearance({ colors: { light: { accent: "#1e3a8a" } } }), "light")[
        "accent-ink"
      ],
    ).toBe("#ffffff");
  });

  it("keeps every palette's text readable", () => {
    for (const p of PALETTES)
      for (const t of [p.light, p.dark]) {
        expect(contrast(t.ink, t.surface)).toBeGreaterThanOrEqual(7);
        expect(contrast(t["ink-2"], t.surface)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(t.accent, t.surface)).toBeGreaterThanOrEqual(3);
      }
  });
});
