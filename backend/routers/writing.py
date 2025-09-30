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

class WritingPrompt(BaseModel):
    topic: str
    type: str  # "essay", "letter", "report", etc.
    level: int
    time_limit: Optional[int] = None

class WritingFeedback(BaseModel):
    grammar_score: float
    vocabulary_score: float
    coherence_score: float
    structure_score: float
    overall_score: float
    feedback: List[str]
    corrections: List[dict]
    suggestions: List[str]

@router.post("/generate-prompt")
async def generate_writing_prompt(prompt_request: WritingPrompt):
    system_prompt = f"""Generate a writing prompt for an English learner at level {prompt_request.level}/30.
    Type: {prompt_request.type}
    Topic: {prompt_request.topic}
    
    Include:
    1. Main topic and requirements
    2. Suggested structure
    3. Key points to cover
    4. Useful vocabulary and phrases
    5. Assessment criteria"""
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": "Generate a writing prompt"}
    ]
    
    response = await call_ollama(messages)
    return response

@router.post("/real-time-feedback")
async def get_real_time_feedback(
    text: str,
    previous_feedback: Optional[List[dict]] = None
):
    """Provide real-time feedback as the user writes"""
    # Only analyze the most recent addition if previous feedback exists
    text_to_analyze = text
    if previous_feedback:
        # Find the new content by comparing with previous feedback
        last_analyzed_position = max(f["position"] for f in previous_feedback)
        text_to_analyze = text[last_analyzed_position:]
    
    messages = [
        {"role": "system", "content": """Analyze the following text in real-time and provide immediate feedback on:
        1. Grammar errors
        2. Vocabulary suggestions
        3. Style improvements
        4. Sentence structure
        
        Format the response as JSON with:
        - corrections: array of {position, original, suggestion, type}
        - suggestions: array of improvement suggestions
        
        Return ONLY valid JSON, no additional text."""},
        {"role": "user", "content": text_to_analyze}
    ]
    
    feedback = await call_ollama(messages)
    return feedback

@router.post("/evaluate")
async def evaluate_writing(
    text: str,
    prompt_type: str,
    db: Session = Depends(get_db)
):
    """Provide comprehensive evaluation of completed writing"""
    messages = [
        {"role": "system", "content": f"""Evaluate the following {prompt_type} based on:
        1. Grammar and mechanics
        2. Vocabulary usage
        3. Coherence and cohesion
        4. Structure and organization
        5. Task achievement
        
        Provide:
        - Scores (0-1) for each aspect
        - Specific corrections
        - Improvement suggestions
        - Overall feedback
        
        Format response as JSON with keys: grammar_score, vocabulary_score, coherence_score, structure_score, overall_score, corrections (list), suggestions (list), feedback (list).
        Return ONLY valid JSON, no additional text."""},
        {"role": "user", "content": text}
    ]
    
    response = await call_ollama(messages)
    
    try:
        feedback_data = json.loads(response)
    except:
        # If JSON parsing fails, provide default structure
        feedback_data = {
            "grammar_score": 0.7,
            "vocabulary_score": 0.7,
            "coherence_score": 0.7,
            "structure_score": 0.7,
            "overall_score": 0.7,
            "corrections": [],
            "suggestions": [response],
            "feedback": [response]
        }
    
    # Store progress record
    progress_record = ProgressRecord(
        user_id=1,  # Replace with actual user ID from auth
        activity_type="writing",
        score=feedback_data["overall_score"],
        metadata={
            "text": text,
            "feedback": feedback_data
        }
    )
    db.add(progress_record)
    db.commit()
    
    return WritingFeedback(**feedback_data)

@router.post("/suggest-improvements")
async def suggest_improvements(
    text: str,
    aspect: str  # "vocabulary", "grammar", "structure", "style"
):
    """Get specific suggestions for improving different aspects of writing"""
    prompts = {
        "vocabulary": "Suggest more sophisticated vocabulary alternatives for basic words in the text",
        "grammar": "Identify grammar issues and suggest corrections",
        "structure": "Analyze paragraph structure and suggest improvements for better flow",
        "style": "Suggest improvements for writing style and tone"
    }
    
    messages = [
        {"role": "system", "content": prompts[aspect]},
        {"role": "user", "content": text}
    ]
    
    response = await call_ollama(messages)
    
    return {
        "aspect": aspect,
        "suggestions": response
    } 