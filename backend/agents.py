import os
import json
import logging
from pathlib import Path
from typing import Dict, List, Optional
from dotenv import load_dotenv
import google.generativeai as genai
from llama_cpp import Llama

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EduAgents:
    """Main agent orchestrator using Gemini API and local distilled model"""
    
    def __init__(self):
        """Initialize Gemini client and local model configuration"""
        env_path = Path(__file__).parent.parent / ".env"
        load_dotenv(dotenv_path=env_path)
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY not found in .env file. "
                "Please add your Gemini API key."
            )
        
        genai.configure(api_key=api_key)
        
        # Initialize Gemini 2.5 models
        self.teacher_model = genai.GenerativeModel('gemini-2.5-flash')  # Document analysis
        self.conversation_model = genai.GenerativeModel('gemini-2.5-flash')  # Question generation
        self.dashboard_model = genai.GenerativeModel('gemini-2.5-flash')  # Dashboard generation
        
        # Lazy loading for local evaluator model (GGUF format)
        self.evaluator_model = None
        self.model_path = Path(__file__).parent.parent / "models" / "qwen_evaluator_q4_k_m.gguf"
        self.model_loaded = False
        self.last_raw_response = None
        self.model_n_ctx = None

    def analyze_document(self, pdf_text: str) -> Dict:
        """
        Agent 1: Document Analyzer (Gemini 2.5)
        Extracts topics and suggests difficulty levels from PDF content
        """
        try:
            prompt = f"""You are an educational content analyzer. Analyze this course material and extract key topics.

Course Material:
{pdf_text[:5000]}  # Limit for efficiency

Return a JSON object with:
1. "topics": Array of 3-5 main topics covered (as strings)
2. "summary": Brief 1-sentence summary of the material
3. "suggested_difficulty": Recommended difficulty level (Easy, Medium, or Hard)

Return ONLY valid JSON, no markdown formatting."""

            response = self.teacher_model.generate_content(prompt)
            # Clean response if it contains markdown
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
                
            result = json.loads(text)
            return result
            
        except json.JSONDecodeError:
            return {
                "topics": ["General Concepts", "Core Principles", "Advanced Topics"],
                "summary": "Course material analysis",
                "suggested_difficulty": "Medium"
            }
        except Exception as e:
            logger.error(f"Error analyzing document: {str(e)}")
            raise Exception(f"Error analyzing document: {str(e)}")
    
    def generate_question(
        self, 
        context: str, 
        topic: str, 
        difficulty: str,
        question_number: int = 1
    ) -> str:
        """
        Agent 2: Question Generator (Gemini 2.5)
        Generates a single question based on context, topic, and difficulty
        """
        try:
            difficulty_guidelines = {
                "Easy": "Basic recall and understanding. Simple definitions or concepts.",
                "Medium": "Application and analysis. Requires connecting concepts.",
                "Hard": "Critical thinking and synthesis. Complex reasoning required."
            }
            
            prompt = f"""You are a university professor creating exam questions.

Context from course material:
{context[:3000]}

Create question #{question_number} of 3 total questions.
Topic: {topic}
Difficulty: {difficulty} - {difficulty_guidelines.get(difficulty, '')}

Requirements:
- Question should be clear and specific
- Based ONLY on the provided context
- Appropriate for {difficulty} difficulty level
- Encourage detailed, thoughtful answers
- Do NOT include the answer

Return ONLY the question text, nothing else."""

            response = self.conversation_model.generate_content(prompt)
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Error generating question: {str(e)}")
            raise Exception(f"Error generating question: {str(e)}")

    def _unload_evaluator_model(self):
        """Unload the evaluator model to free memory."""
        if self.evaluator_model is not None:
            try:
                del self.evaluator_model
                self.evaluator_model = None
                self.model_loaded = False
                self.model_n_ctx = None
                logger.info("🔄 Evaluator model unloaded")
            except Exception as e:
                logger.warning(f"⚠️ Error unloading model: {str(e)}")
    
    def _load_evaluator_model(self, force_reload=False, n_ctx=4096):
        """Lazy load the local Qwen evaluator model in GGUF format."""
        needs_reload = (
            self.evaluator_model is None or 
            force_reload or 
            (self.model_n_ctx is not None and self.model_n_ctx < n_ctx)
        )
        
        if needs_reload:
            if self.evaluator_model is not None:
                self._unload_evaluator_model()
            if not self.model_path.exists():
                raise FileNotFoundError(
                    f"Evaluator model not found at {self.model_path}. "
                    "Please ensure the model file qwen_evaluator_q4_k_m.gguf is in the models/ directory."
                )
            
            try:
                logger.info(f"🔄 Loading local evaluator model from: {self.model_path}")
                self.evaluator_model = Llama(
                    model_path=str(self.model_path),
                    n_gpu_layers=-1,
                    n_ctx=n_ctx,
                    n_threads=4,
                    verbose=False
                )
                self.model_n_ctx = n_ctx
                self.model_loaded = True
                logger.info(f"✅ Evaluator model loaded with n_ctx={n_ctx}")
            except Exception as e:
                logger.error(f"❌ Error loading evaluator model: {str(e)}")
                raise Exception(f"Error loading evaluator model: {str(e)}")

    def evaluate_answer(
        self, 
        context: str, 
        question: str, 
        student_answer: str,
        _retry_count=0
    ) -> Dict:
        """
        Agent 3: Answer Evaluator (Distilled Student Model - Local)
        Evaluate student answer using the local Qwen model.
        """
        try:
            was_loading = not self.model_loaded
            self._load_evaluator_model()
            
            if was_loading:
                logger.info("🚀 Using LOCAL Qwen evaluator model")

            # Improved system prompt to encourage score differentiation
            # Improved system prompt to encourage score differentiation
            system_prompt = """You are "Edu-Distill Student", a strict academic evaluator.
Your task is to grade the student's answer based EXCLUSIVELY on the provided Context and Question.

🚨 ZERO TOLERANCE POLICY (CRITICAL):
- If the answer is gibberish (e.g., "uanamodmiop", "asdf"), random characters, or completely irrelevant to the topic: **SCORE MUST BE 0**.
- Do not interpret nonsense. If it makes no sense, the score is 0.
- If the student admits they don't know: **SCORE IS 0**.

SCORING RUBRIC (0-30):
- **0-5 (Fail):** Nonsense, random text, irrelevant, or factually dangerous/completely wrong answers.
- **6-17 (Insufficient):** Vague, too short, uses keywords without understanding, or contains logical contradictions.
- **18-23 (Pass):** Correct but basic. Hits the main points but lacks depth or nuance.
- **24-30 (Excellent):** Detailed, precise, demonstrates mastery of the context.

KEY COVERAGE LOGIC (CRITICAL):
- Do NOT output static numbers like 83% repeatedly. Estimate purely based on facts found vs. missing.
- **100%:** The answer contains ALL key facts from the context required by the question.
- **50-80%:** The answer is correct but misses minor details or context.
- **10-40%:** The answer misses major core concepts.
- **0%:** The answer is wrong or irrelevant.
- **CONSTRAINT:** If 'missing_concepts' list is NOT empty, 'key_coverage' MUST be less than 90.

TRICK QUESTIONS & HALLUCINATIONS:
- Watch out for "confident bullshit". If the answer sounds professional but is logically wrong (hallucination), penalize heavily.
- Verify terms against the Context. If the student invents terms, list them in "hallucinations".

Return ONLY a valid JSON with these fields:
- "score_30": (int 0-30) The grade.
- "key_coverage": (int 0-100) Percentage of key concepts covered.
- "missing_concepts": (list[str]) Key concepts missing from the answer (in English).
- "hallucinations": (list[str]) False/invented statements found in the answer.
- "bias_check": (bool) True if language is inappropriate/biased.
- "feedback": (str) Brief technical feedback for the professor."""


            # Truncation logic for speed
            max_question_chars = 800
            max_answer_chars = 2500
            max_context_chars = 10000
            
            if len(question) > max_question_chars:
                question = question[:max_question_chars] + "..."
            if len(student_answer) > max_answer_chars:
                student_answer = student_answer[:max_answer_chars] + "..."
            if len(context) > max_context_chars:
                context = "..." + context[-max_context_chars:]

            user_message = f"""Context: {context}

Question: {question}

Student Answer: {student_answer}"""

            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
            
            logger.info("🔄 Generating evaluation...")

            # Increased temperature to 0.4 to allow more variance in scoring
            response = self.evaluator_model.create_chat_completion(
                messages=messages,
                temperature=0.4,
                max_tokens=512,
                top_p=0.95,
                repeat_penalty=1.1,
                response_format={"type": "json_object"}
            )

            response_text = response['choices'][0]['message']['content']
            self.last_raw_response = response_text
            
            # JSON extraction
            response_text = response_text.strip()
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            
            if json_start != -1 and json_end > json_start:
                json_str = response_text[json_start:json_end]
            else:
                json_str = response_text

            result = json.loads(json_str)
            logger.info(f"✅ Evaluation complete. Score: {result.get('score_30', 'N/A')}/30")
            
            return result
            
        except json.JSONDecodeError:
            logger.error("Error parsing JSON from evaluator")
            return {
                "score_30": 15,
                "key_coverage": 50,
                "missing_concepts": ["Could not parse evaluation"],
                "hallucinations": [],
                "bias_check": False,
                "feedback": "Error parsing model response."
            }
        except Exception as e:
            # Handle context window errors with retry
            error_msg = str(e)
            if "context window" in error_msg.lower() and _retry_count == 0:
                logger.warning("Context window exceeded, retrying with larger context...")
                self._unload_evaluator_model()
                self._load_evaluator_model(force_reload=True, n_ctx=8192)
                return self.evaluate_answer(context, question, student_answer, _retry_count=1)
            
            logger.error(f"Error evaluating answer: {str(e)}")
            raise Exception(f"Error evaluating answer: {str(e)}")
    
    def generate_dashboard_feedback(self, evaluations: List[Dict]) -> Dict:
        """
        Agent 4: Dashboard Generator (Gemini 2.5)
        Creates comprehensive dashboard data from all evaluations
        """
        try:
            # Calculate overall accuracy
            # Note: evaluations come from evaluate_answer which returns score_30
            # We need to handle potential different formats if mixed
            scores = []
            for e in evaluations:
                if "score_30" in e:
                    scores.append(e["score_30"])
                elif "score" in e:
                    # Assuming score is 0-30 if not specified, or convert?
                    # Let's assume input evaluations might be normalized by server or raw
                    # Server passes what evaluate_answer returns.
                    scores.append(e.get("score", 0))
            
            # Normalize to 0-100 for the dashboard summary if needed, or keep 0-30?
            # The prompt expects to analyze evaluations.
            
            eval_summary = json.dumps(evaluations, indent=2)
            
            prompt = f"""You are an educational analytics agent. Analyze these exam question evaluations:

{eval_summary}

Generate a comprehensive dashboard summary. Return ONLY valid JSON with:
{{
    "strengths_summary": "2-3 sentence summary of student's strengths",
    "areas_for_improvement": "2-3 sentence summary of areas to improve",
    "performance_trend": "Improving/Consistent/Declining",
    "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}}

Be encouraging but honest. Return ONLY the JSON object."""

            response = self.dashboard_model.generate_content(prompt)
            
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            
            result = json.loads(text.strip())
            return result
            
        except Exception as e:
            logger.error(f"Error generating dashboard: {str(e)}")
            return {
                "strengths_summary": "Completed questions.",
                "areas_for_improvement": "Continue practicing.",
                "performance_trend": "Consistent",
                "recommendations": ["Review course materials"]
            }
        
