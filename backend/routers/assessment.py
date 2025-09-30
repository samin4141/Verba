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

# Ollama setup
OLLAMA_URL = os.getenv('OLLAMA_URL', 'http://localhost:11434')
OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', 'llama3.2')

class AssessmentResponse(BaseModel):
    question: str
    answer: str
    score: float

async def call_ollama(messages: List[dict]) -> str:
    # wrapper for ollama calls
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
        ) as resp:
            if resp.status == 200:
                data = await resp.json()
                return data['message']['content']
            else:
                err = await resp.text()
                raise ValueError(f"ollama failed: {err}")

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
    
    # evaluate each section
    reading = await evaluate_reading(assessment.reading_responses)
    listening = await evaluate_listening(assessment.listening_responses)
    
    # TODO: fix speaking evaluation
    speaking = await evaluate_speaking(assessment.speaking_audio_url)
    
    writing = await evaluate_writing(assessment.writing_sample)
    
    # convert to 0-30 scale (multiply by 30 and cap at 30)
    return {
        "reading": min(30, reading * 30),
        "listening": min(30, listening * 30),
        "speaking": min(30, speaking * 30),
        "writing": min(30, writing * 30)
    }

async def evaluate_reading(responses: List[AssessmentResponse]) -> float:
    total = 0
    for resp in responses:
        # get ollama to grade it
        msgs = [
            {"role": "system", "content": "You are an English language assessment expert. Evaluate the following answer based on comprehension, accuracy, and completeness. Return ONLY a score between 0 and 1 as a decimal number, nothing else."},
            {"role": "user", "content": f"Question: {resp.question}\nAnswer: {resp.answer}"}
        ]
        result = await call_ollama(msgs)
        try:
            score = float(result.strip())
        except:
            # model sometimes adds extra text lol
            import re
            match = re.search(r'0\.\d+|1\.0|0|1', result)
            score = float(match.group()) if match else 0.5
        total += score
    
    return total / len(responses) if responses else 0

async def evaluate_listening(responses: List[AssessmentResponse]) -> float:
    # same as reading basically
    return await evaluate_reading(responses)

async def evaluate_speaking(audio_url: str) -> float:
    # TODO: implement proper speech evaluation
    # need to add whisper or use azure speech
    try:
        # for now just return a placeholder
        return 0.7
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

async def evaluate_writing(text: str) -> float:
    # get ollama to grade writing
    msgs = [
        {"role": "system", "content": "You are an English writing assessment expert. Evaluate the following writing sample based on grammar, vocabulary, coherence, and structure. Return ONLY a score between 0 and 1 as a decimal number, nothing else."},
        {"role": "user", "content": text}
    ]
    result = await call_ollama(msgs)
    try:
        score = float(result.strip())
    except:
        import re
        match = re.search(r'0\.\d+|1\.0|0|1', result)
        score = float(match.group()) if match else 0.5
    return score

async def download_audio(url: str):
    # TODO: implement this
    pass 