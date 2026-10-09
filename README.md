# My-SD-Roadmap
System Design roadmap with a tracker , to continue with my study arc , divided across various others sections like AI-ML , DSA , Web-Dev and much more

## Curricula

- [System Design](content/system-design/roadmap.md) — core concepts, distributed systems, LLD, HLD, interview prep
- [ML & AI System Design](content/ml-ai-system-design/roadmap.md) — ML systems, recommendations, LLM serving, RAG, agents, evals
- Planned: Core ML & Optimizers, Deep Learning → LLMs, RAG · Context · Memory

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
```

- Exactly one `#` heading, on the first line.
- One optional `>` summary under the `#`, and optional `>` notes under a `##`.
- Every bullet sits under a `##` subtopic. No nested bullets, `###`, bold headings, tables or typed numbers.
- A bullet with no tag is a regular concept.
