# AI-ML — ML & AI System Design

## Overview

| # | Track | Part |
|---|---|---|
| 1 | ML System Design | AI |
| 2 | Recommendation & Ranking Systems | AI |
| 3 | LLM System Design | AI |
| 4 | LLM Serving & AI Infrastructure | AI |
| 5 | RAG & Vector Search | AI |
| 6 | Agentic System Design | AI |
| 7 | AI Evals, Safety & Observability | AI |
| — | AI System Design Case Studies | AI |
| — | Miscellaneous | Extra |

> Core System Design lives in [content/system-design](content/system-design/roadmap.md).

---

# PART 1 — AI SYSTEM DESIGN


> Extends traditional System Design into ML, LLMs, RAG, Agents and production AI infrastructure. Goal: architecture-level understanding, not ML research.

## Track 1 — ML System Design

**AI System Design Foundations** — why AI systems behave differently from deterministic applications:
- Traditional Software vs ML Systems
- Training vs Inference
- Batch vs Online Inference
- Offline vs Real-Time Systems
- Deterministic vs Probabilistic Systems
- Model Quality vs System Quality
- Latency vs Accuracy vs Cost
- Model Drift
- Data Drift

**Case Study:** Design Uber ETA Prediction

**Production ML Architecture** — full lifecycle:
- Data Collection
- Data Validation
- Feature Engineering
- Feature Stores
- Training Pipelines
- Model Registry
- Model Deployment
- Online Inference
- Batch Inference
- Monitoring
- Retraining

**ML Metrics**
- Offline Metrics
- Online Metrics
- Business Metrics
- A/B Testing

---

## Track 2 — Recommendation & Ranking Systems

> The architecture behind modern personalisation systems.

**Recommendation Architecture**
- Candidate Generation
- Ranking
- Reranking
- Embeddings
- Two-Tower Models
- Feature Stores
- Online Features
- Offline Features

**Production Challenges**
- Cold Start
- Feedback Loops
- Exploration vs Exploitation

**Case Studies**
- Design YouTube / Netflix Recommendations
- Design People You May Know
- Design Search Ranking

---

## Track 3 — LLM System Design

> Architecture-level concepts needed to reason about modern LLM products.

**LLM Fundamentals**
- Tokens
- Tokenization
- Context Windows
- Prompt vs Completion
- Streaming
- Time to First Token
- Tokens Per Second

**Model Execution**
- Prefill
- Decode
- Attention
- KV Cache
- Batching
- Continuous Batching

**Model Optimisation**
- Quantization
- Model Compression
- Small vs Large Models
- Hosted vs Self-Hosted Models

**Architectural Decisions** — when to use:
- Prompting
- Fine-Tuning
- RAG
- Small Models
- Large Models

---

## Track 4 — LLM Serving & AI Infrastructure

> What happens once an LLM application has to serve real production traffic.

**Serving & Scaling**
- GPU vs CPU Inference
- GPU Memory
- Model Replicas
- Request Queues
- Model Routing
- Autoscaling
- Streaming Responses
- Continuous Batching
- KV-Cache Management
- Token-Based Rate Limiting
- Multi-Tenancy

**Optimisation**
- Prompt Caching
- Semantic Caching
- Response Caching
- Model Fallback
- Provider Routing

**Infrastructure**
- vLLM
- Triton
- Kubernetes GPU Workloads
- GPU Scheduling

**AI Economics & Capacity Estimation**
- Tokens per Request
- Requests per Day
- Input Tokens
- Output Tokens
- Concurrent Users
- GPU Throughput
- Cost per Request
- Cost per Customer
- Model Pricing
- GPU Utilisation

**Cost Exercise**
> An AI product serves 10M queries/day. Reduce inference cost by 40% without materially hurting quality.

**Advanced Distributed AI Infrastructure**
- Distributed Training Concepts
- Data Parallelism
- Tensor Parallelism
- Pipeline Parallelism
- Distributed Checkpoints
- Distributed Inference
- Model Parallelism
- GPU Scheduling
- Request Scheduling
- Dynamic Batching
- KV-Cache Distribution
- Disaggregated Prefill / Decode

**Flagship Case Study:** Design ChatGPT at Scale

---

## Track 5 — RAG & Vector Search

> Beyond the basic Document → Embedding → Vector DB → LLM.

**Indexing Pipeline**
Documents → Parse → Chunk → Embed → Index → Vector Database

**Retrieval Pipeline**
User Query → Query Processing → Retrieval → Hybrid Search → Reranking → Context Builder → LLM

