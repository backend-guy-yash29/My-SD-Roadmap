"use client";

import { useRef, useState } from "react";
import {
  contrast,
  DEFAULT_APPEARANCE,
  FONTS,
  PALETTES,
  paletteById,
  resolvedTokens,
  SIZES,
  type Appearance,
  type Mode,
} from "@/lib/appearance";
import { updateAppearance } from "@/server/actions";
import { applyAppearance } from "./theme";

type Status = { kind: "idle" | "saving" | "saved" } | { kind: "error"; message: string };

const label = "mb-2 block text-sm font-semibold";
const segment =
  "rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium text-ink-2 aria-pressed:bg-ink aria-pressed:text-surface";

function Segmented<T extends string>({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: T;
  options: readonly (readonly [T, string])[];
  onChange: (v: T) => void;
}) {
  return (
    <div
      role="group"
      aria-label={name}
      className="inline-flex flex-wrap rounded-full border border-border bg-surface p-[3px]"
    >
      {options.map(([v, text]) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          className={segment}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

/** A small track page drawn with one mode's colours, so both modes can be checked side by side. */
function Preview({ a, mode }: { a: Appearance; mode: Mode }) {
  const t = resolvedTokens(a, mode);
  const vars = Object.fromEntries(Object.entries(t).map(([k, v]) => [`--${k}`, v]));
  return (
    <div
      style={vars as React.CSSProperties}
      className="rounded-xl border border-border bg-bg p-3 text-ink"
      aria-hidden
    >
      <div className="rounded-[10px] border border-border bg-surface p-3">
        <p className="font-mono text-[0.625rem] tracking-[0.04em] text-accent">
          TRACK 04 · CORE FOUNDATIONS
        </p>
        <p className="mt-0.5 text-[1.0625rem] font-bold leading-tight tracking-tight text-heading">
          Scaling Data &amp; Storage
        </p>
        <p className="mt-1 text-xs text-ink-2">Replication, partitioning and their trade-offs.</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <i
            className="block h-full w-1/3 rounded-full"
            style={{ background: `linear-gradient(90deg, var(--accent), var(--accent-2))` }}
          />
        </div>
      </div>
      <div className="mt-2 rounded-[10px] border border-border bg-surface">
        <p className="border-b border-border px-3 py-2 text-[0.8125rem] font-semibold text-heading">
          Replication
        </p>
        <p className="flex items-center gap-2 border-b border-border px-3 py-1.5 text-xs text-ink-3 line-through">
          <span className="grid h-3.5 w-3.5 place-items-center rounded bg-done text-[0.5rem] text-surface">
            ✓
          </span>
          Read Replicas
        </p>
        <p className="flex items-center gap-2 px-3 py-1.5 text-xs">
          <span className="h-3.5 w-3.5 rounded border border-border-2" />
          Consistent Hashing
          <span className="ml-auto rounded bg-accent-soft px-1.5 font-mono text-[0.5625rem] text-accent">
            CASE STUDY
          </span>
        </p>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="rounded-md bg-accent px-2.5 py-1 text-[0.6875rem] font-semibold text-accent-ink">
          Save note
        </span>
        <span className="text-[0.6875rem] text-accent">View profile</span>
      </div>
    </div>
  );
}

function ColorField({
  name,
  value,
  fallback,
  background,
  minContrast,
  onChange,
}: {
  name: string;
  value: string | undefined;
  fallback: string;
  background: string;
  minContrast: number;
  onChange: (v: string | undefined) => void;
}) {
  const shown = value ?? fallback;
  const ratio = contrast(shown, background);
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <input
          type="color"
          value={shown}
          onChange={(e) => onChange(e.target.value)}
          aria-label={name}
          className="h-8 w-10 cursor-pointer rounded-md border border-border bg-surface p-0.5"
        />
        <span className="min-w-0 flex-1">
          <span className="block text-[0.8125rem] font-medium">{name}</span>
          <span className="font-mono text-[0.6875rem] text-ink-3">
            {shown} {value ? "" : "· palette default"}
          </span>
        </span>
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="rounded-md px-2 py-1 text-xs text-ink-3 hover:bg-surface-2 hover:text-ink"
          >
            Reset
          </button>
        )}
      </div>
      {ratio < minContrast && (
        <p className="mt-1 text-xs text-danger">
          Hard to read on this background ({ratio.toFixed(1)}:1, aim for {minContrast}:1 or more).
        </p>
      )}
    </div>
  );
}

export function AppearanceForm({ initial }: { initial: Appearance }) {
  const [a, setA] = useState(initial);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(0);

  function change(next: Appearance) {
    setA(next);
    applyAppearance(next);
    setStatus({ kind: "saving" });
    // Colour pickers fire continuously while dragging, so save once things settle.
    if (timer.current) clearTimeout(timer.current);
    const id = ++latest.current;
    timer.current = setTimeout(async () => {
      const res = await updateAppearance(next);
      if (id !== latest.current) return;
      setStatus(res.ok ? { kind: "saved" } : { kind: "error", message: res.error.message });
    }, 400);
  }

  const setColor = (mode: Mode, key: "heading" | "accent", value: string | undefined) => {
    const colors = { ...a.colors[mode] };
    if (value) colors[key] = value;
    else delete colors[key];
    change({ ...a, colors: { ...a.colors, [mode]: colors } });
  };

  const palette = paletteById(a.palette);
  return (
    <div className="space-y-7">
      <section>
        <span className={label}>Theme</span>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {PALETTES.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={a.palette === p.id}
              onClick={() => change({ ...a, palette: p.id })}
              className="flex items-center gap-3 rounded-xl border border-border p-2.5 text-left hover:border-border-2 aria-pressed:border-accent aria-pressed:ring-1 aria-pressed:ring-accent"
            >
              <span className="flex h-11 w-16 flex-none overflow-hidden rounded-lg border border-border">
                <span
                  className="flex flex-1 flex-col justify-end gap-1 p-1.5"
                  style={{ background: p.light.bg }}
                >
                  <i className="h-1 w-full rounded-full" style={{ background: p.light.ink }} />
                  <i className="h-1 w-2/3 rounded-full" style={{ background: p.light.accent }} />
                </span>
                <span
                  className="flex flex-1 flex-col justify-end gap-1 p-1.5"
                  style={{ background: p.dark.bg }}
                >
                  <i className="h-1 w-full rounded-full" style={{ background: p.dark.ink }} />
                  <i className="h-1 w-2/3 rounded-full" style={{ background: p.dark.accent }} />
                </span>
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">
                  {p.name}
                  {p.id === DEFAULT_APPEARANCE.palette && (
                    <span className="ml-1.5 text-xs font-normal text-ink-3">default</span>
                  )}
                </span>
                <span className="block text-xs text-ink-3">{p.description}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap gap-x-10 gap-y-5">
        <div>
          <span className={label}>Mode</span>
          <Segmented
            name="Mode"
            value={a.mode}
            options={[
              ["system", "Match device"],
              ["light", "Light"],
              ["dark", "Dark"],
            ]}
            onChange={(mode) => change({ ...a, mode })}
          />
        </div>
        <div>
          <span className={label}>Text size</span>
          <Segmented
            name="Text size"
            value={a.size}
            options={SIZES.map((s) => [s.id, s.name] as const)}
            onChange={(size) => change({ ...a, size })}
          />
        </div>
      </section>

      <section>
        <span className={label}>Font</span>
        <div className="grid gap-2 sm:grid-cols-2">
          {FONTS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={a.font === f.id}
              onClick={() => change({ ...a, font: f.id })}
              style={{ fontFamily: `var(${f.cssVar})` }}
              className="rounded-xl border border-border px-3.5 py-2.5 text-left hover:border-border-2 aria-pressed:border-accent aria-pressed:ring-1 aria-pressed:ring-accent"
            >
              <span className="block text-[0.9375rem] font-semibold">{f.name}</span>
              <span className="block text-xs text-ink-3">{f.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <span className={label}>Colours</span>
        <p className="-mt-1 mb-3 text-xs text-ink-3">
          Heading colour is used for track and topic headings; the accent for labels, the current
          track, links and buttons. Each mode has its own.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {(["light", "dark"] as const).map((mode) => (
            <div key={mode} className="space-y-3 rounded-xl border border-border p-3.5">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-3">
                {mode === "light" ? "Light mode" : "Dark mode"}
              </p>
              <ColorField
                name={`Heading colour (${mode})`}
                value={a.colors[mode].heading}
                fallback={palette[mode].ink}
                background={palette[mode].surface}
                minContrast={4.5}
                onChange={(v) => setColor(mode, "heading", v)}
              />
              <ColorField
                name={`Accent colour (${mode})`}
                value={a.colors[mode].accent}
                fallback={palette[mode].accent}
                background={palette[mode].surface}
                minContrast={3}
                onChange={(v) => setColor(mode, "accent", v)}
              />
              <Preview a={a} mode={mode} />
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <button
          type="button"
          onClick={() => change(DEFAULT_APPEARANCE)}
          className="rounded-lg border border-border px-3.5 py-1.5 text-sm text-ink-2 hover:border-border-2 hover:text-ink"
        >
          Reset to default
        </button>
        <span className="text-sm" role="status">
          {status.kind === "saving" && <span className="text-ink-3">Saving…</span>}
          {status.kind === "saved" && <span className="text-done">Saved to your account</span>}
          {status.kind === "error" && <span className="text-danger">{status.message}</span>}
        </span>
      </div>
    </div>
  );
}
