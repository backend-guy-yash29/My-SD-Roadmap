import { z } from "zod";

// Shared by the server (validation, generated CSS) and the browser (settings, theme toggle).

export type Tokens = Record<
  | "bg"
  | "surface"
  | "surface-2"
  | "border"
  | "border-2"
  | "ink"
  | "ink-2"
  | "ink-3"
  | "accent"
  | "accent-2"
  | "accent-ink"
  | "accent-soft"
  | "done"
  | "done-soft"
  | "danger",
  string
>;

export const PALETTES = [
  {
    id: "crisp",
    name: "Crisp Indigo",
    description: "Indigo accent, firm contrast, deep charcoal dark mode.",
    light: {
      bg: "#f3f3f0",
      surface: "#ffffff",
      "surface-2": "#eeede8",
      border: "#dfddd5",
      "border-2": "#c9c6bc",
      ink: "#121211",
      "ink-2": "#43423c",
      "ink-3": "#68675f",
      accent: "#4338ca",
      "accent-2": "#7e22ce",
      "accent-ink": "#ffffff",
      "accent-soft": "#e8eaff",
      done: "#15803d",
      "done-soft": "#e2f3e7",
      danger: "#b91c1c",
    },
    dark: {
      bg: "#111318",
      surface: "#1a1d24",
      "surface-2": "#22262f",
      border: "#2d323d",
      "border-2": "#3d4351",
      ink: "#f4f5f8",
      "ink-2": "#c5cad5",
      "ink-3": "#959dac",
      accent: "#9d9eff",
      "accent-2": "#d2a6ff",
      "accent-ink": "#11122a",
      "accent-soft": "#272a52",
      done: "#4ade80",
      "done-soft": "#16301e",
      danger: "#f87171",
    },
  },
  {
    id: "classic",
    name: "Classic",
    description: "The original look: soft off-white and a blue-grey dark mode.",
    light: {
      bg: "#f7f7f5",
      surface: "#ffffff",
      "surface-2": "#f2f1ee",
      border: "#e6e4df",
      "border-2": "#d9d6cf",
      ink: "#1a1a18",
      "ink-2": "#57564f",
      "ink-3": "#807f77",
      accent: "#4f46e5",
      "accent-2": "#9333ea",
      "accent-ink": "#ffffff",
      "accent-soft": "#eef0ff",
      done: "#16a34a",
      "done-soft": "#e8f6ed",
      danger: "#dc2626",
    },
    dark: {
      bg: "#1c1f26",
      surface: "#242833",
      "surface-2": "#2b303c",
      border: "#353b48",
      "border-2": "#414856",
      ink: "#eceef3",
      "ink-2": "#b4bac7",
      "ink-3": "#8f97a8",
      accent: "#8b8cf8",
      "accent-2": "#c084fc",
      "accent-ink": "#14152b",
      "accent-soft": "#2f3250",
      done: "#4ade80",
      "done-soft": "#23382c",
      danger: "#f87171",
    },
  },
  {
    id: "slate",
    name: "Slate Ocean",
    description: "Cool blue-grey with a blue accent; deep navy dark mode.",
    light: {
      bg: "#f2f5f9",
      surface: "#ffffff",
      "surface-2": "#edf1f6",
      border: "#dbe2eb",
      "border-2": "#c3cddb",
      ink: "#0f172a",
      "ink-2": "#3a4658",
      "ink-3": "#617087",
      accent: "#2563eb",
      "accent-2": "#0891b2",
      "accent-ink": "#ffffff",
      "accent-soft": "#e5edff",
      done: "#059669",
      "done-soft": "#ddf4ec",
      danger: "#dc2626",
    },
    dark: {
      bg: "#0a1120",
      surface: "#101a2c",
      "surface-2": "#162238",
      border: "#21304a",
      "border-2": "#2f405f",
      ink: "#e9eef6",
      "ink-2": "#b4c0d3",
      "ink-3": "#8495ae",
      accent: "#60a5fa",
      "accent-2": "#22d3ee",
      "accent-ink": "#0a1120",
      "accent-soft": "#15294b",
      done: "#34d399",
      "done-soft": "#103029",
      danger: "#f87171",
    },
  },
  {
    id: "paper",
    name: "Warm Paper",
    description: "Cream paper, teal and amber; warm charcoal dark mode.",
    light: {
      bg: "#f5f1e8",
      surface: "#fffdf8",
      "surface-2": "#efe9dd",
      border: "#e2d9c8",
      "border-2": "#cfc3ad",
      ink: "#221e19",
      "ink-2": "#544d45",
      "ink-3": "#7f766a",
      accent: "#0f766e",
      "accent-2": "#b45309",
      "accent-ink": "#ffffff",
      "accent-soft": "#e0f0ec",
      done: "#15803d",
      "done-soft": "#e4f1e1",
      danger: "#b42318",
    },
    dark: {
      bg: "#181614",
      surface: "#221f1c",
      "surface-2": "#2b2824",
      border: "#38332d",
      "border-2": "#4a433a",
      ink: "#f2ede5",
      "ink-2": "#cbc2b5",
      "ink-3": "#a0968a",
      accent: "#2dd4bf",
      "accent-2": "#f59e0b",
      "accent-ink": "#0c1f1c",
      "accent-soft": "#1b3531",
      done: "#86efac",
      "done-soft": "#1e3322",
      danger: "#fb7185",
    },
  },
  {
    id: "mono",
    name: "Mono Violet",
    description: "Highest contrast: near-white and near-black with violet.",
    light: {
      bg: "#fafafa",
      surface: "#ffffff",
      "surface-2": "#f4f4f5",
      border: "#d9d9de",
      "border-2": "#a9a9b2",
      ink: "#09090b",
      "ink-2": "#3f3f46",
      "ink-3": "#57575f",
      accent: "#6d28d9",
      "accent-2": "#db2777",
      "accent-ink": "#ffffff",
      "accent-soft": "#f1eaff",
      done: "#15803d",
      "done-soft": "#e6f6eb",
      danger: "#b91c1c",
    },
    dark: {
      bg: "#09090b",
      surface: "#141417",
      "surface-2": "#1d1d21",
      border: "#2e2e34",
      "border-2": "#4a4a52",
      ink: "#fafafa",
      "ink-2": "#d4d4d8",
      "ink-3": "#a1a1aa",
      accent: "#a78bfa",
      "accent-2": "#f472b6",
      "accent-ink": "#130b26",
      "accent-soft": "#261c42",
      done: "#4ade80",
      "done-soft": "#12291a",
      danger: "#f87171",
    },
  },
] as const satisfies readonly {
  id: string;
  name: string;
  description: string;
  light: Tokens;
  dark: Tokens;
}[];