**Core Topics**
- Embeddings
- Chunking
- Vector Databases
- ANN Search
- HNSW
- Metadata Filtering
- Semantic Search
- BM25
- Hybrid Search

**Production RAG**
- Multi-Tenant RAG
- Permission-Aware RAG
- Document Updates
- Index Freshness
- Retrieval Evaluation
- RAG Caching
- Cost Optimisation

**Case Studies**
- Design Enterprise Document Q&A
- Design Perplexity

---

## Track 6 — Agentic System Design

> Architecting systems that reason, plan, use tools and execute long-running workflows.

**Agent Fundamentals**
- Agent Loop
- Reasoning
- Planning
- Tool Calling
- Function Calling

**Agent Memory**
- Conversation Memory
- Working Memory
- Long-Term Memory
- Vector Memory

**Agent Patterns**
- ReAct
- Planner / Executor
- Router
- Supervisor
- Workflow Agents
- Autonomous Agents

**Multi-Agent Systems**
- Agent Communication
- Delegation
- Orchestration
- Sub-Agents

**Reliability**
- Retries
- Checkpoints
- Durable Execution
- Idempotency
- Human-in-the-Loop
- Timeouts
- Cost Budgets

**Agent Security**
- Tool Permissions
- Sandboxing
- Prompt Injection
- Unsafe Tool Execution

**Case Studies**
- Customer Support Agent
- Deep Research Agent
- Coding Agent
- Multi-Agent Workflow

---

## Track 7 — AI Evals, Safety & Observability

> Traditional systems are monitored on latency, availability, throughput and errors. AI systems need all of those, plus a measure of whether the output itself is good.

**AI Evaluation** — what to monitor:
- Answer Quality
- Hallucination Rate
- Groundedness
- Retrieval Quality
- Tool-Call Success
- Agent Completion Rate
- Token Usage
- Cost per Request
- Safety Violations

**Evaluation Methods**
- Golden Datasets
- Human Evaluation
- LLM-as-a-Judge
- RAG Evaluation
- Agent Evaluation
- Offline Evaluation
- Online Evaluation

**Production Evaluation**
- A/B Testing
- Shadow Deployment
- Canary Deployment
- Prompt Versioning
- Model Versioning
- Tracing

**AI Safety & Security**
- Hallucinations
- Prompt Injection
- Indirect Prompt Injection
- Data Leakage
- PII Exposure
- Tenant Isolation

---

## AI System Design Case Studies

**Machine Learning**
- Uber ETA Prediction
- Fraud Detection
- YouTube Recommendations
- Instagram Feed Ranking
- People You May Know

**GenAI**
- ChatGPT
- GitHub Copilot
- AI Search
- Text-to-Image Service
- Meeting Assistant

**RAG**
- Enterprise Knowledge Assistant
- Perplexity-Style Search
- Internal Company Search

**Agents**
- Customer Support Agent
- Coding Agent
- Deep Research Agent

**Infrastructure**
- AI Gateway
- LLM Serving Platform
- AI Evaluation Platform
- Multi-Tenant AI Platform

---

# PART 2 — MISCELLANEOUS

## M1 — ML Fundamentals *(only for MLE-titled roles)*

- Supervised vs unsupervised learning
- Bias–variance trade-off
- Overfitting & regularisation (L1/L2, dropout)
- Classical models: linear/logistic regression, decision trees, random forests, gradient boosting
- Evaluation metrics: precision, recall, F1, ROC-AUC, PR-AUC, NDCG
- Train/validation/test splits, cross-validation, data leakage
- Class imbalance
- Neural network basics: backprop, optimisers, loss functions
- Transformers & attention at an intuition level
- Fine-tuning approaches: full fine-tuning, LoRA / PEFT

## M2 — Mock Interviews

- 2–3 AI system design mocks
- Record or note each one; review the gaps the same day
- Practise talking through a design out loud, including without a diagram

## M3 — Additional AI Case Studies

> Not already covered in the AI case studies above.


| # | Case Study | Key concepts it tests |
|---|---|---|
| 1 | Action-Taking Agent (e.g., travel booking) | Tool permissions, confirmations, durable workflows |
| 2 | Add AI to an Existing Product (e.g., semantic product search) | When to use AI, fallback paths, incremental rollout |
| 3 | Smart Compose / LLM Autocomplete | Latency budgets, small models, on-device vs server |
| 4 | Content Moderation System | Classifier + LLM cascades, human review, appeals |
| 5 | Distributed Training System | Data/model parallelism, checkpointing, GPU scheduling |
| 6 | Multimodal Document Understanding (PDF / image ingestion) | Parsing, OCR, layout-aware chunking, RAG over mixed content |
