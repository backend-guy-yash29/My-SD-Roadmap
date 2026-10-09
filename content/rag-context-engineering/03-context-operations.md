# Context Operations: Write, Select, Compress, Isolate

> The four operations that move information in and out of the context window, and the techniques behind each one.

## The WSCI Framework

- Write, Select, Compress and Isolate
- The Cost of Resending Context Every Turn
- Prompt Caching

## Write

- Scratchpads and Notes Files
- Persisting State Outside the Context Window
- Task Lists and Progress Tracking for Agents

## Select

- Selecting Relevant Knowledge (Retrieval)
- Selecting Relevant Memories
- Selecting Relevant Tools

## Compress

- LLM Summarization of Older Turns
- Tool Result Clearing
- Priority-Based Trimming
- Semantic Compression and Extraction
- Compaction and Its Costs
- Deduplicating Context
- Emergency Trimming at the Context Limit

## Isolate

- Sub-Agent Isolation
- Sub-Agent Communication and Context Limits
- Parallel Agent Execution
- Contract-First Pattern
- Fan-Out and Fan-In
- Sequential Agent Pipelines
- Implicit Orchestration

## Projects

- [exercise] Implement Summarization, Tool Result Clearing and Priority Trimming
- [exercise] Calculate Compression Ratios for a Long Conversation
