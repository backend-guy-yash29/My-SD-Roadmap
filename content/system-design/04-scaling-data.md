# Scaling Data & Storage

> Replication, sharding and consistency for data that outgrows one machine, plus file and object storage.

## Scaling Reads

- Query Optimization
  - [AlgoMaster: Query Optimization](https://algomaster.io/learn/system-design/query-optimization)
  - [AlgorithmXlr8 HLD: Query Optimization](https://algorithmxlr8.io/hld/topic/query-optimization)
- Connection Pooling
  - [AlgoMaster: Connection Pooling](https://algomaster.io/learn/system-design/connection-pooling)
  - [AlgorithmXlr8 HLD: Connection Pooling](https://algorithmxlr8.io/hld/topic/connection-pooling)
- Read Replicas
  - [AlgoMaster: Database Replication](https://algomaster.io/learn/system-design/database-replication)
  - [AlgorithmXlr8 HLD: Read Replicas](https://algorithmxlr8.io/hld/topic/read-replicas)
- Denormalization
  - [AlgoMaster: Denormalization](https://algomaster.io/learn/system-design/denormalization)
  - [AlgorithmXlr8 HLD: Denormalization](https://algorithmxlr8.io/hld/topic/denormalization)
- Materialized Views
  - [AlgoMaster: Materialized Views](https://algomaster.io/learn/system-design/materialized-views)
  - [AlgorithmXlr8 HLD: Materialized Views](https://algorithmxlr8.io/hld/topic/materialized-views)

## Replication

- Leader-Follower Replication
  - [AlgoMaster: Database Replication](https://algomaster.io/learn/system-design/database-replication)
- Multi-Leader Replication
  - [AlgoMaster: Database Replication](https://algomaster.io/learn/system-design/database-replication)
- Leaderless Replication
  - [AlgoMaster: Database Replication](https://algomaster.io/learn/system-design/database-replication)
- Synchronous vs Asynchronous Replication
- Replication Lag and Read-Your-Writes

## Partitioning & Sharding

- Vertical vs Horizontal Partitioning
  - [AlgoMaster: Database Partitioning](https://algomaster.io/learn/system-design/database-partitioning)
  - [AlgorithmXlr8 HLD: Vertical Partitioning](https://algorithmxlr8.io/hld/topic/vertical-partitioning)
  - [AlgorithmXlr8 HLD: Sharding vs Partitioning](https://algorithmxlr8.io/hld/topic/sharding-vs-partitioning)
- Range-Based Sharding
  - [AlgoMaster: Sharding](https://algomaster.io/learn/system-design/sharding)
  - [AlgorithmXlr8 HLD: Sharding](https://algorithmxlr8.io/hld/topic/sharding)
- Hash-Based Sharding
  - [AlgoMaster: Sharding](https://algomaster.io/learn/system-design/sharding)
  - [AlgorithmXlr8 HLD: Sharding](https://algorithmxlr8.io/hld/topic/sharding)
- Consistent Hashing
  - [AlgoMaster: Consistent Hashing](https://algomaster.io/learn/system-design/consistent-hashing)
  - [AlgorithmXlr8 HLD: Consistent Hashing](https://algorithmxlr8.io/hld/topic/consistent-hashing)
- Resharding and Rebalancing
- Hot Partitions
- Global Secondary Indexes
- Cross-Shard Queries

## Consistency

- CAP Theorem
  - [AlgoMaster: CAP Theorem](https://algomaster.io/learn/system-design/cap-theorem)
  - [AlgorithmXlr8 HLD: CAP Theorem](https://algorithmxlr8.io/hld/topic/cap-theorem)
- PACELC
  - [AlgorithmXlr8 HLD: Latency vs Consistency Tradeoffs](https://algorithmxlr8.io/hld/topic/latency-vs-consistency-tradeoffs)
- Strong vs Eventual Consistency
  - [AlgoMaster: Consistency Models](https://algomaster.io/learn/system-design/consistency-models)
  - [AlgorithmXlr8 HLD: Strong vs Eventual Consistency](https://algorithmxlr8.io/hld/topic/strong-vs-eventual-consistency)
- Consistency Models
  - [AlgoMaster: Consistency Models](https://algomaster.io/learn/system-design/consistency-models)
  - [AlgorithmXlr8 HLD: Consistency Models](https://algorithmxlr8.io/hld/topic/consistency-models)
- Quorum Reads and Writes

## Storage Systems

- Block vs File vs Object Storage
  - [AlgoMaster: Block vs File vs Object Storage](https://algomaster.io/learn/system-design/block-vs-file-vs-object-storage)
  - [AlgorithmXlr8 HLD: File Storage](https://algorithmxlr8.io/hld/topic/file-storage)
  - [AlgorithmXlr8 HLD: Block Storage](https://algorithmxlr8.io/hld/topic/block-storage)
- Object Storage
  - [AlgoMaster: Object Storage](https://algomaster.io/learn/system-design/object-storage)
  - [AlgoMaster Interviews: S3](https://algomaster.io/learn/system-design-interviews/s3)
  - [AlgorithmXlr8 HLD: Object Storage](https://algorithmxlr8.io/hld/topic/object-storage)
- Distributed File Systems
  - [AlgoMaster: Distributed File Systems](https://algomaster.io/learn/system-design/distributed-file-systems)
  - [AlgorithmXlr8 HLD: Distributed File Systems](https://algorithmxlr8.io/hld/topic/distributed-file-systems)
- Erasure Coding
  - [AlgoMaster: Erasure Coding](https://algomaster.io/learn/system-design/erasure-coding)

## Case Studies

- [case-study] Designing Distributed Counters
