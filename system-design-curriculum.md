# System Design & AI System Design — Curriculum

## Overview

| # | Track | Part |
|---|---|---|
| 1 | System Design Foundations | Core |
| 2 | Databases & Distributed Storage | Core |
| 3 | Networking, Caching & APIs | Core |
| 4 | Kafka & Event-Driven Systems | Core |
| 5 | Distributed Systems & Reliability | Core |
| 6 | Microservices & Advanced Patterns | Core |
| 7 | HLD Case Studies | Core |
| 8 | LLD & Design Patterns | Core |
| 9 | Concurrency & Multithreading | Core |
| 10 | ML System Design | AI |
| 11 | Recommendation & Ranking Systems | AI |
| 12 | LLM System Design | AI |
| 13 | LLM Serving & AI Infrastructure | AI |
| 14 | RAG & Vector Search | AI |
| 15 | Agentic System Design | AI |
| 16 | AI Evals, Safety & Observability | AI |
| 17 | Company-Specific Interview Preparation | Interview Prep |
| — | AI System Design Case Studies | AI |
| — | Miscellaneous | Extra |

---

# PART 1 — CORE SYSTEM DESIGN

## Track 1 — System Design Foundations

> A structured approach to solving System Design problems instead of jumping directly into architecture.

**System Design Interview Framework**
- Understanding the problem
- Functional vs Non-Functional Requirements
- Asking the right clarifying questions
- Identifying core use cases
- Identifying what is out of scope
- Prioritising requirements in a 45–60 minute interview

**Back-of-the-Envelope Estimation**
- DAU / MAU
- Requests per second
- Peak traffic
- Read/write ratio
- Storage estimation
- Bandwidth estimation
- Memory/cache estimation

**Defining System Goals**
- Latency
- Throughput
- Availability
- Durability
- Consistency
- Reliability
- Cost

**Building the First Architecture**
- API Layer
- Application Services
- Databases
- Cache
- Queues
- Object Storage
- Search Systems
- CDN

---

## Track 2 — Databases & Distributed Storage

> From database selection to designing storage for billions of records.

**Database Fundamentals**
- Relational Databases
- ACID Transactions
- Isolation Levels
- Indexes
- B-Trees
- Composite Indexes
- Query Optimisation
- Connection Pooling
- Read Replicas

**NoSQL & Database Selection**
- Key-Value Stores
- Document Databases
- Wide-Column Databases
- Graph Databases
- SQL vs NoSQL
- DynamoDB vs Cassandra
- PostgreSQL vs MongoDB
- Redis vs Persistent Databases
- When not to use NoSQL

**Scaling Databases**
- Vertical vs Horizontal Scaling
- Replication
- Leader-Follower Architecture
- Leaderless Replication
- Multi-Leader Replication
- Range-Based Sharding
- Hash-Based Sharding
- Consistent Hashing
- Resharding
- Hot Partitions
- Global Secondary Indexes
- Cross-Shard Queries
- Distributed Transactions

**Consistency in Distributed Storage**
- CAP Theorem
- PACELC
- Strong Consistency
- Eventual Consistency
- Quorum Reads/Writes
- Read-Your-Writes Consistency

**Case Studies**
- Designing Distributed Counters

---

## Track 3 — Networking, Caching & APIs

**Caching Systems** — caching at every layer:
- Browser Cache
- CDN Cache
- Application Cache
- Database Cache
- Distributed Cache

**Caching Strategies**
- Cache-Aside
- Read-Through
- Write-Through
- Write-Behind
- Refresh-Ahead

**Advanced Caching**
- TTL
- LRU / LFU
- Cache Invalidation
- Cache Stampede
- Cache Penetration
- Cache Avalanche
- Hot Keys
- Distributed Redis
- Cache Consistency

**Caching Case Studies**
- Instagram Feed Caching
- Product Catalogue Caching
- Trending Content Cache
- Large-Scale Session Storage

**Networking**
- TCP vs UDP
- HTTP / HTTPS
- HTTP/1.1 vs HTTP/2 vs HTTP/3
- DNS
- TLS
- Persistent Connections
- WebSockets
- Server-Sent Events
- Long Polling
- gRPC

