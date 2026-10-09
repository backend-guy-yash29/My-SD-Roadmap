"use client";

import { useEffect, useState } from "react";
import { getNote, saveNote } from "@/server/actions";

const MAX = 10_000;

export function NoteEditor({
  itemId,
  itemTitle,
  onSaved,
}: {
  itemId: string;
  itemTitle: string;
  onSaved: (hasNote: boolean) => void;
}) {
  const [body, setBody] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getNote(itemId).then((res) => {
      if (res.ok) setBody(res.data?.body ?? "");
      setLoaded(true);
    });
  }, [itemId]);

  async function save() {
    setStatus("saving");
    const res = await saveNote(itemId, body);
    if (res.ok) {
      setStatus("saved");
      onSaved(res.data !== null);
    } else {
      setStatus("error");
      setMessage(res.error.message);
    }
  }

  return (
    <div className="mt-2 rounded-md border border-border bg-surface-2 p-2">
      <textarea
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
          setStatus("idle");
        }}
        disabled={!loaded}
        maxLength={MAX}
        rows={4}
        placeholder={loaded ? "Plain-text notes for this item" : "Loading…"}
        aria-label={`Note for ${itemTitle}`}
        className="w-full resize-y rounded-md border border-border bg-surface p-2 text-sm outline-none focus:border-accent"
      />
      <div className="mt-1 flex items-center justify-between gap-2 text-xs text-ink-3">
        <span className="tabular-nums">
          {body.length.toLocaleString()} / {MAX.toLocaleString()}
        </span>
        <span className="flex items-center gap-2">
          {status === "saved" && <span className="text-done">Saved</span>}
          {status === "error" && <span className="text-red-600">{message}</span>}
          <button
            type="button"
            onClick={save}
            disabled={!loaded || status === "saving"}
            className="rounded-md bg-accent px-3 py-1 font-medium text-accent-ink disabled:opacity-50"
          >
            {status === "saving" ? "Saving…" : body.trim() ? "Save note" : "Delete note"}
          </button>
        </span>
      </div>
    </div>
  );
}
