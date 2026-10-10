import { join } from "node:path";
import { ContentError, parseContent } from "./parse";

const CONTENT_DIR = join(process.cwd(), "content");

async function main() {
  const command = process.argv[2];
  const content = parseContent(CONTENT_DIR);
  const items = content.roadmaps.flatMap((r) => r.parts.flatMap((p) => p.tracks.flatMap((t) => t.groups.flatMap((g) => g.items))));
  console.log(`Content OK: ${content.roadmaps.length} roadmaps, ${items.length} items`);
  if (command === "check") return;
  if (command !== "sync") throw new Error(`Unknown command "${command}" (expected check or sync)`);

  const { db, client } = await import("@/db");
  const { syncContent } = await import("./sync");
  const report = await syncContent(db, content);
  console.log("Synced:", JSON.stringify(report));
  await client.end();
}

main().catch((err) => {
  console.error(err instanceof ContentError ? err.message : err);
  process.exit(1);
});