**Load Balancing**
- Layer 4 vs Layer 7
- Round Robin
- Weighted Round Robin
- Least Connections
- Consistent Hashing
- Health Checks
- Sticky Sessions
- Global Load Balancing
- DNS Load Balancing
- Reverse Proxies
- Edge Infrastructure

**API Design**
- REST
- RPC
- GraphQL
- gRPC
- Pagination
- Cursor Pagination
- API Versioning
- Idempotency
- Rate Limiting
- Authentication
- Authorization
- API Gateway
- Routing
- Logging
- Request Transformation
- Service Aggregation
- Backend-for-Frontend
- Mobile BFF
- Web BFF
- Micro-Frontend Backend Patterns

---

## Track 4 — Kafka & Event-Driven Systems

> How asynchronous systems operate at scale.

**Messaging Fundamentals**
- Synchronous vs Asynchronous Communication
- Producer / Consumer
- Message Brokers
- Queues vs Streams

**Apache Kafka**
- Topics
- Partitions
- Brokers
- Consumer Groups
- Offsets
- Replication
- Partition Leadership
- Ordering Guarantees

**Delivery Semantics**
- At-Most-Once
- At-Least-Once
- Exactly-Once
- Duplicate Processing
- Idempotent Consumers

**Reliability**
- Consumer Lag
- Backpressure
- Dead-Letter Queues
- Retry Queues
- Poison Messages

**Technology Trade-offs**
- Kafka
- RabbitMQ
- SQS
- Pub/Sub
- Redis Streams

---

## Track 5 — Distributed Systems & Reliability

**Distributed Systems Fundamentals**
- Distributed Consensus
- Network Partitions
- Partial Failures
- Clock Synchronisation
- Logical Clocks
- Distributed Locks
- Leader Election
- Split Brain
- Failure Detection

**Reliability Patterns**
- Retries
- Exponential Backoff
- Jitter
- Timeouts
- Circuit Breakers
- Bulkheads
- Load Shedding
- Backpressure

**Advanced Distributed Systems**
- Distributed IDs
- Snowflake IDs
- Consistent Hashing
- Distributed Counters

**Fault-Tolerant & Multi-Region Systems**
- High Availability
- Fault Tolerance
- Disaster Recovery
- RPO / RTO
- Redundancy
- Failover
- Active-Active
- Active-Passive
- Geo-Replication
- Data Residency

**Data-Intensive Systems**
- Batch Processing
- Stream Processing
- Lambda Architecture
- Kappa Architecture
- Data Warehouses
- Data Lakes
- Lakehouses
- Kafka
- Spark
- Flink
- Hadoop
- CDC
- ETL / ELT
- Real-Time Analytics
- Fraud Detection Pipelines
- Recommendation Event Pipelines
- Large-Scale Log Processing

---

## Track 6 — Microservices & Advanced Patterns

**Microservice Architecture**
- Monolith vs Microservices
- Service Boundaries
- Domain-Driven Boundaries
- Database-Per-Service
- Communication Patterns
- Service Discovery

**Distributed Transactions**
- Two-Phase Commit
- Saga Pattern
- Choreography
- Orchestration
- Compensation

**Advanced Architecture Patterns**
- Transactional Outbox
- Change Data Capture
- CQRS
- Event Sourcing
- Anti-Corruption Layer
- Backend-for-Frontend
- Strangler Pattern

**Migration**
- Monolith → Services
- Database Migration
- Zero-Downtime Migration
- Schema Evolution

---

## Track 7 — HLD Case Studies

> Learn individual concepts first, then apply them to complete systems.

**Communication Systems**
- Design WhatsApp / Slack / Google Chat
- Design Notification Service

**Social Systems**
- Design Twitter / X / Instagram News Feed
- Design Followers / Following
- Design Trending Topics
- Design K-Heavy Hitters

**Streaming & Content**
- Design Netflix / YouTube

**Marketplace Systems**
- Design Uber / Food Delivery / Yelp

**Infrastructure Systems**
- Design URL Shortener
- Design Rate Limiter
- Design Distributed Cache
- Design Distributed Job Scheduler
- Design Logging & Metrics Platform

---

## Track 8 — LLD & Design Patterns

