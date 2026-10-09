# My-SD-Roadmap
System Design roadmap with a tracker , to continue with my study arc , divided across various others sections like AI-ML , DSA , Web-Dev and much more

## Curricula

- [System Design](content/system-design/roadmap.md) — core concepts, distributed systems, LLD, HLD, interview prep
- AI-ML, split into four roadmaps:
  - ML Foundations — core ML algorithms and optimizers (planned; seed list in [ai-ml.md](ai-ml.md))
  - [Deep Learning](content/deep-learning/roadmap.md) — neural networks to Transformers and LLMs (LLM tracks so far)
  - [RAG & Context Engineering](content/rag-context-engineering/roadmap.md) — retrieval, context, memory, agents (partial)
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
```

- Exactly one `#` heading, on the first line.
- One optional `>` summary under the `#`, and optional `>` notes under a `##`.
- Every bullet sits under a `##` subtopic. No nested bullets, `###`, bold headings, tables or typed numbers.
- A bullet with no tag is a regular concept.
