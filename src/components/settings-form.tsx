"use client";

import Link from "next/link";
import { useState } from "react";
import { updateProfile } from "@/server/actions";

type Profile = {
  username: string | null;
  name: string | null;
  timezone: string;
  profilePublic: boolean;
};

export function SettingsForm({ profile, timezones }: { profile: Profile; timezones: string[] }) {
  const [form, setForm] = useState({
    username: profile.username ?? "",
    name: profile.name ?? "",
    timezone: profile.timezone,
    profilePublic: profile.profilePublic,
  });
  const [status, setStatus] = useState<{
    kind: "idle" | "saving" | "saved" | "error";
    message?: string;
  }>({ kind: "idle" });
  const browserTz =
    typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "saving" });
    const res = await updateProfile(form);
    setStatus(res.ok ? { kind: "saved" } : { kind: "error", message: res.error.message });
  }

  const field =
    "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent";
  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium">Username</span>
        <input
          className={field}
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })}
          pattern="[a-z0-9_\-]{3,30}"
          required
        />
        <span className="mt-1 block text-xs text-ink-3">
          3–30 lowercase letters, digits, _ or -. Used in your profile link.
        </span>
      </label>
      <label className="block">
        <span className="text-sm font-medium">Display name</span>
        <input
          className={field}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          maxLength={80}
          required
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Timezone</span>
        <select
          className={field}
          value={form.timezone}
          onChange={(e) => setForm({ ...form, timezone: e.target.value })}
        >
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
        <span className="mt-1 block text-xs text-ink-3">
          Streaks count days in this timezone.
          {browserTz && browserTz !== form.timezone && (
            <>
              {" "}
              <button
                type="button"
                className="text-accent hover:underline"
                onClick={() => setForm({ ...form, timezone: browserTz })}
              >
                Use {browserTz}
              </button>
            </>
          )}
        </span>
      </label>
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-[var(--accent)]"
          checked={form.profilePublic}
          onChange={(e) => setForm({ ...form, profilePublic: e.target.checked })}
        />
        <span>
          <span className="text-sm font-medium">Public profile</span>
          <span className="block text-xs text-ink-3">
            Anyone with the link can see your progress, streaks and activity heatmap. Notes are
            never shown.
          </span>
        </span>
      </label>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status.kind === "saving"}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink disabled:opacity-50"
        >
          {status.kind === "saving" ? "Saving…" : "Save"}
        </button>
        {status.kind === "saved" && (
          <span className="text-sm text-done">
            Saved.{" "}
            {form.username && (
              <Link href={`/u/${form.username}`} className="text-accent hover:underline">
                View profile
              </Link>
            )}
          </span>
        )}
        {status.kind === "error" && <span className="text-sm text-red-600">{status.message}</span>}
      </div>
    </form>
  );
}
