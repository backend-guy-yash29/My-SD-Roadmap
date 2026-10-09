# Deep Learning in Practice: PyTorch & GPUs

> Moving from NumPy to a real framework, debugging training, and understanding the GPU underneath.

## PyTorch Fundamentals

- Tensors and Tensor Operations
- Autograd (Automatic Differentiation)
- Building Models with nn.Module
- Datasets and DataLoaders
- Training and Evaluation Loops
- Saving and Loading Checkpoints

## Debugging Training

- Overfit a Single Batch First
- Reading Loss and Accuracy Curves
- Diagnosing NaN and Exploding Losses
- Reproducibility and Random Seeds

## GPU Fundamentals

- GPU vs CPU Architecture (SMs, Cores, Tensor Cores)
- CUDA Programming Model (Kernels, Threads, Blocks, Warps)
- GPU Memory Hierarchy (HBM, Shared Memory, Registers)
- Compute-Bound vs Memory-Bound (Arithmetic Intensity, Roofline)
- Kernel Fusion

## Faster Training

- Mixed Precision Training (FP32, FP16, BF16)
- Loss Scaling
- Gradient Accumulation
- Activation Checkpointing
- torch.compile
- Profiling Training Performance
- Multi-GPU Training in PyTorch (DDP, FSDP)

## Projects

- [exercise] Rebuild the From-Scratch MLP in PyTorch
- [exercise] Write a Simple CUDA Kernel (Vector Add, Matrix Multiply)