/** `cssVar` is the variable next/font sets on <html> for that font. */
export const FONTS = [
  { id: "inter", name: "Inter", description: "Clean and neutral", cssVar: "--font-inter" },
  { id: "geist", name: "Geist", description: "Modern and compact", cssVar: "--font-geist" },
  {
    id: "plex",
    name: "IBM Plex Sans",
    description: "Technical, slightly wider",
    cssVar: "--font-plex",
  },
  {
    id: "serif",
    name: "Source Serif",
    description: "Bookish, for long reading",
    cssVar: "--font-serif",
  },
  {
    id: "atkinson",
    name: "Atkinson Hyperlegible",
    description: "Designed for readability",
    cssVar: "--font-atkinson",
  },
] as const;

export const SIZES = [
  { id: "s", name: "Small", scale: "93.75%" },
  { id: "m", name: "Default", scale: "100%" },
  { id: "l", name: "Large", scale: "112.5%" },
] as const;

export type PaletteId = (typeof PALETTES)[number]["id"];
export type Mode = "light" | "dark";

const ids = <T extends { id: string }>(list: readonly T[]) =>
  list.map((x) => x.id) as [T["id"], ...T["id"][]];

const hex = z.string().regex(/^#[0-9a-f]{6}$/i, "Colours must look like #4338ca");
const modeColors = z
  .object({ heading: hex.optional(), accent: hex.optional() })
  .strict()
  .default({});

export const appearanceSchema = z
  .object({
    palette: z.enum(ids(PALETTES)).default("crisp"),
    mode: z.enum(["system", "light", "dark"]).default("system"),
    font: z.enum(ids(FONTS)).default("inter"),
    size: z.enum(ids(SIZES)).default("m"),
    colors: z.object({ light: modeColors, dark: modeColors }).strict().default({}),
  })
  .strict();

export type Appearance = z.infer<typeof appearanceSchema>;
export const DEFAULT_APPEARANCE: Appearance = appearanceSchema.parse({});

/** Parses stored appearance, falling back to the defaults for anything missing or invalid. */
export function readAppearance(value: unknown): Appearance {
  const res = appearanceSchema.safeParse(value ?? {});
  return res.success ? res.data : DEFAULT_APPEARANCE;
}

export const paletteById = (id: string) => PALETTES.find((p) => p.id === id) ?? PALETTES[0];

/** Every palette, font and text size as CSS rules keyed on <html> data attributes. */
export function appearanceCss() {
  const decl = (t: Tokens) =>
    Object.entries(t)
      .map(([k, v]) => `--${k}:${v}`)
      .join(";");
  const [base] = PALETTES;
  const rules = [
    `:root{${decl(base.light)};color-scheme:light}`,
    `:root[data-theme="dim"]{${decl(base.dark)};color-scheme:dark}`,
    ...PALETTES.slice(1).flatMap((p) => [
      `:root[data-palette="${p.id}"]{${decl(p.light)}}`,
      `:root[data-palette="${p.id}"][data-theme="dim"]{${decl(p.dark)}}`,
    ]),
    ...FONTS.map(
      (f, i) => `:root${i ? `[data-font="${f.id}"]` : ""}{--font-body:var(${f.cssVar})}`,
    ),
    ...SIZES.filter((s) => s.id !== "m").map(
      (s) => `:root[data-size="${s.id}"]{font-size:${s.scale}}`,
    ),
  ];
  return rules.join("\n");
}

function luminance(color: string) {
  const n = parseInt(color.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two #rrggbb colours (1 to 21). */
export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** The tokens for one mode with the user's heading and accent colours applied. */
export function resolvedTokens(a: Appearance, mode: Mode) {
  const t: Tokens & { heading: string } = { ...paletteById(a.palette)[mode], heading: "" };
  const custom = a.colors[mode];
  t.heading = custom.heading ?? t.ink;
  if (custom.accent) {
    t.accent = custom.accent;
    t["accent-ink"] = contrast(custom.accent, "#ffffff") >= 4.5 ? "#ffffff" : "#111111";
    t["accent-soft"] =
      `color-mix(in srgb, ${custom.accent} ${mode === "dark" ? 22 : 13}%, ${t.surface})`;
  }
  return t;
}

/**
 * Runs before first paint and defines window.__applyAppearance. It reads the appearance saved on
 * this device (or the older "theme" key) and sets data attributes plus the user's custom colours.
 * Custom colour rules use html:root:root so they outrank the palette rules in appearanceCss().
 */
export const APPEARANCE_SCRIPT = `(function(){
var d=document.documentElement,mq=matchMedia("(prefers-color-scheme: dark)"),cur=null,H=/^#[0-9a-f]{6}$/i;
function lum(h){var n=parseInt(h.slice(1),16);return [n>>16,n>>8&255,n&255].map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}).reduce(function(s,v,i){return s+v*[.2126,.7152,.0722][i]},0)}
function rules(c,sel,pct){var r=[];c=c||{};
if(H.test(c.heading||""))r.push("--heading:"+c.heading);
if(H.test(c.accent||"")){r.push("--accent:"+c.accent,"--accent-ink:"+(1.05/(lum(c.accent)+.05)>=4.5?"#ffffff":"#111111"),"--accent-soft:color-mix(in srgb,"+c.accent+" "+pct+"%,var(--surface))")}
return r.length?"html:root:root"+sel+"{"+r.join(";")+"}":""}
function mode(a){return a.mode==="light"?"light":a.mode==="dark"?"dim":mq.matches?"dim":"light"}
window.__applyAppearance=function(a){a=a||{};cur=a;
if(a.palette&&a.palette!=="crisp")d.dataset.palette=a.palette;else delete d.dataset.palette;
if(a.font&&a.font!=="inter")d.dataset.font=a.font;else delete d.dataset.font;
if(a.size&&a.size!=="m")d.dataset.size=a.size;else delete d.dataset.size;
d.dataset.theme=mode(a);
var s=document.getElementById("appearance-custom");if(!s){s=document.createElement("style");s.id="appearance-custom";document.head.appendChild(s)}
var c=a.colors||{};s.textContent=rules(c.light,'[data-theme="light"]',13)+rules(c.dark,'[data-theme="dim"]',22)};
mq.addEventListener("change",function(){if(cur&&(!cur.mode||cur.mode==="system"))d.dataset.theme=mode(cur)});
var a={};try{a=JSON.parse(localStorage.getItem("appearance")||"null");if(!a){var t=localStorage.getItem("theme");a=t==="dim"?{mode:"dark"}:t==="light"?{mode:"light"}:{}}}catch(e){a={}}
window.__applyAppearance(a)})()`;