**Object-Oriented Design**
- Objects & Classes
- Abstraction
- Encapsulation
- Inheritance
- Polymorphism
- Composition vs Inheritance
- Interfaces
- Dependency Inversion

**SOLID Principles**
Each principle studied as: **Bad Design → Problems → Refactoring → Production Use Case**

**Design Patterns**

*Creational*
- Singleton
- Factory
- Abstract Factory
- Builder
- Prototype

*Structural*
- Adapter
- Decorator
- Facade
- Proxy
- Composite

*Behavioural*
- Strategy
- Observer
- Command
- State
- Chain of Responsibility
- Template Method

*Distributed-System Patterns*
- Saga
- Circuit Breaker
- Retry
- Bulkhead
- CQRS
- Event Sourcing

**LLD Case Studies**
- Parking Lot
- Splitwise
- BookMyShow
- Elevator System
- Chess
- Ecommerce Cart
- Notification System
- Logger
- Rate Limiter
- ATM
- Library Management
- Vending Machine

---

## Track 9 — Concurrency & Multithreading

**Fundamentals**
- Process vs Thread
- Thread Lifecycle
- Race Conditions
- Critical Sections
- Mutex
- Semaphore
- Read/Write Locks
- Atomic Operations

**Advanced Concurrency**
- Deadlocks
- Livelocks
- Starvation
- Thread Pools
- Futures
- Task Queues

---

# PART 2 — AI SYSTEM DESIGN

> Extends traditional System Design into ML, LLMs, RAG, Agents and production AI infrastructure. Goal: architecture-level understanding, not ML research.

## Track 10 — ML System Design

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

## Track 11 — Recommendation & Ranking Systems

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

## Track 12 — LLM System Design

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

## Track 13 — LLM Serving & AI Infrastructure

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

## Track 14 — RAG & Vector Search

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

## Track 15 — Agentic System Design

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

## Track 16 — AI Evals, Safety & Observability

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

# PART 3 — INTERVIEW PREP

## Track 17 — Company-Specific Interview Preparation

> Instead of preparing only from generic questions, understand the types of systems different companies commonly focus on, along with the questions and the expected follow-up style.

**Google**
- Large-Scale Infrastructure
- Distributed Storage
- Search
- Collaboration Systems

**Meta**
- News Feeds
- Messaging
- Social Graphs
- Ranking Systems

**Amazon**
- Commerce
- Distributed Workflows
- Reliability
- Operational Excellence

**Uber**
- Geospatial Systems
- Marketplace Design
- Real-Time Streaming

**Netflix**
- Streaming
- Recommendations
- CDN Systems

---

# PART 4 — MISCELLANEOUS

> Gaps not covered by Tracks 1–17. DSA is prepared separately.

## M1 — Storage Internals

- B-Tree vs LSM-Tree storage engines
- Write-Ahead Log (WAL)
- Memtables & SSTables
- Compaction (size-tiered vs leveled)
- Bloom Filters
- MVCC
- Write amplification vs read amplification
- How Postgres, Cassandra and RocksDB store data on disk

## M2 — Fintech & Money Movement

- Double-entry bookkeeping
- Append-only / immutable ledgers
- Corrections as reversing entries (never UPDATE/DELETE)
- Idempotency keys stored atomically with the ledger write
- Payment state machines (created → authorised → captured → settled / refunded / failed)
- Strong consistency for the ledger, eventual consistency for user-facing views
- Hot accounts & write contention
- PSP integration & webhook handling
- Reconciliation (internal ledger vs bank / PSP records)
- Timeouts where the payment actually succeeded
- Multi-currency handling
- Auditability & compliance basics

## M3 — Behavioral Preparation

- STAR format
- 8–10 stories from real work, each reusable across several questions
- Amazon Leadership Principles as a framework
- Common themes: ownership, conflict, failure, ambiguity, tight deadlines, disagreeing with a senior, biggest technical challenge
- Project deep-dive: architecture, your contribution, trade-offs, metrics, what you'd change
- "Why are you leaving?" / "Why this company?"

## M4 — ML Fundamentals *(only for MLE-titled roles)*

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

## M5 — Mock Interviews

- 6–8 timed HLD mocks (45–60 min)
- 3–4 timed LLD / machine-coding mocks
- 2–3 AI system design mocks
- Record or note each one; review the gaps the same day
- Practise talking through a design out loud, including without a diagram

