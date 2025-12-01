# Model Creation Documentation

This folder contains documentation about how the local evaluator model (`qwen_evaluator_q4_k_m.gguf`) was created.

## 📋 Overview

The evaluator model is a **Knowledge Distilled** version of a larger teacher model, fine-tuned specifically for automated exam grading. It has been quantized to 4-bit (q4_k_m) for efficient local inference.

## 📁 Contents

- **Colab Notebook** (to be added): Contains the complete training and quantization pipeline
  - ⚠️ **DO NOT RUN** this notebook - it's for documentation purposes only
  - Shows the process used to create the model from the training dataset
  - Includes fine-tuning, knowledge distillation, and quantization steps

## 🔧 Model Specifications

- **Base Model**: Qwen2 (Alibaba Cloud)
- **Task**: Automated exam answer evaluation
- **Output Format**: JSON with evaluation metrics
- **Quantization**: 4-bit (q4_k_m) using llama.cpp
- **Size**: ~1.5GB (quantized from ~5GB)
- **Context Window**: 4096 tokens (expandable to 8192)

## 📊 Training Dataset

The model was trained on `training/dataset.json` which contains:
- Context material
- Exam questions
- Student answers (various quality levels)
- Target evaluation JSON outputs

## 🚀 Model Creation Process (Summary)

1. **Fine-tuning**: Qwen2 base model fine-tuned on evaluation dataset
2. **Knowledge Distillation**: Distilled to smaller, efficient model
3. **Quantization**: Converted to GGUF format with 4-bit quantization
4. **Optimization**: Optimized for speed and memory efficiency

## 📝 Notes

- The Colab notebook in this folder is **read-only documentation**
- Do not attempt to run it unless you want to recreate the model
- The model file (`models/qwen_evaluator_q4_k_m.gguf`) is already provided and ready to use
- If you need to recreate the model, refer to the Colab notebook for the exact process

## 🔗 Related Files

- `models/qwen_evaluator_q4_k_m.gguf`: The final quantized model (ready to use)
- `training/dataset.json`: Training dataset used for model creation
- `backend/test_gguf.py`: Test script to verify model functionality

