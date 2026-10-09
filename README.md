# My-SD-Roadmap
System Design roadmap with a tracker , to continue with my study arc , divided across various others sections like AI-ML , DSA , Web-Dev and much more

See [docs/architecture.md](docs/architecture.md) for how the tracker app is designed.

## Running the app

Requires Node 22 and Docker (or any PostgreSQL 16).

```bash
cp .env.example .env.local      # then fill in AUTH_SECRET and the Google OAuth client ID and secret
docker compose up -d            # local Postgres
npm install
export DATABASE_URL=postgres://roadmap:roadmap@localhost:5432/roadmap
npm run db:migrate              # create tables
npm run content:sync            # load content/ into the database
npm run dev                     # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run content:check` | Validates every file in `content/` (also runs in CI) |
| `npm run content:sync` | Upserts content into the database; safe to run on every deploy |
| `npm test` | Unit and database tests; needs `TEST_DATABASE_URL` pointing at an empty test database |
| `npm run lint`, `npm run typecheck`, `npm run format:check` | Static checks |
| `npm run db:generate` | Creates a migration after changing `src/db/schema.ts` |

The Google OAuth redirect URI is `<site>/api/auth/callback/google`.

## Curricula

- [System Design](content/system-design/roadmap.md) — core concepts, distributed systems, LLD, HLD, interview prep
- AI-ML, split into four roadmaps:
  - [ML Foundations](content/ml-foundations/roadmap.md) — math, data and features, regression, classification, SVMs, trees and ensembles, clustering, theory
  - [Deep Learning](content/deep-learning/roadmap.md) — neural networks from scratch, optimizers, CNNs, RNNs, Transformers and LLMs
  - [RAG & Context Engineering](content/rag-context-engineering/roadmap.md) — context engineering, RAG in depth, tools and MCP, memory, agents, capstone projects
  - [ML & AI System Design](content/ml-ai-system-design/roadmap.md) — ML systems, recommendations, LLM serving, production RAG and agents, evals

## Content layout

Each roadmap is a folder under `content/`. `roadmap.md` lists its parts and tracks in order, and every track is one file (`NN-slug.md`, where `NN` sets the order) with this layout:

```markdown
# Track Title

> One-line summary of the track.

## Subtopic

- Concept
- [case-study] A design problem
- [exercise] A hands-on exercise
- [practice] A countable practice task
- [reading] An article or paper to read
  - [Source: Lesson or video title](https://exact-url-to-study-this)
  - [Another Source: Lesson title (12:34)](https://www.youtube.com/watch?v=VIDEO_ID&t=754s)
```

- Exactly one `#` heading, on the first line.
- One optional `>` summary under the `#`, and optional `>` notes under a `##`.
- Every bullet sits under a `##` subtopic. No nested bullets (other than resource links), `###`, bold headings, tables or typed numbers.
- A bullet with no tag is a regular concept.
- An item may have **resource links**: indented `  - [Source: Title](https://...)` lines directly under it, one per resource, in source order. Each link is the exact page or video (with a `&t=` timestamp for a chapter of a longer video) where that item is taught. The app shows them as a list when hovering over the item.
- Resource links are the only nested lines allowed.

### Resource sources

| Roadmap | Sources |
|---|---|
| System Design | [AlgoMaster System Design](https://algomaster.io/learn/system-design), [AlgoMaster System Design Interviews](https://algomaster.io/learn/system-design-interviews/course-roadmap), [AlgoMaster LLD](https://algomaster.io/learn/lld) and [LLD practice](https://algomaster.io/practice/low-level-design), [AlgorithmXlr8 HLD](https://algorithmxlr8.io/hld) and [LLD](https://algorithmxlr8.io/lld) |
| ML Foundations | [CampusX 100 Days of ML](https://www.youtube.com/playlist?list=PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH), [Stanford CS229 (Summer 2019)](https://www.youtube.com/playlist?list=PLoROMvodv4rNH7qL6-efu_q2_bPuy0adh) |
| Deep Learning | [CampusX 100 Days of Deep Learning](https://www.youtube.com/playlist?list=PLKnIA16_RmvYuZauWaPlRTC54KxSNLtNn), [Vizuara Neural Networks from Scratch](https://www.youtube.com/playlist?list=PLPTV0NXA_ZSj6tNyn_UadmUeU3Q3oR-hu), [Vizuara Transformers](https://www.youtube.com/watch?v=i3-bjM3VhJQ), [CampusX Practical Deep Learning using PyTorch](https://www.youtube.com/playlist?list=PLKnIA16_Rmvboy8bmDCjwNHgTaYH2puK7) |
| RAG & Context Engineering | [Vizuara LLM Context Engineering Bootcamp](https://www.youtube.com/playlist?list=PLPTV0NXA_ZSj-E8A1DBvbWIYGxC46u-Hd) |
