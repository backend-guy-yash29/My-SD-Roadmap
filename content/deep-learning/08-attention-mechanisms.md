# Attention Mechanisms

> Why attention replaced recurrence, and how self-attention is built up step by step: from a simple weighted average to causal multi-head attention.

## From RNNs to Attention

- The History of LLMs: From LSTMs to ChatGPT
  - [CampusX: The Epic History of Large Language Models (LLMs)](https://www.youtube.com/watch?v=8fX3rOjTloc)
- Encoder-Decoder (Seq2Seq) Architecture
  - [CampusX: Encoder Decoder](https://www.youtube.com/watch?v=KiL74WsgxoA)
  - [Vizuara Transformers: Encoder-decoder models (1:19:39)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=4779s)
- The Bottleneck Problem in RNN Encoder-Decoders
  - [Vizuara Transformers: Limitations and badano attention (1:32:11)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=5531s)
- The Attention Mechanism (Bahdanau)
  - [CampusX: Attention Mechanism in 1 video](https://www.youtube.com/watch?v=rj5V6q6-XUM)
  - [Vizuara Transformers: Attention visual analysis (1:37:01)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=5821s)
- Bahdanau vs Luong Attention
  - [CampusX: Bahdanau Attention Vs Luong Attention](https://www.youtube.com/watch?v=0hZT4_fHfNQ)
- Greedy Decoding vs Beam Search

## Self-Attention

- Introduction to Transformers
  - [CampusX: Introduction to Transformers](https://www.youtube.com/watch?v=BjRVS2wTtcA)
- What is Self-Attention?
  - [CampusX: What is Self Attention](https://www.youtube.com/watch?v=XnGGmvpDLA0)
- Simplified Self-Attention (Without Trainable Weights)
  - [Vizuara Transformers: Simplified self attention (1:52:17)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=6737s)
- Attention Scores, Attention Weights and Context Vectors
  - [Vizuara Transformers: Context vector calculation (1:55:17)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=6917s)
- Trainable Weights: Queries, Keys and Values
  - [CampusX: Self Attention in Transformers](https://www.youtube.com/watch?v=-tCKPl_8Xb8)
  - [Vizuara Transformers: Trainable attention weights (2:03:52)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=7432s)
- Scaled Dot-Product Attention (Why Divide by √d_k)
  - [CampusX: Scaled Dot Product Attention](https://www.youtube.com/watch?v=r7mAt0iVqwo)
  - [Vizuara Transformers: Scaling and softmax (2:22:32)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=8552s)
- Geometric Intuition of Self-Attention
  - [CampusX: Self Attention Geometric Intuition](https://www.youtube.com/watch?v=5ZgGuujZSbs)
- Self-Attention vs Bahdanau and Luong Attention
  - [CampusX: Why is Self Attention called "Self"?](https://www.youtube.com/watch?v=o4ZVA0TuDRg)
  - [Vizuara Transformers: Self attention vs badano (1:47:12)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=6432s)

## Causal Attention

- Causal (Masked) Self-Attention
  - [CampusX: Masked Self Attention](https://www.youtube.com/watch?v=m6onaKFzF94)
  - [Vizuara Transformers: Causal attention breakdown (5:49:10)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=20950s)
- Implementing the Causal Mask
  - [Vizuara Transformers: Causal mask implementation (4:16:43)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=15403s)
- Dropout on Attention Weights
  - [Vizuara Transformers: Dropout mask code (6:10:32)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=22232s)

## Multi-Head Attention

- Multi-Head Attention
  - [CampusX: What is Multi-head Attention in Transformers](https://www.youtube.com/watch?v=bX2QwpjsmuA)
  - [Vizuara Transformers: Multi-head attention overview (4:37:35)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=16655s)
- Efficient Multi-Head Attention via Weight Splitting
  - [Vizuara Transformers: Multi-head attention efficiency (3:23:35)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=12215s)
- Concatenating Heads and the Output Projection
  - [Vizuara Transformers: Concatenation logic (3:16:16)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=11776s)
- Batched Attention and Tensor Shapes
  - [Vizuara Transformers: Batch processing (5:03:51)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=18231s)

## Projects

- [exercise] Work Through a Numerical Attention Example by Hand
  - [Vizuara Transformers: Numerical example (2:34:55)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=9295s)
- [exercise] Implement Self-Attention, Causal Attention and Multi-Head Attention from Scratch
  - [Vizuara Transformers: Trainable weight implementation (2:37:55)](https://www.youtube.com/watch?v=i3-bjM3VhJQ&t=9475s)
