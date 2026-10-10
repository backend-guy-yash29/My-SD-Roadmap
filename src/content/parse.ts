import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

export const ITEM_TYPES = ["topic", "case-study", "exercise", "practice", "reading"] as const;
export type ItemType = (typeof ITEM_TYPES)[number];

const resourceSchema = z.object({
  source: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url().startsWith("https://"),
});

const itemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(ITEM_TYPES),
  resources: z.array(resourceSchema),
});

const groupSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  note: z.string().nullable(),
  items: z.array(itemSchema).min(1),
});

const trackSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().nullable(),
  groups: z.array(groupSchema).min(1),
});

const partSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  tracks: z.array(trackSchema).min(1),
});

const roadmapSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  summary: z.string().nullable(),
  parts: z.array(partSchema).min(1),
});

export const contentSchema = z.object({
  roadmaps: z.array(roadmapSchema).min(1),
  renames: z.array(z.object({ from: z.string(), to: z.string() })),
});

export type Resource = z.infer<typeof resourceSchema>;
export type Item = z.infer<typeof itemSchema>;
export type Group = z.infer<typeof groupSchema>;
export type Track = z.infer<typeof trackSchema>;
export type Part = z.infer<typeof partSchema>;
export type Roadmap = z.infer<typeof roadmapSchema>;
export type Content = z.infer<typeof contentSchema>;

