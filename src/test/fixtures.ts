import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/** Writes a content directory from a { "relative/path": "file text" } map and returns its path. */
export function contentDir(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), "content-"));
  for (const [rel, text] of Object.entries(files)) {
    const path = join(dir, rel);
    mkdirSync(join(path, ".."), { recursive: true });
    writeFileSync(path, text);
  }
  return dir;
}

export const basicContent = {
  "roadmaps.md": "# Roadmaps\n\n- demo\n",
  "demo/roadmap.md": "# Demo\n\n> A demo roadmap.\n\n## Basics\n\n- 01-first\n- 02-second\n",
  "demo/01-first.md": [
    "# First Track",
    "",
    "> Summary of the first track.",
    "",
    "## Group A",
    "",
    "> A note.",
    "",
    "- Alpha",
    "  - [Src: Alpha lesson](https://example.com/alpha)",
    "  - [Other Src: Alpha video (1:05)](https://example.com/watch?v=a&t=65s)",
    "- [exercise] Beta",
    "",
    "## Group B",
    "",
    "- Gamma",
    "",
  ].join("\n"),
  "demo/02-second.md": "# Second Track\n\n## Only Group\n\n- [case-study] Delta\n",
};
