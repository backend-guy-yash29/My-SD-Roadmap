# Transformer Architecture

> The full Transformer: how a token travels from the input block through stacked Transformer blocks to the output head, and the model families built on it.

## The Input Block

- The Journey of a Token Through a Transformer
- Tokenization Strategies (Word, Character, Subword)
- Byte Pair Encoding (BPE)
- Token IDs and the Embedding Layer
- Embeddings as a Semantic Vector Space
- Positional Encoding (Learned, Sinusoidal, RoPE)

## The Transformer Block

- Layer Normalization vs Batch Normalization
- Skip (Residual) Connections and Pre-Norm vs Post-Norm
- Dropout in Transformer Blocks
- Feed-Forward Network (Expansion and GELU)
- Stacking Transformer Blocks

## Output & Training

- The Output Head and Logits
- Training Objective: Next-Token Prediction with Cross-Entropy
- Transformer Inference (The Generation Loop)

## Encoder & Decoder

- Encoder Architecture
- Cross-Attention
- Decoder Architecture

## Transformer Families

- Encoder-Only Models (BERT)
- Decoder-Only Models (GPT)
- Encoder-Decoder Models (T5)
- Vision Transformer (ViT)
- Efficient Attention (Sparse, Linear, Sliding Window)

## Projects

- [exercise] Count GPT-3's Parameters Block by Block
- [exercise] Build a GPT-Style Transformer Block in PyTorch
