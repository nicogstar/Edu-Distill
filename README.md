# 🎓 Edu-Distill: Privacy-Preserving Exam Assistant

A modular, secure application for automated exam grading and student feedback using AI agents. Uses a **local quantized Qwen model** for answer evaluation, ensuring privacy and reducing API costs.

## ✨ Key Features

- **Local Model Evaluation**: Uses GGUF quantized Qwen model (4-bit, ~1.5GB VRAM) for answer evaluation
- **OpenAI Integration**: Gemini 2.5 Flash for question generation and Web Speech API for audio transcription
- **Privacy-Preserving**: Student answer evaluation runs entirely on your local machine
- **Fast & Efficient**: Optimized for speed with smart context truncation and parameter tuning
- **Modern UI**: Built with React, Vite, and Tailwind CSS for a premium user experience

## 📋 Project Structure

```
Edu-Distill/
├── backend/                        # FastAPI Backend
│   ├── server.py                  # Main API server
│   ├── agents.py                  # AI agents (Teacher & Student evaluator)
│   ├── tools.py                   # PDF and audio utilities
│   └── test_gguf.py               # Test script for GGUF model
├── frontend/                       # React Frontend
│   ├── src/
│   ├── components/
│   ├── App.tsx
│   └── vite.config.ts
├── models/
│   └── qwen_evaluator_q4_k_m.gguf # Local quantized evaluator model (4-bit)
├── training/
│   └── dataset.json               # Training dataset used for model creation
├── requirements.txt                # Python backend dependencies
└── .env                            # Environment variables
```

## 🚀 Quick Start

### 1. Prerequisites

- **Python 3.8+**
- **Node.js 18+**
- **NVIDIA GPU (recommended)**: RTX 3050 or better with CUDA support
- **RAM**: 8GB+ recommended
- **VRAM**: 6GB+ for GPU acceleration (model uses ~1.5GB in 4-bit)

### 2. Backend Setup

**Windows:**
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Install llama-cpp-python with CUDA support (if you have NVIDIA GPU)
pip install llama-cpp-python --extra-index-url https://abetlen.github.io/llama-cpp-python/whl/cu121
```

**Linux/Mac:**
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
GEMINI_API_KEY=your-gemini-api-key
```

**Note**: The API key is used for:
- Question generation (Gemini 2.5)
- Document analysis (Gemini 2.5)

Answer evaluation uses the **local GGUF model** and does NOT require API calls.

### 5. Verify Model File

Ensure the model file exists:
```
models/qwen_evaluator_q4_k_m.gguf
```

If missing, you'll need to download or create it (see `model_creation/README.md` for details).

### 6. Run the Application

You need to run both the backend and frontend servers.

**Terminal 1 (Backend):**
```bash
# Make sure .venv is activated
python backend/server.py
```
Backend runs on `http://localhost:8002`

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000`

## 🏗️ Architecture

### **Backend: FastAPI**

- **`server.py`**: FastAPI application handling HTTP requests.
- **`agents.py`**: Orchestrates AI agents.
  - **Teacher Agent**: Uses Gemini 2.5 to analyze documents and generate questions.
  - **Student Agent**: Uses local Qwen 2.5 (GGUF) to evaluate answers.
  - **Dashboard Agent**: Uses Gemini 2.5 to generate summary feedback.

### **Frontend: React + Vite**

- **`App.tsx`**: Main application logic and slide navigation.
- **`ConversationalDashboard.tsx`**: Interactive component for the exam flow (Upload -> Quiz -> Results).
- **Styling**: Tailwind CSS with custom animations and glassmorphism effects.

## 📊 Evaluation Output

The evaluation returns a JSON object:

```json
{
  "score_30": 25,
  "key_coverage": 85,
  "missing_concepts": ["Attention Mechanism", "Tokenization"],
  "hallucinations": ["Transformers were invented in 1990"],
  "bias_check": false,
  "feedback": "Strong understanding of core concepts. Consider elaborating on attention mechanisms."
}
```

## 🔒 Security & Privacy Features

- **Local Evaluation**: Student answers are evaluated on your machine, not sent to external APIs.
- **API Key Security**: Stored in `.env` (never committed to git).
- **Temporary File Cleanup**: Audio files deleted after processing.

## 📦 Sharing the Project

When sharing this project:

1. **Include**:
   - All source code
   - `requirements.txt`
   - `frontend/package.json`
   - `models/qwen_evaluator_q4_k_m.gguf` (if file size allows)

2. **Exclude** (already in `.gitignore`):
   - `.venv/` and `frontend/node_modules/`
   - `.env` file
   - `__pycache__/`
   - `models/*.gguf` (if too large for git)

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- **Qwen2.5** model by Alibaba Cloud
- **Google Gemini** for generation APIs
- **Web Speech API** for audio transcription
- **llama.cpp** for efficient local inference
- **React & Vite** for the frontend
