# AI Infrastructure & Economics

> The hardware and platforms underneath AI systems, how work is split across GPUs, and what it all costs.

## Infrastructure

- AI Accelerators (GPUs, TPUs)
- vLLM
- Triton
- Kubernetes GPU Workloads
- GPU Scheduling

## AI Economics & Capacity Estimation

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
- [exercise] An AI product serves 10M queries/day. Reduce inference cost by 40% without materially hurting quality

## Distributed Training & Inference

- Distributed Training Concepts
- Data Parallelism
- Tensor Parallelism
- Pipeline Parallelism
- Model Parallelism
- Distributed Checkpoints
- Distributed Inference
- Request Scheduling
- Dynamic Batching
- KV-Cache Distribution
- Disaggregated Prefill / Decode
