# Transformer Architecture

> The full Transformer: how a token travels from the input block through stacked Transformer blocks to the output head, and the model families built on it.

## The Input Block

- The Journey of a Token Through a Transformer
  - [Vizuara Transformers: Journey of a token (0:44)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=44s)
- Tokenization Strategies (Word, Character, Subword)
  - [Vizuara Transformers: Tokenization strategies (8:24)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=504s)
- Byte Pair Encoding (BPE)
  - [Vizuara Transformers: Byte pair encoding (11:39)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=699s)
- Token IDs and the Embedding Layer
  - [Vizuara Transformers: Token IDs and embedding (18:31)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=1111s)
- Embeddings as a Semantic Vector Space
  - [Vizuara Transformers: Vector space semantics (20:11)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=1211s)
- Positional Encoding (Learned, Sinusoidal, RoPE)
  - [CampusX: Positional Encoding in Transformers](https://www.youtube.com/watch?v=GeoQBNNqIbM)
  - [Vizuara Transformers: Positional embedding (25:15)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=1515s)

## The Transformer Block

- Layer Normalization vs Batch Normalization
  - [CampusX: Layer Normalization in Transformers](https://www.youtube.com/watch?v=qti0QPdaelg)
  - [Vizuara Transformers: Layer normalization (36:35)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=2195s)
- Skip (Residual) Connections and Pre-Norm vs Post-Norm
  - [Vizuara Transformers: Skip connections (39:33)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=2373s)
- Dropout in Transformer Blocks
  - [Vizuara Transformers: Dropout technique (43:41)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=2621s)
- Feed-Forward Network (Expansion and GELU)
  - [Vizuara Transformers: Feed forward network (50:12)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=3012s)
- Stacking Transformer Blocks
  - [Vizuara Transformers: Block stacking and parameters (55:26)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=3326s)

## Output & Training

- The Output Head and Logits
  - [Vizuara Transformers: Output section (59:41)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=3581s)
- Training Objective: Next-Token Prediction with Cross-Entropy
  - [Vizuara Transformers: Training and prediction (1:04:22)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=3862s)
- Transformer Inference (The Generation Loop)
  - [CampusX: Transformer Inference](https://www.youtube.com/watch?v=FtsMOzlwxws)

## Encoder & Decoder

- Encoder Architecture
  - [CampusX: Transformer Architecture](https://www.youtube.com/watch?v=Vs87qcdm8l0)
- Cross-Attention
  - [CampusX: Cross Attention in Transformers](https://www.youtube.com/watch?v=smOnJtCevoU)
- Decoder Architecture
  - [CampusX: Transformer Decoder Architecture](https://www.youtube.com/watch?v=DI2_hrAulYo)

## Transformer Families

- Encoder-Only Models (BERT)
- Decoder-Only Models (GPT)
- Encoder-Decoder Models (T5)
- Vision Transformer (ViT)
- Efficient Attention (Sparse, Linear, Sliding Window)

## Projects

- [exercise] Count GPT-3's Parameters Block by Block
  - [Vizuara Transformers: GPT-3 parameter calculation (3:44:08)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=13448s)
- [exercise] Build a GPT-Style Transformer Block in PyTorch
