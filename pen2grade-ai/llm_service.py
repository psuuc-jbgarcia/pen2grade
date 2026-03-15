import os
import json
from pydantic import BaseModel
from typing import List, Dict
import google.generativeai as genai

# Get Gemini API Key from environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    
    model = genai.GenerativeModel('gemini-2.5-flash')
else:
    model = None

class CriteriaItem(BaseModel):
    name: str
    weight: float
    description: str = ""

class EvaluationRequest(BaseModel):
    text: str
    rubric_title: str
    criteria: List[CriteriaItem]

def mock_evaluation(request: EvaluationRequest) -> Dict:
    """Fallback if no API key is provided."""
    score_breakdown = {}
    total_score = 0
    word_count = len(request.text.split())
    base_percentage = min(100, (word_count / 100) * 100) if word_count > 0 else 0
    
    for c in request.criteria:
        c_score = (base_percentage / 100) * c.weight
        score_breakdown[c.name] = {
            "score": round(c_score, 2),
            "max": c.weight,
            "feedback": f"Mock feedback for {c.name}. Word count: {word_count}"
        }
        total_score += c_score
        
    return {
        "status": "success",
        "mock_mode": True,
        "total_score": round(total_score, 2),
        "breakdown": score_breakdown,
        "general_feedback": "This is a mock evaluation because no valid Gemini API key was provided.",
        "grammar_suggestions": ["Use more varied sentence structures.", "Check punctuation."]
    }

def gemini_evaluation(request: EvaluationRequest) -> Dict:
    """Uses Gemini API to grade the essay according to the rubric."""
    if not model:
        print("Model not initialized. Falling back to mock.")
        return mock_evaluation(request)
        
    rubric_str = f"Rubric Title: {request.rubric_title}\nCriteria:\n"
    for c in request.criteria:
        rubric_str += f"- {c.name} (Weight: {c.weight}%): {c.description}\n"
        
    prompt = f"""
    You are an expert teacher evaluating an essay based strictly on the provided rubric.
    
    {rubric_str}
    
    Essay to evaluate:
    \"\"\"{request.text}\"\"\"
    
    Provide your evaluation in strict JSON format matching the following structure exactly:
    {{
        "total_score": float,
        "breakdown": {{
             "Criteria Name 1": {{ "score": float, "max": float, "feedback": "string" }},
             "Criteria Name 2": {{ "score": float, "max": float, "feedback": "string" }}
        }},
        "general_feedback": "Overall summary of the essay's strengths and weaknesses.",
        "grammar_suggestions": ["Suggestion 1", "Suggestion 2"]
    }}
    
    Return ONLY the JSON object.
    """
    
    try:
        print(f"Sending request to Gemini for rubric: {request.rubric_title}")
        response = model.generate_content(prompt)
        # Clean the response in case it contains markdown formatting
        text_response = response.text
        print(f"Raw Gemini response: {text_response[:200]}...")
        
        if text_response.strip().startswith("```json"):
            text_response = text_response.strip()[7:-3].strip()
        elif text_response.strip().startswith("```"):
            text_response = text_response.strip()[3:-3].strip()
            
        result = json.loads(text_response)
        result["status"] = "success"
        result["mock_mode"] = False
        print("Gemini evaluation successful.")
        return result
        
    except Exception as e:
        print(f"Gemini API Error: {str(e)}")
        import traceback
        traceback.print_exc()
        result = mock_evaluation(request)
        result["error_detail"] = str(e)
        return result

def evaluate_essay_logic(request: EvaluationRequest) -> Dict:
    print(f"Evaluating essay logic. Model exists: {model is not None}")
    if model:
         return gemini_evaluation(request)
    else:
         return mock_evaluation(request)
