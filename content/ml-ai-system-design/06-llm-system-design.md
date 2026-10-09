# LLM System Design

> Architecture-level concepts needed to reason about modern LLM products.

## LLM Fundamentals

- Tokens
- Tokenization
- Context Windows
- Prompt vs Completion
- Streaming
- Time to First Token
- Tokens per Second

## Model Execution

- Prefill
- Decode
- Attention
- KV Cache
- Batching
- Continuous Batching

## Sampling & Outputs

- Sampling Strategies (Temperature, Top-k, Top-p)
- Structured Outputs and Constrained Decoding
- Test-Time Compute and Reasoning Models
- The Probabilistic Nature of LLM Output

## Model Optimisation

- Quantization
- Model Compression
- Small vs Large Models
- Hosted vs Self-Hosted Models

## Architectural Decisions

- When to Use Prompting
- When to Fine-Tune
- When to Use RAG
- When to Use Small Models
- When to Use Large Models
- Build vs Buy and Model Selection

## Fine-Tuning Systems

- Supervised Fine-Tuning Pipelines
- Parameter-Efficient Fine-Tuning (LoRA)
- Preference Fine-Tuning (RLHF, DPO)
- Fine-Tuning Memory Math
- Dataset Curation for Fine-Tuning
- Model Distillation

## AI Application Architecture

- Context Construction
- Guardrails Layer
- Model Router and AI Gateway
- Caching Layers
- User Feedback Loops
