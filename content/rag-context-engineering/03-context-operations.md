# Context Operations: Write, Select, Compress, Isolate

> The four operations that move information in and out of the context window, and the techniques behind each one.

## The WSCI Framework

- Write, Select, Compress and Isolate
  - [Vizuara Context Engineering L3: WSCI framework overview (1:35)](https://www.youtube.com/watch?v=zvWIfROm-uE&t=95s)
  - [Vizuara Context Engineering L5: WSCI framework overview (2:20)](https://www.youtube.com/watch?v=LLDkAr5MZR8&t=140s)
- The Cost of Resending Context Every Turn
  - [Vizuara Context Engineering L5: Context management costs (4:29)](https://www.youtube.com/watch?v=LLDkAr5MZR8&t=269s)
- Prompt Caching

## Write

- Scratchpads and Notes Files
  - [Vizuara Context Engineering L3: Storage and task management (12:05)](https://www.youtube.com/watch?v=zvWIfROm-uE&t=725s)
- Persisting State Outside the Context Window
  - [Vizuara Context Engineering L3: Storage and task management (12:05)](https://www.youtube.com/watch?v=zvWIfROm-uE&t=725s)
- Task Lists and Progress Tracking for Agents
  - [Vizuara Context Engineering L3: Storage and task management (12:05)](https://www.youtube.com/watch?v=zvWIfROm-uE&t=725s)

## Select

- Selecting Relevant Knowledge (Retrieval)
- Selecting Relevant Memories
- Selecting Relevant Tools

## Compress

- LLM Summarization of Older Turns
  - [Vizuara Context Engineering L5: LLM-based summarization (7:22)](https://www.youtube.com/watch?v=LLDkAr5MZR8&t=442s)
- Tool Result Clearing
  - [Vizuara Context Engineering L5: Tool result clearing (12:04)](https://www.youtube.com/watch?v=LLDkAr5MZR8&t=724s)
- Priority-Based Trimming
  - [Vizuara Context Engineering L5: Priority based trimming (15:40)](https://www.youtube.com/watch?v=LLDkAr5MZR8&t=940s)
- Semantic Compression and Extraction
  - [Vizuara Context Engineering L5: Semantic compression (17:59)](https://www.youtube.com/watch?v=LLDkAr5MZR8&t=1079s)
  - [Vizuara Context Engineering L5: Semantic extraction (32:36)](https://www.youtube.com/watch?v=LLDkAr5MZR8&t=1956s)
- Compaction and Its Costs
  - [Vizuara Context Engineering L5: Compaction costs (30:07)](https://www.youtube.com/watch?v=LLDkAr5MZR8&t=1807s)
- Deduplicating Context
  - [Vizuara Context Engineering L5: Deduplication techniques (2:16:41)](https://www.youtube.com/watch?v=LLDkAr5MZR8&t=8201s)
- Emergency Trimming at the Context Limit
  - [Vizuara Context Engineering L5: Emergency trimming simulation (1:20:26)](https://www.youtube.com/watch?v=LLDkAr5MZR8&t=4826s)

## Isolate

- Sub-Agent Isolation
  - [Vizuara Context Engineering L5: Sub-agent isolation (38:48)](https://www.youtube.com/watch?v=LLDkAr5MZR8&t=2328s)
- Sub-Agent Communication and Context Limits
  - [Vizuara Context Engineering L5: Sub-agent communication (44:21)](https://www.youtube.com/watch?v=LLDkAr5MZR8&t=2661s)
  - [Vizuara Context Engineering L5: Sub-agent context limits (2:21:07)](https://www.youtube.com/watch?v=LLDkAr5MZR8&t=8467s)
- Parallel Agent Execution
  - [Vizuara Context Engineering L5: Parallel agent execution (49:36)](https://www.youtube.com/watch?v=LLDkAr5MZR8&t=2976s)
- Contract-First Pattern
  - [Vizuara Context Engineering L5: Contract first pattern (1:30:40)](https://www.youtube.com/watch?v=LLDkAr5MZR8&t=5440s)
- Fan-Out and Fan-In
  - [Vizuara Context Engineering L5: Fan out and in patterns (1:35:08)](https://www.youtube.com/watch?v=LLDkAr5MZR8&t=5708s)
- Sequential Agent Pipelines
  - [Vizuara Context Engineering L5: Sequential agent pipeline (1:38:07)](https://www.youtube.com/watch?v=LLDkAr5MZR8&t=5887s)
- Implicit Orchestration
  - [Vizuara Context Engineering L5: Implicit orchestration (55:17)](https://www.youtube.com/watch?v=LLDkAr5MZR8&t=3317s)

## Projects

- [exercise] Implement Summarization, Tool Result Clearing and Priority Trimming
  - [Vizuara Context Engineering L5: LLM summarization demo (1:07:18)](https://www.youtube.com/watch?v=LLDkAr5MZR8&t=4038s)
- [exercise] Calculate Compression Ratios for a Long Conversation
  - [Vizuara Context Engineering L5: Compression ratio calculation (2:02:58)](https://www.youtube.com/watch?v=LLDkAr5MZR8&t=7378s)
