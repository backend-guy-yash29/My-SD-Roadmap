# Distributed Systems

> What breaks when a system spans many machines, and the algorithms that keep it consistent.

## Challenges of Distribution

- Partial Failures
- Network Partitions
- Split Brain
- Heartbeats and Failure Detection

## Time & Ordering

- Clock Synchronization and Clock Skew
- Lamport Timestamps
- Vector Clocks

## Coordination & Consensus

- Consensus Algorithms Overview
- Raft
- Paxos
- Leader Election
- Distributed Locks
- Gossip Protocol
- ZooKeeper and etcd

## Distributed Transactions

- Why Distributed Transactions Are Hard
- Two-Phase Commit (2PC)
- Three-Phase Commit (3PC)
- Saga Pattern (Choreography vs Orchestration)
- Compensating Transactions
- Transactional Outbox
- ACID vs BASE

## Collaborative Data

- CRDTs
- Operational Transformation

## Unique IDs

- UUIDs vs Database Sequences
- Snowflake IDs
