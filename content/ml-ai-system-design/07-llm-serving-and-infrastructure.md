# LLM Serving & AI Infrastructure

> What happens once an LLM application has to serve real production traffic.

## Serving & Scaling

- GPU vs CPU Inference
- GPU Memory
- Model Replicas
- Request Queues
- Model Routing
- Autoscaling
- Streaming Responses
- KV-Cache Management
- Token-Based Rate Limiting
- Multi-Tenancy

## Inference Optimisation

- PagedAttention
- FlashAttention
- Prefix Caching
- Chunked Prefill
- Speculative Decoding
- Weight and KV-Cache Quantization (INT8, FP8, INT4)
- Multi-LoRA Serving

## Caching & Fallbacks

- Prompt Caching
- Semantic Caching
- Response Caching
- Model Fallback
- Provider Routing

## Infrastructure

- vLLM
- Triton
- Kubernetes GPU Workloads
- GPU Scheduling
- AI Accelerators (GPUs, TPUs)

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

## Case Studies

- [case-study] ChatGPT at Scale
