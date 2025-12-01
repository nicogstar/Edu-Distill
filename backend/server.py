from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.agents import EduAgents
from backend.tools import Tools

app = FastAPI(title="Edu-Distill API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Agents
agents = None
try:
    agents = EduAgents()
except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"Error initializing agents: {e}")
    # We might want to handle this more gracefully, but for now let's print
    pass

def check_agents_initialized():
    if agents is None:
        raise HTTPException(
            status_code=503, 
            detail="Backend agents not initialized. Please check server logs (likely missing GEMINI_API_KEY)."
        )

# Pydantic Models
class AnalyzeRequest(BaseModel):
    text: str

class GenerateQuestionRequest(BaseModel):
    context: str
    topic: str
    difficulty: str
    question_number: Optional[int] = 1

class EvaluateRequest(BaseModel):
    context: str
    question: str
    student_answer: str

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Edu-Distill API is running"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    try:
        # Read file content
        content = await file.read()
        
        # Save to temp file for PyPDF2 (it expects a file-like object or path)
        # But Tools.extract_text_from_pdf expects a file-like object
        # We can wrap bytes in BytesIO
        from io import BytesIO
        file_obj = BytesIO(content)
        
        text = Tools.extract_text_from_pdf(file_obj)
        return {"text": text, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-document")
async def analyze_document(request: AnalyzeRequest):
    check_agents_initialized()
    try:
        analysis = agents.analyze_document(request.text)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-question")
async def generate_question(request: GenerateQuestionRequest):
    check_agents_initialized()
    try:
        question = agents.generate_question(
            request.context, 
            request.topic, 
            request.difficulty
        )
        return {"question": question}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/evaluate")
async def evaluate_answer(request: EvaluateRequest):
    check_agents_initialized()
    try:
        raw_evaluation = agents.evaluate_answer(
            request.context,
            request.question,
            request.student_answer
        )
        
        # Transform to match frontend Evaluation interface
        # interface Evaluation {
        #     score: number;
        #     accuracy_percentage: number;
        #     feedback: string;
        #     key_points_covered: string[];
        #     missing_concepts: string[];
        #     strengths: string;
        #     improvements: string;
        #     raw_evaluation?: any;
        # }
        
        score_30 = raw_evaluation.get("score_30", 0)
        accuracy = (score_30 / 30) * 100
        
        return {
            "score": score_30,
            "accuracy_percentage": accuracy,
            "feedback": raw_evaluation.get("feedback", ""),
            "key_points_covered": [], # Not provided by current agent, defaulting to empty
            "missing_concepts": raw_evaluation.get("missing_concepts", []),
            "strengths": "Good effort", # Placeholder
            "improvements": "See feedback", # Placeholder
            "raw_evaluation": raw_evaluation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class DashboardRequest(BaseModel):
    evaluations: List[dict]

@app.post("/generate-dashboard")
async def generate_dashboard(request: DashboardRequest):
    check_agents_initialized()
    try:
        evaluations = request.evaluations
        if not evaluations:
            return {
                "overall_accuracy": 0,
                "question_scores": [],
                "strengths_summary": "No evaluations yet.",
                "areas_for_improvement": "Start a quiz to get feedback.",
                "performance_trend": "Stable",
                "recommendations": ["Start practicing!"]
            }
            
        scores = [e.get("accuracy_percentage", 0) for e in evaluations]
        overall_accuracy = sum(scores) / len(scores) if scores else 0
        
        # Generate AI feedback
        feedback = agents.generate_dashboard_feedback(evaluations)
                
        return {
            "overall_accuracy": overall_accuracy,
            "question_scores": [round(s) for s in scores],
            "strengths_summary": feedback.get("strengths_summary", "Good effort."),
            "areas_for_improvement": feedback.get("areas_for_improvement", "Keep practicing."),
            "performance_trend": feedback.get("performance_trend", "Consistent"),
            "recommendations": feedback.get("recommendations", ["Review material."])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("backend.server:app", host="0.0.0.0", port=8002, reload=True)
