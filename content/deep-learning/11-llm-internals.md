# LLM Internals

> How a decoder-only Transformer becomes an LLM: pretraining at scale, modern architecture choices, and generating output one token at a time.

## Pretraining

- Pretraining Data
- Scaling Laws
- Mixture of Experts (MoE)

## Modern LLM Architecture

- RMSNorm and SwiGLU in Modern LLMs
- Multi-Query and Grouped-Query Attention (MQA, GQA)
- Long-Context Extension
- Multimodal LLMs (Vision-Language Models)

## Context

- Context Windows
- Prompt vs Completion

## Inference Mechanics

- Prefill
- Decode
- KV Cache
- FlashAttention

## Sampling & Outputs

- Sampling Strategies (Temperature, Top-k, Top-p)
- Structured Outputs and Constrained Decoding
- Test-Time Compute and Reasoning Models
- The Probabilistic Nature of LLM Output
- In-Context Learning and Chain-of-Thought
