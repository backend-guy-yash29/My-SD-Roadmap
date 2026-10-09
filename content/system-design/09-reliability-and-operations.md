# Reliability & Operations

> Keeping systems up under failure, watching them in production, shipping safely, and securing them.

## Reliability Patterns

- Timeouts
  - [AlgorithmXlr8 LLD: Timeouts](https://algorithmxlr8.io/lld/timeouts)
- Retries with Exponential Backoff and Jitter
  - [AlgorithmXlr8 LLD: Retry Mechanisms](https://algorithmxlr8.io/lld/retry-mechanisms)
- Circuit Breakers
  - [AlgoMaster: Circuit Breaker Pattern](https://algomaster.io/learn/system-design/circuit-breaker-pattern)
  - [AlgorithmXlr8 LLD: Circuit Breaker](https://algorithmxlr8.io/lld/circuit-breaker)
  - [AlgorithmXlr8 HLD: Circuit Breaker Pattern](https://algorithmxlr8.io/hld/topic/circuit-breaker-pattern)
- Bulkheads
  - [AlgoMaster: Bulkhead Pattern](https://algomaster.io/learn/system-design/bulkhead-pattern)
  - [AlgorithmXlr8 HLD: Bulkhead Pattern](https://algorithmxlr8.io/hld/topic/bulkhead-pattern)
- Load Shedding
- Graceful Degradation
- Graceful Shutdown
  - [AlgorithmXlr8 HLD: Graceful Shutdown](https://algorithmxlr8.io/hld/topic/graceful-shutdown)

## High Availability & Multi-Region

- Redundancy and Failover
  - [AlgoMaster Interviews: Surviving Component Failures](https://algomaster.io/learn/system-design-interviews/surviving-component-failures)
- Active-Active vs Active-Passive
  - [AlgoMaster Interviews: Running Across Multiple Regions](https://algomaster.io/learn/system-design-interviews/multi-region-architecture)
- Geo-Replication
  - [AlgoMaster Interviews: Running Across Multiple Regions](https://algomaster.io/learn/system-design-interviews/multi-region-architecture)
  - [AlgorithmXlr8 HLD: Multi-Region Databases](https://algorithmxlr8.io/hld/topic/multi-region-databases)
- Disaster Recovery, RPO and RTO
- Data Residency

## Observability

- Three Pillars of Observability
  - [AlgoMaster: Three Pillars of Observability](https://algomaster.io/learn/system-design/three-pillars-observability)
  - [AlgorithmXlr8 HLD: Three Pillars of Observability](https://algorithmxlr8.io/hld/topic/three-pillars-of-observability)
- Structured Logging and Log Aggregation
  - [AlgoMaster: Logging Best Practices](https://algomaster.io/learn/system-design/logging)
  - [AlgoMaster: Log Aggregation](https://algomaster.io/learn/system-design/log-aggregation)
  - [AlgorithmXlr8 HLD: Logging Best Practices](https://algorithmxlr8.io/hld/topic/logging-best-practices)
  - [AlgorithmXlr8 HLD: Log Aggregation](https://algorithmxlr8.io/hld/topic/log-aggregation)
- Metrics and Instrumentation
  - [AlgoMaster: Metrics and Instrumentation](https://algomaster.io/learn/system-design/metrics-instrumentation)
  - [AlgorithmXlr8 HLD: Metrics and Instrumentation](https://algorithmxlr8.io/hld/topic/metrics-and-instrumentation)
- Distributed Tracing and Correlation IDs
  - [AlgoMaster: Distributed Tracing](https://algomaster.io/learn/system-design/distributed-tracing)
  - [AlgorithmXlr8 HLD: Correlation IDs](https://algorithmxlr8.io/hld/topic/correlation-ids)
  - [AlgorithmXlr8 HLD: Distributed Tracing](https://algorithmxlr8.io/hld/topic/distributed-tracing)
- Alerting, Dashboards and Runbooks
  - [AlgoMaster: Alerts and Monitoring](https://algomaster.io/learn/system-design/alert-monitoring)
  - [AlgoMaster: Dashboards & Runbooks](https://algomaster.io/learn/system-design/dashboards-runbooks)
  - [AlgorithmXlr8 HLD: Alerting and Monitoring](https://algorithmxlr8.io/hld/topic/alerting-and-monitoring)
  - [AlgorithmXlr8 HLD: Dashboards and Runbooks](https://algorithmxlr8.io/hld/topic/dashboards-and-runbooks)
- SLIs, SLOs and SLAs
  - [AlgorithmXlr8 HLD: SLOs, SLIs, SLAs](https://algorithmxlr8.io/hld/topic/slos-slis-slas)

## Deployment

- CI/CD Pipelines
  - [AlgoMaster: CI/CD Pipelines New](https://algomaster.io/learn/system-design/ci-cd-pipelines)
- Rolling Deployments
  - [AlgoMaster: Rolling Deployments New](https://algomaster.io/learn/system-design/rolling-deployments)
- Blue-Green Deployments
  - [AlgoMaster: Blue-Green Deployments New](https://algomaster.io/learn/system-design/blue-green-deployments)
- Canary Releases
  - [AlgoMaster: Canary Releases New](https://algomaster.io/learn/system-design/canary-releases)
- Feature Flags
  - [AlgoMaster: Feature Flags New](https://algomaster.io/learn/system-design/feature-flags)
- Zero-Downtime Schema Migrations
  - [AlgoMaster: Schema Migrations New](https://algomaster.io/learn/system-design/schema-migrations)
- Rollbacks
  - [AlgoMaster: Rollbacks & Immutable Infrastructure New](https://algomaster.io/learn/system-design/rollbacks-and-immutable-infrastructure)

## Security

- Encryption in Transit and at Rest
  - [AlgoMaster: SSL/TLS](https://algomaster.io/learn/system-design/ssl-tls)
  - [AlgoMaster: Encryption at Rest](https://algomaster.io/learn/system-design/encryption-at-rest)
  - [AlgorithmXlr8 HLD: SSL/TLS Deep Dive](https://algorithmxlr8.io/hld/topic/ssl-tls-deep-dive)
  - [AlgorithmXlr8 HLD: Encryption at Rest and in Transit](https://algorithmxlr8.io/hld/topic/encryption-at-rest-and-in-transit)
- Secrets Management
  - [AlgoMaster: Secrets Management](https://algomaster.io/learn/system-design/secrets-management)
  - [AlgorithmXlr8 HLD: Secrets Management](https://algorithmxlr8.io/hld/topic/secrets-management)
- Password Storage
  - [AlgoMaster: Password Management](https://algomaster.io/learn/system-design/password-management)
- RBAC
  - [AlgoMaster: RBAC](https://algomaster.io/learn/system-design/rbac)
  - [AlgorithmXlr8 HLD: RBAC](https://algorithmxlr8.io/hld/topic/rbac)
- Zero Trust Architecture
  - [AlgorithmXlr8 HLD: Zero Trust Architecture](https://algorithmxlr8.io/hld/topic/zero-trust-architecture)
