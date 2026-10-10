# Memory

> How an LLM application remembers anything beyond a single call: memory types, tiers, retrieval and pruning.

## Why Memory

- LLM Statelessness
  - [Vizuara Context Engineering L6: LLM statelessness example (0:00)](https://www.youtube.com/watch?v=WWTngf_OqaY&t=0s)
- Short-Term vs Long-Term Memory
  - [Vizuara Context Engineering L3: Memory types and context rot (7:28)](https://www.youtube.com/watch?v=zvWIfROm-uE&t=448s)
- Implementing Basic Conversation Memory
  - [Vizuara Context Engineering L6: Implementing basic memory (1:43)](https://www.youtube.com/watch?v=WWTngf_OqaY&t=103s)

## Memory Types

- Conversation Memory
  - [Vizuara Context Engineering L6: Memory types and examples (8:18)](https://www.youtube.com/watch?v=WWTngf_OqaY&t=498s)
- Working Memory
  - [Vizuara Context Engineering L6: Memory types and examples (8:18)](https://www.youtube.com/watch?v=WWTngf_OqaY&t=498s)
- Long-Term Memory
  - [Vizuara Context Engineering L6: Memory types and examples (8:18)](https://www.youtube.com/watch?v=WWTngf_OqaY&t=498s)
- Vector Memory
  - [Vizuara Context Engineering L6: Advanced memory strategies (42:32)](https://www.youtube.com/watch?v=WWTngf_OqaY&t=2552s)
- Episodic, Semantic and Procedural Memory
  - [Vizuara Context Engineering L6: Memory types and examples (8:18)](https://www.youtube.com/watch?v=WWTngf_OqaY&t=498s)

## Memory Architecture

- Memory Tiers (Context Window vs External Storage)
  - [Vizuara Context Engineering L6: Memory tiers in LLMs (22:19)](https://www.youtube.com/watch?v=WWTngf_OqaY&t=1339s)
- KV Cache vs Application-Level Memory
  - [Vizuara Context Engineering L6: Technical details of KV cache (35:57)](https://www.youtube.com/watch?v=WWTngf_OqaY&t=2157s)
- Deciding What to Remember (Memory Extraction)
  - [Vizuara Context Engineering L6: Memory management techniques (28:06)](https://www.youtube.com/watch?v=WWTngf_OqaY&t=1686s)
- Memory Retrieval Strategies (Recency, Relevance, Importance)
  - [Vizuara Context Engineering L6: Retrieval strategies (15:05)](https://www.youtube.com/watch?v=WWTngf_OqaY&t=905s)
- Updating and Forgetting Memories
  - [Vizuara Context Engineering L6: Memory management techniques (28:06)](https://www.youtube.com/watch?v=WWTngf_OqaY&t=1686s)
- Key-Value Memory and Priority Pruning
  - [Vizuara Context Engineering L6: Key-value and priority pruning (58:44)](https://www.youtube.com/watch?v=WWTngf_OqaY&t=3524s)

## Choosing a Strategy

- Buffer vs Summary vs Vector vs Hybrid Memory
  - [Vizuara Context Engineering L6: Comparison of memory strategies (1:27:42)](https://www.youtube.com/watch?v=WWTngf_OqaY&t=5262s)

## Projects

- [exercise] Implement Buffer, Summary and Vector Memory and Compare Them
  - [Vizuara Context Engineering L6: Implementing memory techniques (45:24)](https://www.youtube.com/watch?v=WWTngf_OqaY&t=2724s)
