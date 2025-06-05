from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import openai
import azure.cognitiveservices.speech as speechsdk
import os
import json
from ..database import get_db
from ..models import User, ProgressRecord

router = APIRouter()

class SpeakingPrompt(BaseModel):
    topic: str
    difficulty_level: int
    format: str  # "conversation" or "test"

class SpeakingFeedback(BaseModel):
    pronunciation_score: float
    fluency_score: float
    grammar_score: float
    vocabulary_score: float
    overall_score: float
    feedback: List[str]
    corrections: List[dict]

@router.post("/generate-prompt")
async def generate_speaking_prompt(prompt_request: SpeakingPrompt):
    openai.api_key = os.getenv("OPENAI_API_KEY")
    
    system_prompt = f"""Generate a speaking prompt for an English learner at level {prompt_request.difficulty_level}/30.
    Format: {prompt_request.format}
    Topic: {prompt_request.topic}
    
    Include:
    1. Main discussion points
    2. Useful vocabulary
    3. Expected response structure
    4. Follow-up questions"""
    
    response = await openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": "Generate a speaking prompt"}
        ]
    )
    
    return json.loads(response.choices[0].message.content)

@router.post("/analyze-speech")
async def analyze_speech(
    audio: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Save audio file temporarily
    audio_path = f"temp_{audio.filename}"
    with open(audio_path, "wb") as f:
        f.write(await audio.read())
    
    try:
        # Transcribe using Whisper API
        with open(audio_path, "rb") as audio_file:
            transcript = await openai.Audio.transcribe("whisper-1", audio_file)
        
        # Analyze pronunciation and fluency using Azure Speech Services
        speech_config = speechsdk.SpeechConfig(
            subscription=os.getenv("AZURE_SPEECH_KEY"),
            region=os.getenv("AZURE_SPEECH_REGION")
        )
        
        audio_config = speechsdk.AudioConfig(filename=audio_path)
        speech_recognizer = speechsdk.SpeechRecognizer(
            speech_config=speech_config,
            audio_config=audio_config
        )
        
        # Get detailed assessment using GPT
        assessment = await openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": """Analyze the following English speech transcript and provide detailed feedback on:
                1. Pronunciation
                2. Grammar
                3. Vocabulary usage
                4. Fluency
                5. Overall coherence
                
                Provide scores (0-1) for each aspect and specific corrections/improvements."""},
                {"role": "user", "content": transcript["text"]}
            ]
        )
        
        feedback_data = json.loads(assessment.choices[0].message.content)
        
        # Store progress record
        progress_record = ProgressRecord(
            user_id=1,  # Replace with actual user ID from auth
            activity_type="speaking",
            score=feedback_data["overall_score"],
            metadata={
                "transcript": transcript["text"],
                "feedback": feedback_data
            }
        )
        db.add(progress_record)
        db.commit()
        
        return SpeakingFeedback(**feedback_data)
    
    finally:
        # Clean up temporary file
        if os.path.exists(audio_path):
            os.remove(audio_path)

@router.post("/chat")
async def chat_with_ai(
    message: str,
    context: Optional[List[dict]] = None
):
    """Real-time chat with AI conversation partner"""
    openai.api_key = os.getenv("OPENAI_API_KEY")
    
    conversation = context or []
    conversation.append({"role": "user", "content": message})
    
    response = await openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": """You are a helpful English conversation partner.
            Engage in natural conversation while:
            1. Gently correcting grammar mistakes
            2. Suggesting better vocabulary when appropriate
            3. Maintaining conversation flow
            4. Asking follow-up questions
            5. Providing cultural context when relevant"""},
            *conversation
        ]
    )
    
    return {
        "response": response.choices[0].message.content,
        "corrections": extract_corrections(message, response.choices[0].message.content)
    }

def extract_corrections(original: str, response: str) -> List[dict]:
    """Extract grammar and vocabulary corrections from the AI response"""
    # This is a simplified version - you might want to use more sophisticated NLP
    corrections = []
    if "*" in response:
        correction_parts = response.split("*")
        for i in range(1, len(correction_parts), 2):
            corrections.append({
                "original": correction_parts[i-1].strip(),
                "correction": correction_parts[i].strip(),
                "type": "grammar/vocabulary"
            })
    return corrections 