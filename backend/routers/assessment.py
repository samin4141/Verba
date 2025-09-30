from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Assessment, User
from pydantic import BaseModel
import os
import aiohttp
import json

router = APIRouter()

# Ollama configuration
OLLAMA_URL = os.getenv('OLLAMA_URL', 'http://localhost:11434')
OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', 'llama3.2')

class AssessmentResponse(BaseModel):
    question: str
    answer: str
    score: float

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

class InitialAssessment(BaseModel):
    reading_responses: List[AssessmentResponse]
    listening_responses: List[AssessmentResponse]
    speaking_audio_url: str
    writing_sample: str

@router.post("/initial")
async def create_initial_assessment(
    assessment: InitialAssessment,
    db: Session = Depends(get_db)
):
    
    # Evaluate reading responses
    reading_score = await evaluate_reading(assessment.reading_responses)
    
    # Evaluate listening responses
    listening_score = await evaluate_listening(assessment.listening_responses)
    
    # Evaluate speaking (using Whisper API)
    speaking_score = await evaluate_speaking(assessment.speaking_audio_url)
    
    # Evaluate writing
    writing_score = await evaluate_writing(assessment.writing_sample)
    
    # Calculate overall scores (0-30 scale)
    scores = {
        "reading": min(30, reading_score * 30),
        "listening": min(30, listening_score * 30),
        "speaking": min(30, speaking_score * 30),
        "writing": min(30, writing_score * 30)
    }
    
    return scores

async def evaluate_reading(responses: List[AssessmentResponse]) -> float:
    total_score = 0
    for response in responses:
        # Use Ollama to evaluate the response
        messages = [
            {"role": "system", "content": "You are an English language assessment expert. Evaluate the following answer based on comprehension, accuracy, and completeness. Return ONLY a score between 0 and 1 as a decimal number, nothing else."},
            {"role": "user", "content": f"Question: {response.question}\nAnswer: {response.answer}"}
        ]
        evaluation = await call_ollama(messages)
        try:
            score = float(evaluation.strip())
        except:
            # If parsing fails, try to extract first number
            import re
            match = re.search(r'0\.\d+|1\.0|0|1', evaluation)
            score = float(match.group()) if match else 0.5
        total_score += score
    
    return total_score / len(responses) if responses else 0

async def evaluate_listening(responses: List[AssessmentResponse]) -> float:
    # Similar to reading evaluation
    return await evaluate_reading(responses)

async def evaluate_speaking(audio_url: str) -> float:
    # Note: For local speech-to-text, you can use Whisper locally via whisper.cpp or faster-whisper
    # For now, this returns a placeholder. You'll need Azure Speech Service or local Whisper
    try:
        # Transcribe audio using your speech service (Azure or local Whisper)
        # audio_file = await download_audio(audio_url)
        # For now, return a default score or skip this evaluation
        # You can integrate local Whisper here if needed
        
        # Placeholder evaluation
        return 0.7  # Default score - implement proper speech evaluation
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

async def evaluate_writing(sample: str) -> float:
    # Use Ollama to evaluate writing
    messages = [
        {"role": "system", "content": "You are an English writing assessment expert. Evaluate the following writing sample based on grammar, vocabulary, coherence, and structure. Return ONLY a score between 0 and 1 as a decimal number, nothing else."},
        {"role": "user", "content": sample}
    ]
    evaluation = await call_ollama(messages)
    try:
        score = float(evaluation.strip())
    except:
        # If parsing fails, try to extract first number
        import re
        match = re.search(r'0\.\d+|1\.0|0|1', evaluation)
        score = float(match.group()) if match else 0.5
    return score

async def download_audio(url: str):
    # Implement audio download logic
    # This is a placeholder - you'll need to implement actual download logic
    pass 