export class ContentError extends Error {
  constructor(public readonly problems: string[]) {
    super(`Content is invalid:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
  }
}

/** Lower-cases a title and replaces every run of non-alphanumerics with "-". */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const TAG_RE = /^\[(case-study|exercise|practice|reading)\] (.+)$/;
const RESOURCE_RE = /^ {2}- \[([^[\]]+)\]\((https:\/\/[^\s()]+)\)$/;

type Lines = { file: string; lines: string[] };

function read(path: string, file: string): Lines {
  return { file, lines: readFileSync(path, "utf8").replace(/\r\n/g, "\n").split("\n") };
}

/** Parses "# Title" on line 1 and an optional "> summary" right after it. */
function header(src: Lines, problems: string[]) {
  const first = src.lines[0] ?? "";
  if (!first.startsWith("# ")) problems.push(`${src.file}:1 first line must be "# Title"`);
  const title = first.slice(2).trim();
  let i = 1;
  while (i < src.lines.length && src.lines[i] === "") i++;
  let summary: string | null = null;
  if (src.lines[i]?.startsWith("> ")) {
    summary = src.lines[i].slice(2).trim();
    i++;
  }
  return { title, summary, next: i };
}

function parseTrack(path: string, file: string, trackId: string, problems: string[]): Track {
  const src = read(path, file);
  const { title, summary, next } = header(src, problems);
  const groups: Group[] = [];
  const groupIds = new Set<string>();
  const itemIds = new Set<string>();
  let group: Group | null = null;
  let item: Item | null = null;

  for (let i = next; i < src.lines.length; i++) {
    const line = src.lines[i];
    const at = `${file}:${i + 1}`;
    if (line === "") continue;
    if (line.startsWith("## ")) {
      const gTitle = line.slice(3).trim();
      const id = `${trackId}/${slugify(gTitle)}`;
      if (groupIds.has(id)) problems.push(`${at} duplicate subtopic "${gTitle}"`);
      groupIds.add(id);
      group = { id, title: gTitle, note: null, items: [] };
      groups.push(group);
      item = null;
    } else if (line.startsWith("> ")) {
      if (!group) problems.push(`${at} note outside a subtopic`);
      else group.note = group.note ? `${group.note}\n${line.slice(2).trim()}` : line.slice(2).trim();
      item = null;
    } else if (line.startsWith("- ")) {
      if (!group) {
        problems.push(`${at} bullet outside a subtopic`);
        continue;
      }
      let text = line.slice(2).trim();
      let type: ItemType = "topic";
      const tag = TAG_RE.exec(text);
      if (tag) {
        type = tag[1] as ItemType;
        text = tag[2].trim();
      } else if (text.startsWith("[")) {
        problems.push(`${at} unknown tag in "${text}"`);
      }
      if (/^\d+[.)]\s/.test(text)) problems.push(`${at} item title starts with a typed number`);
      const id = `${trackId}/${slugify(text)}`;
      if (itemIds.has(id)) problems.push(`${at} duplicate item "${text}" in this track`);
      itemIds.add(id);
      item = { id, title: text, type, resources: [] };
      group.items.push(item);
    } else if (line.startsWith("  - ")) {
      const m = RESOURCE_RE.exec(line);
      if (!m) problems.push(`${at} malformed resource link: ${line.trim()}`);
      else if (!item) problems.push(`${at} resource link not directly under an item`);
      else {
        const label = m[1];
        const sep = label.indexOf(": ");
        if (sep < 1) problems.push(`${at} resource label must be "Source: Title"`);
        else item.resources.push({ source: label.slice(0, sep), title: label.slice(sep + 2), url: m[2] });
      }
    } else {
      problems.push(`${at} unexpected line: ${line}`);
      item = null;
    }
  }
  for (const g of groups) if (g.items.length === 0) problems.push(`${file}: subtopic "${g.title}" has no items`);
  return { id: trackId, title, summary, groups };
}

function parseRoadmap(dir: string, roadmapId: string, problems: string[]): Roadmap {
  const base = join(dir, roadmapId);
  const indexFile = `${roadmapId}/roadmap.md`;
  if (!existsSync(join(base, "roadmap.md"))) {
    problems.push(`${indexFile} is missing`);
    return { id: roadmapId, title: roadmapId, summary: null, parts: [] };
  }
  const src = read(join(base, "roadmap.md"), indexFile);
  const { title, summary, next } = header(src, problems);
  const trackFiles = new Set(readdirSync(base).filter((f) => /^\d\d-[a-z0-9-]+\.md$/.test(f)));
  const listed = new Set<string>();
  const parts: Part[] = [];
  let part: Part | null = null;

  for (let i = next; i < src.lines.length; i++) {
    const line = src.lines[i];
    const at = `${indexFile}:${i + 1}`;
    if (line === "") continue;
    if (line.startsWith("## ")) {
      const pTitle = line.slice(3).trim();
      part = { id: `${roadmapId}/${slugify(pTitle)}`, title: pTitle, tracks: [] };
      parts.push(part);
    } else if (line.startsWith("- ")) {
      const name = line.slice(2).trim();
      if (!part) problems.push(`${at} track listed outside a part`);
      else if (!trackFiles.has(`${name}.md`)) problems.push(`${at} lists ${name}.md, which does not exist`);
      else if (listed.has(name)) problems.push(`${at} lists ${name} twice`);
      else {
        listed.add(name);
        const trackId = `${roadmapId}/${name.replace(/^\d\d-/, "")}`;
        part.tracks.push(parseTrack(join(base, `${name}.md`), `${roadmapId}/${name}.md`, trackId, problems));
      }
    } else problems.push(`${at} unexpected line: ${line}`);
  }
  for (const f of trackFiles) {
    if (!listed.has(f.slice(0, -3))) problems.push(`${roadmapId}/${f} is not listed in roadmap.md`);
  }
  const trackIds = parts.flatMap((p) => p.tracks.map((t) => t.id));
  if (new Set(trackIds).size !== trackIds.length) problems.push(`${indexFile} has two tracks with the same slug`);
  return { id: roadmapId, title, summary, parts };
}

function parseRenames(dir: string, problems: string[]) {
  const path = join(dir, "renames.txt");
  if (!existsSync(path)) return [];
  const renames: { from: string; to: string }[] = [];
  readFileSync(path, "utf8")
    .split("\n")
    .forEach((raw, i) => {
      const line = raw.trim();
      if (!line || line.startsWith("#")) return;
      const m = /^(\S+)\s*->\s*(\S+)$/.exec(line);
      if (!m) problems.push(`renames.txt:${i + 1} expected "old-id -> new-id"`);
      else renames.push({ from: m[1], to: m[2] });
    });
  return renames;
}

/** Parses and validates the whole content directory. Throws ContentError listing every problem. */
export function parseContent(dir: string): Content {
  const problems: string[] = [];
  const order = read(join(dir, "roadmaps.md"), "roadmaps.md");
  if (order.lines[0] !== "# Roadmaps") problems.push('roadmaps.md:1 must be "# Roadmaps"');
  const ids = order.lines.filter((l) => l.startsWith("- ")).map((l) => l.slice(2).trim());
  const folders = readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  for (const f of folders) if (!ids.includes(f)) problems.push(`content/${f} is not listed in roadmaps.md`);

  const roadmaps = ids.map((id) => parseRoadmap(dir, id, problems));
  const renames = parseRenames(dir, problems);
  const result = contentSchema.safeParse({ roadmaps, renames });
  if (!result.success) {
    for (const issue of result.error.issues) problems.push(`${issue.path.join(".")}: ${issue.message}`);
  }
  if (problems.length) throw new ContentError(problems);
  return result.data!;
}

/** Flattens the tree into rows with positions, ready for the sync. */
export function flatten(content: Content) {
  const rows = {
    roadmaps: [] as { id: string; title: string; summary: string | null; position: number }[],
    parts: [] as { id: string; roadmapId: string; title: string; position: number }[],
    tracks: [] as {
      id: string;
      roadmapId: string;
      partId: string;
      title: string;
      summary: string | null;
      position: number;
    }[],
    groups: [] as { id: string; trackId: string; title: string; note: string | null; position: number }[],
    items: [] as {
      id: string;
      roadmapId: string;
      trackId: string;
      groupId: string;
      title: string;
      type: ItemType;
      position: number;
    }[],
    resources: [] as { itemId: string; source: string; title: string; url: string; position: number }[],
  };
  content.roadmaps.forEach((r, ri) => {
    rows.roadmaps.push({ id: r.id, title: r.title, summary: r.summary, position: ri });
    let trackPos = 0;
    r.parts.forEach((p, pi) => {
      rows.parts.push({ id: p.id, roadmapId: r.id, title: p.title, position: pi });
      p.tracks.forEach((t) => {
        rows.tracks.push({ id: t.id, roadmapId: r.id, partId: p.id, title: t.title, summary: t.summary, position: trackPos++ });
        let itemPos = 0;
        t.groups.forEach((g, gi) => {
          rows.groups.push({ id: g.id, trackId: t.id, title: g.title, note: g.note, position: gi });
          g.items.forEach((it) => {
            rows.items.push({ id: it.id, roadmapId: r.id, trackId: t.id, groupId: g.id, title: it.title, type: it.type, position: itemPos++ });
            it.resources.forEach((res, i) => rows.resources.push({ itemId: it.id, ...res, position: i }));
          });
        });
      });
    });
  });
  return rows;
}