## M6 — Additional Case Studies

> Not already covered in Track 7, the LLD list, or the AI case studies above.

### Fintech & Commerce

| # | Case Study | Key concepts it tests |
|---|---|---|
| 1 | Payment System (Stripe / PayPal / Razorpay) | Idempotency, PSP integration, webhooks, exactly-once charging |
| 2 | Double-Entry Ledger Service | Append-only writes, hot accounts, balance materialisation, audit |
| 3 | Digital Wallet (Paytm / PhonePe) | Balance consistency, transfers, saga, reconciliation |
| 4 | Peer-to-Peer Money Transfer (UPI-style) | Real-time settlement, timeouts, retries, status polling |
| 5 | Buy-Now-Pay-Later Platform | Credit checks, installment schedules, recurring collections |
| 6 | Stock Exchange / Order Matching Engine | Low latency, order books, sequencing, fairness |
| 7 | Payment Reconciliation System | Batch vs stream matching, mismatch handling, reporting |
| 8 | Flash Sale / E-commerce Checkout & Inventory | Overselling prevention, reservations, queues under spikes |
| 9 | Ticket Booking at Scale (Ticketmaster) | Seat locking, high contention, virtual waiting room |
| 10 | Hotel Reservation System (Airbnb / Booking.com) | Availability search, double-booking prevention |

### Storage & Infrastructure

| # | Case Study | Key concepts it tests |
|---|---|---|
| 11 | File Storage & Sync (Google Drive / Dropbox) | Chunking, deduplication, sync conflicts, metadata DB |
| 12 | Distributed Key-Value Store (DynamoDB-style) | Partitioning, replication, quorum, vector clocks |
| 13 | Object Storage (S3-style) | Durability, erasure coding, metadata service |
| 14 | Distributed Message Queue (Kafka-style) | Log storage, partitions, consumer offsets |
| 15 | Web Crawler | Politeness, URL frontier, dedup, distributed workers |
| 16 | Search Autocomplete / Typeahead | Tries, top-k precomputation, latency budgets |
| 17 | Search Engine (inverted index) | Indexing pipeline, sharding the index, ranking |
| 18 | Code Deployment / CI-CD System | Build queues, artifact storage, rollouts, rollback |
| 19 | Authentication & SSO Platform (Auth0-style) | OAuth/OIDC, tokens, sessions, multi-tenancy |
| 20 | Ad Click Aggregation | Stream aggregation, windowing, exactly-once counts |
| 21 | Real-Time Gaming Leaderboard | Sorted sets, sharding rankings, top-k |
| 22 | Proximity Service / Nearby Friends | Geohash, quadtree, location updates at scale |
| 23 | Google Maps (routing & ETA) | Graph partitioning, tile serving, traffic updates |

### Social, Media & Real-Time

| # | Case Study | Key concepts it tests |
|---|---|---|
| 24 | Collaborative Editing (Google Docs) | OT vs CRDT, presence, conflict resolution |
| 25 | Video Conferencing (Zoom) | WebRTC, SFU vs MCU, media servers |
| 26 | Reddit / Quora | Voting, ranking, comment trees, caching |
| 27 | Live Comments / Live Streaming (Facebook Live) | Fan-out to viewers, pub/sub, backpressure |
| 28 | Email Service (Gmail) | Storage, search, spam filtering, delivery |
| 29 | Music Streaming (Spotify) | Audio CDN, playlists, offline sync |

### Additional AI

| # | Case Study | Key concepts it tests |
|---|---|---|
| 30 | Action-Taking Agent (e.g., travel booking) | Tool permissions, confirmations, durable workflows |
| 31 | Add AI to an Existing Product (e.g., semantic product search) | When to use AI, fallback paths, incremental rollout |
| 32 | Smart Compose / LLM Autocomplete | Latency budgets, small models, on-device vs server |
| 33 | Content Moderation System | Classifier + LLM cascades, human review, appeals |
| 34 | Distributed Training System | Data/model parallelism, checkpointing, GPU scheduling |
| 35 | Multimodal Document Understanding (PDF / image ingestion) | Parsing, OCR, layout-aware chunking, RAG over mixed content |
