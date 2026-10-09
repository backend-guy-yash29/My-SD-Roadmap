# System Design — Curriculum

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
| 10 | Company-Specific Interview Preparation | Interview Prep |
| — | Miscellaneous | Extra |

> ML & AI System Design lives in [ai-ml.md](ai-ml.md).

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

# PART 2 — INTERVIEW PREP

## Track 10 — Company-Specific Interview Preparation

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

# PART 3 — MISCELLANEOUS

> Gaps not covered by Tracks 1–10. DSA is prepared separately.

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

## M4 — Mock Interviews

- 6–8 timed HLD mocks (45–60 min)
- 3–4 timed LLD / machine-coding mocks
- Record or note each one; review the gaps the same day
- Practise talking through a design out loud, including without a diagram

## M5 — Additional Case Studies

> Not already covered in Track 7 or the LLD list.

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
