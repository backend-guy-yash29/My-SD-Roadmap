# Retrieval & Reranking

> Turning a user question into the right handful of chunks, in the right order.

## Retrieval Pipeline

> User Query → Query Processing → Retrieval → Hybrid Search → Reranking → Context Builder → LLM

- Semantic Search
  - [Vizuara Context Engineering L3: Retrieval and reranking (31:29)](https://www.youtube.com/watch?v=zvWIfROm-uE&t=1889s)
- Keyword Search
- Hybrid Search
- Reciprocal Rank Fusion

## Query Processing

- Query Rewriting and Expansion
- Multi-Query Retrieval
- Query Decomposition
- Hypothetical Document Embeddings (HyDE)
- Query Routing

## Reranking

- Reranking with Cross-Encoders
  - [Vizuara Context Engineering L3: Retrieval and reranking (31:29)](https://www.youtube.com/watch?v=zvWIfROm-uE&t=1889s)
- LLM-Based Reranking
- Maximal Marginal Relevance (Diversity)

## Context Building

- Ordering Retrieved Chunks
- Deduplicating and Merging Chunks
- Citations and Source Attribution
