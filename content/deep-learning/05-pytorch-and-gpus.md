# Deep Learning in Practice: PyTorch & GPUs

> Moving from NumPy to a real framework, debugging training, and understanding the GPU underneath.

## PyTorch Fundamentals

- Tensors and Tensor Operations
  - [CampusX PyTorch: PyTorch for Beginners](https://www.youtube.com/watch?v=QZsguRbcOBM)
  - [CampusX PyTorch: Tensors in PyTorch](https://www.youtube.com/watch?v=mDsFsnw3SK4)
- Autograd (Automatic Differentiation)
  - [CampusX PyTorch: PyTorch Autograd](https://www.youtube.com/watch?v=BECZ0UB5AR0)
- Building Models with nn.Module
  - [CampusX PyTorch: PyTorch NN Module](https://www.youtube.com/watch?v=CAgWNxlmYsc)
- Datasets and DataLoaders
  - [CampusX PyTorch: Dataset & DataLoader Class in PyTorch](https://www.youtube.com/watch?v=RH6DeE3bY6I)
- Training and Evaluation Loops
  - [CampusX PyTorch: PyTorch Training Pipeline](https://www.youtube.com/watch?v=MKxEbbKpL5Q)
- Saving and Loading Checkpoints

## Debugging Training

- Overfit a Single Batch First
- Reading Loss and Accuracy Curves
- Diagnosing NaN and Exploding Losses
- Reproducibility and Random Seeds

## GPU Fundamentals

- GPU vs CPU Architecture (SMs, Cores, Tensor Cores)
  - [CampusX PyTorch: Neural Network Training on GPU](https://www.youtube.com/watch?v=CabHrf9eOVs)
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
  - [CampusX PyTorch: Building a ANN using PyTorch](https://www.youtube.com/watch?v=6EJaHBJhwDs)
- [exercise] Write a Simple CUDA Kernel (Vector Add, Matrix Multiply)
