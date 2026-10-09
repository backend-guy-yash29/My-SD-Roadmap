# Attention Mechanisms

> Why attention replaced recurrence, and how self-attention is built up step by step: from a simple weighted average to causal multi-head attention.

## From RNNs to Attention

- The History of LLMs: From LSTMs to ChatGPT
- Encoder-Decoder (Seq2Seq) Architecture
- The Bottleneck Problem in RNN Encoder-Decoders
- The Attention Mechanism (Bahdanau)
- Bahdanau vs Luong Attention
- Greedy Decoding vs Beam Search

## Self-Attention

- Introduction to Transformers
- What is Self-Attention?
- Simplified Self-Attention (Without Trainable Weights)
- Attention Scores, Attention Weights and Context Vectors
- Trainable Weights: Queries, Keys and Values
- Scaled Dot-Product Attention (Why Divide by √d_k)
- Geometric Intuition of Self-Attention
- Self-Attention vs Bahdanau and Luong Attention

## Causal Attention

- Causal (Masked) Self-Attention
- Implementing the Causal Mask
- Dropout on Attention Weights

## Multi-Head Attention

- Multi-Head Attention
- Efficient Multi-Head Attention via Weight Splitting
- Concatenating Heads and the Output Projection
- Batched Attention and Tensor Shapes

## Projects

- [exercise] Work Through a Numerical Attention Example by Hand
- [exercise] Implement Self-Attention, Causal Attention and Multi-Head Attention from Scratch
