# Deep Learning Interview Prep

> Explaining concepts out loud, implementing core pieces from scratch, quick estimates, and what NVIDIA, Google and JPMorgan Chase tend to probe.

## Concept Questions

- [practice] Why Do Neural Networks Need Non-Linear Activations?
- [practice] Why ReLU over Sigmoid, and What Is a Dying ReLU?
- [practice] Causes and Fixes for Vanishing and Exploding Gradients
- [practice] Why Does Zero Initialization Fail?
- [practice] Cross-Entropy vs MSE for Classification
- [practice] Batch Norm vs Layer Norm, and Batch Norm at Inference
- [practice] How Dropout Behaves at Training vs Inference
- [practice] Adam vs SGD, and When SGD Generalizes Better
- [practice] Why Transformers Replaced RNNs
- [practice] Why Scale Attention by √d_k?
- [practice] How the KV Cache Works and What It Costs
- [practice] LoRA vs Full Fine-Tuning Trade-offs

## Implement from Scratch

- [exercise] Numerically Stable Softmax and Cross-Entropy
- [exercise] Linear Layer Forward and Backward Pass
- [exercise] Two-Layer MLP with a Training Loop in NumPy
- [exercise] Dropout and Batch Norm (Train and Eval Modes)
- [exercise] One Adam Update Step
- [exercise] Scaled Dot-Product and Multi-Head Attention
- [exercise] Conv2D Forward Pass
- [exercise] Top-k and Top-p Sampling

## Back-of-the-Envelope

- [exercise] Count Parameters of a Conv Layer and a Transformer Block
- [exercise] Estimate KV-Cache Memory for a Model and Context Length
- [exercise] Estimate Training FLOPs (≈ 6 × Parameters × Tokens)
- [exercise] Estimate GPU Memory for Training (Weights, Gradients, Optimizer States, Activations)

## NVIDIA Focus

- NVIDIA: Backpropagation and Optimizer Math in Depth
- NVIDIA: GPU Architecture and CUDA Fundamentals
- NVIDIA: Mixed Precision and Loss Scaling
- NVIDIA: Memory-Bound vs Compute-Bound Performance
- NVIDIA: Inference Optimisation (TensorRT, Quantization, Kernel Fusion)
- NVIDIA: Multi-GPU and Distributed Training

## Google Focus

- Google: ML Depth Round (Losses, Optimization, Regularization, Embeddings)
- Google: Coding an ML Component at the SWE Coding Bar
- Google: Transformer and Embedding Deep Dives
- Google: Project Deep Dive on Trade-offs and Failures

## JPMorgan Chase Focus

- JPMC: Neural Network from Scratch
- JPMC: Probability and Maximum Likelihood Math
- JPMC: NLP and LLMs for Financial Documents
- JPMC: Class Imbalance and Fraud Detection
- JPMC: Explainability and Model Risk
- JPMC: Business-Framed AI Case (KPIs and Rollout Plan)
