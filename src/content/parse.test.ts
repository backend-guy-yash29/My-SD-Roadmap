import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { basicContent, contentDir } from "@/test/fixtures";
import { ContentError, flatten, parseContent, slugify } from "./parse";

function problems(files: Record<string, string>): string[] {
  try {
    parseContent(contentDir(files));
  } catch (err) {
    if (err instanceof ContentError) return err.problems;
    throw err;
  }
  return [];
}

describe("slugify", () => {
  it("lower-cases and joins words with dashes", () => {
    expect(slugify("Two-Phase Commit (2PC)")).toBe("two-phase-commit-2pc");
    expect(slugify("Why Divide by √d_k?")).toBe("why-divide-by-d-k");
  });
});

describe("parseContent", () => {
  it("parses the real content directory", () => {
    const content = parseContent(join(process.cwd(), "content"));
    expect(content.roadmaps.map((r) => r.id)).toEqual([
      "system-design",
      "ml-foundations",
      "deep-learning",
      "rag-context-engineering",
      "ml-ai-system-design",
    ]);
    expect(flatten(content).items.length).toBeGreaterThan(1000);
  });

  it("builds the tree with IDs, types, notes and resources", () => {
    const content = parseContent(contentDir(basicContent));
    const track = content.roadmaps[0].parts[0].tracks[0];
    expect(track).toMatchObject({ id: "demo/first", title: "First Track", summary: "Summary of the first track." });
    expect(track.groups[0]).toMatchObject({ id: "demo/first/group-a", note: "A note." });
    expect(track.groups[0].items[0]).toEqual({
      id: "demo/first/alpha",
      title: "Alpha",
      type: "topic",
      resources: [
        { source: "Src", title: "Alpha lesson", url: "https://example.com/alpha" },
        { source: "Other Src", title: "Alpha video (1:05)", url: "https://example.com/watch?v=a&t=65s" },
      ],
    });
    expect(track.groups[0].items[1]).toMatchObject({ id: "demo/first/beta", type: "exercise" });
  });

  it("numbers item positions across groups within a track", () => {
    const rows = flatten(parseContent(contentDir(basicContent)));
    expect(rows.items.filter((i) => i.trackId === "demo/first").map((i) => [i.title, i.position])).toEqual([
      ["Alpha", 0],
      ["Beta", 1],
      ["Gamma", 2],
    ]);
  });

  it("reports layout problems with file and line", () => {
    const found = problems({
      ...basicContent,
      "demo/02-second.md": "# Second\n\n- Orphan\n\n## G\n\n- [unknown] X\n- Same\n- Same\n  - [no colon](https://e.com)\n  - [Src: bad](http://e.com)\n**bold**\n",
    });
    expect(found).toEqual(
      expect.arrayContaining([
        "demo/02-second.md:3 bullet outside a subtopic",
        'demo/02-second.md:7 unknown tag in "[unknown] X"',
        'demo/02-second.md:9 duplicate item "Same" in this track',
        'demo/02-second.md:10 resource label must be "Source: Title"',
        "demo/02-second.md:11 malformed resource link: - [Src: bad](http://e.com)",
        "demo/02-second.md:12 unexpected line: **bold**",
      ]),
    );
  });

  it("requires every track file to be listed, and every listed file to exist", () => {
    const found = problems({ ...basicContent, "demo/03-extra.md": "# Extra\n\n## G\n\n- X\n", "demo/roadmap.md": "# Demo\n\n## P\n\n- 01-first\n- 02-second\n- 04-missing\n" });
    expect(found).toContain("demo/roadmap.md:7 lists 04-missing.md, which does not exist");
    expect(found).toContain("demo/03-extra.md is not listed in roadmap.md");
  });

  it("requires every roadmap folder to be listed in roadmaps.md", () => {
    expect(problems({ ...basicContent, "other/roadmap.md": "# Other\n" })).toContain(
      "content/other is not listed in roadmaps.md",
    );
  });

  it("parses renames", () => {
    const content = parseContent(contentDir({ ...basicContent, "renames.txt": "# comment\ndemo/first/old -> demo/first/alpha\n" }));
    expect(content.renames).toEqual([{ from: "demo/first/old", to: "demo/first/alpha" }]);
  });
});
