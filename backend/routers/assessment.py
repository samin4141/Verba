from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import openai
from ..database import get_db
from ..models import Assessment, User
from pydantic import BaseModel
import os

router = APIRouter()

class AssessmentResponse(BaseModel):
    question: str
    answer: str
    score: float

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
    # Initialize OpenAI client
    openai.api_key = os.getenv("OPENAI_API_KEY")
    
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
        # Use GPT to evaluate the response
        evaluation = await openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an English language assessment expert. Evaluate the following answer based on comprehension, accuracy, and completeness. Return a score between 0 and 1."},
                {"role": "user", "content": f"Question: {response.question}\nAnswer: {response.answer}"}
            ]
        )
        score = float(evaluation.choices[0].message.content.strip())
        total_score += score
    
    return total_score / len(responses)

async def evaluate_listening(responses: List[AssessmentResponse]) -> float:
    # Similar to reading evaluation
    return await evaluate_reading(responses)

async def evaluate_speaking(audio_url: str) -> float:
    # Use Whisper API to transcribe and evaluate speaking
    try:
        # Transcribe audio
        audio_file = await download_audio(audio_url)
        transcript = await openai.Audio.transcribe("whisper-1", audio_file)
        
        # Evaluate pronunciation, fluency, and coherence
        evaluation = await openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an English speaking assessment expert. Evaluate the following transcription based on pronunciation, fluency, coherence, and grammar. Return a score between 0 and 1."},
                {"role": "user", "content": transcript["text"]}
            ]
        )
        return float(evaluation.choices[0].message.content.strip())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

async def evaluate_writing(sample: str) -> float:
    # Use GPT to evaluate writing
    evaluation = await openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an English writing assessment expert. Evaluate the following writing sample based on grammar, vocabulary, coherence, and structure. Return a score between 0 and 1."},
            {"role": "user", "content": sample}
        ]
    )
    return float(evaluation.choices[0].message.content.strip())

async def download_audio(url: str):
    # Implement audio download logic
    # This is a placeholder - you'll need to implement actual download logic
    pass 