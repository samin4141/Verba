from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import os
from ..database import get_db
from ..models import User, ProgressRecord
import aiohttp
import json
import re

router = APIRouter()

# Ollama configuration
OLLAMA_URL = os.getenv('OLLAMA_URL', 'http://localhost:11434')
OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', 'llama3.2')

async def call_ollama(messages: List[dict]) -> str:
    """Helper function to call Ollama API"""
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"{OLLAMA_URL}/api/chat",
            json={
                "model": OLLAMA_MODEL,
                "messages": messages,
                "stream": False,
                "options": {"temperature": 0.7}
            },
            timeout=aiohttp.ClientTimeout(total=120)
        ) as response:
            if response.status == 200:
                result = await response.json()
                return result['message']['content']
            else:
                error_data = await response.text()
                raise ValueError(f"Ollama API request failed: {error_data}")

class ReadingPassage(BaseModel):
    title: str
    content: str
    questions: List[dict]
    level: int

class ReadingResponse(BaseModel):
    passage_id: str
    answers: List[dict]

@router.get("/generate-passage")
async def generate_reading_passage(
    level: int,
    topic: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Generate a reading passage based on user's level
    system_prompt = f"""Generate an English reading passage suitable for level {level}/30 (30 being highest).
    The passage should be challenging but comprehensible for this level.
    Include a title and 5 questions (mix of multiple choice and open-ended) that test:
    1. Main idea comprehension
    2. Vocabulary understanding
    3. Inference skills
    4. Detail recognition
    5. Critical thinking
    
    Format the response as a JSON object with:
    - title
    - content
    - questions (array of question objects with type, text, and answers)
    
    Return ONLY valid JSON, no additional text."""
    
    topic_context = f" The topic should be about {topic}." if topic else ""
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Generate a passage{topic_context}"}
    ]
    
    response = await call_ollama(messages)
    
    # Parse and return the generated passage
    try:
        passage_data = json.loads(response)
    except:
        # If JSON parsing fails, return a default structure
        passage_data = {
            "title": "Reading Passage",
            "content": response,
            "questions": [],
            "level": level
        }
    return ReadingPassage(**passage_data)

@router.post("/evaluate")
async def evaluate_reading_response(
    response: ReadingResponse,
    db: Session = Depends(get_db)
):
    # Evaluate each answer
    total_score = 0
    feedback = []
    
    for answer in response.answers:
        messages = [
            {"role": "system", "content": "You are an English reading assessment expert. Evaluate the answer and provide a score (0-1) and constructive feedback. Return as JSON with keys: score (float) and feedback (string). Return ONLY valid JSON, no additional text."},
            {"role": "user", "content": f"Question: {answer['question']}\nStudent's Answer: {answer['answer']}"}
        ]
        
        evaluation = await call_ollama(messages)
        
        try:
            result = json.loads(evaluation)
        except:
            # If JSON parsing fails, try to extract score and use raw feedback
            score_match = re.search(r'"score":\s*(0\.\d+|1\.0|0|1)', evaluation)
            result = {
                "score": float(score_match.group(1)) if score_match else 0.5,
                "feedback": evaluation
            }
        
        total_score += result["score"]
        feedback.append(result["feedback"])
    
    # Calculate average score
    average_score = total_score / len(response.answers)
    
    # Store progress record
    progress_record = ProgressRecord(
        user_id=1,  # Replace with actual user ID from auth
        activity_type="reading",
        score=average_score,
        metadata={
            "passage_id": response.passage_id,
            "feedback": feedback
        }
    )
    db.add(progress_record)
    db.commit()
    
    return {
        "score": average_score,
        "feedback": feedback,
        "recommendations": generate_recommendations(average_score)
    }

def generate_recommendations(score: float) -> List[str]:
    if score < 0.3:
        return [
            "Focus on basic vocabulary building",
            "Practice reading simpler texts",
            "Review basic grammar structures"
        ]
    elif score < 0.6:
        return [
            "Work on understanding context clues",
            "Practice summarizing paragraphs",
            "Focus on identifying main ideas"
        ]
    else:
        return [
            "Challenge yourself with academic texts",
            "Practice advanced inference skills",
            "Focus on critical analysis"
        ] 