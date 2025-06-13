from fastapi import APIRouter, Depends, HTTPException, WebSocket, UploadFile, File, Request
from typing import List, Optional
from datetime import datetime
from pydub import AudioSegment

from services.speech_service import SpeechService
from services.llm_service import LLMService
from models.speaking import SpeakingSession, SpeakingResponse, Message
from database import get_db
from sqlalchemy.orm import Session
from auth import get_current_user

router = APIRouter(
    tags=["speaking"]
)

# Initialize services
speech_service = SpeechService()
llm_service = LLMService()

@router.websocket("/ws/{session_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    session_id: str,
    current_user: dict = Depends(get_current_user)
):
    """WebSocket endpoint for real-time speech recognition"""
    await websocket.accept()
    
    try:
        # Function to handle recognized speech
        async def on_recognized(text: str):
            await websocket.send_json({"type": "recognition", "text": text})
        
        while True:
            data = await websocket.receive_json()
            
            if data["action"] == "start_recording":
                success = await speech_service.start_continuous_recognition(on_recognized)
                await websocket.send_json({
                    "type": "status",
                    "success": success,
                    "message": "Recording started" if success else "Failed to start recording"
                })
                
            elif data["action"] == "stop_recording":
                success = await speech_service.stop_continuous_recognition()
                await websocket.send_json({
                    "type": "status",
                    "success": success,
                    "message": "Recording stopped" if success else "Failed to stop recording"
                })
                
            elif data["action"] == "process_speech":
                # Process the accumulated speech and get AI response
                text = data.get("text", "")
                if not text:
                    continue
                
                # Get AI response
                ai_response = await llm_service.get_response(
                    text,
                    data.get("conversation_history", []),
                    llm_service.get_speaking_prompt()
                )
                
                # Synthesize and send response
                speech_success = await speech_service.synthesize_speech(ai_response)
                
                await websocket.send_json({
                    "type": "ai_response",
                    "text": ai_response,
                    "success": speech_success
                })
    
    except Exception as e:
        await websocket.close()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/start", response_model=SpeakingSession)
async def start_speaking_session(
    topic: Optional[str] = None,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Start a new speaking practice session"""
    try:
        session = SpeakingSession(
            user_id=current_user["id"],
            topic=topic,
            difficulty_level=difficulty
        )
        
        # Add welcome message from AI
        welcome_msg = await llm_service.get_response(
            "Let's start our English conversation practice.",
            [],
            llm_service.get_speaking_prompt()
        )
        
        session.conversation_history.append(
            Message(role="assistant", content=welcome_msg)
        )
        
        # Store session in database
        # TODO: Implement database storage
        
        # Synthesize welcome message
        await speech_service.synthesize_speech(welcome_msg)
        
        return session
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{session_id}/end")
async def end_speaking_session(
    session_id: str,
    conversation_history: List[dict],
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """End the speaking session and get final feedback"""
    try:
        # Get final feedback from AI
        feedback_prompt = "Please provide feedback on the student's English speaking skills based on our conversation. Include strengths and areas for improvement."
        feedback = await llm_service.get_response(
            feedback_prompt,
            conversation_history,
            llm_service.get_speaking_prompt()
        )
        
        # Store feedback in database
        # TODO: Implement database storage
        
        # Synthesize feedback
        await speech_service.synthesize_speech(feedback)
        
        return {
            "message": "Session ended",
            "feedback": feedback
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    contents = await audio.read()
    temp_path = "temp_audio.webm"
    wav_path = "temp_audio.wav"
    with open(temp_path, "wb") as f:
        f.write(contents)
    # Convert webm to wav
    try:
        sound = AudioSegment.from_file(temp_path)
        sound.export(wav_path, format="wav")
        text, success = await speech_service.recognize_speech_from_file(wav_path)
    except Exception as e:
        print(f"Audio conversion error: {e}")
        return {"text": "", "success": False}
    return {"text": text, "success": success}

@router.post("/grade_and_respond")
async def grade_and_respond(request: Request):
    data = await request.json()
    message = data.get('message', '')
    history = data.get('history', [])
    # 1. Get LLM response
    ai_response = await llm_service.get_response(
        message,
        history,
        llm_service.get_speaking_prompt()
    )
    # 2. Grade the user's message (mock grading for now)
    feedback = {
        'pronunciation': 98,
        'grammar': 93,
        'vocabulary': 78,
        'fluency': 88,
        'suggestions': [
            'Try to speak with more confidence',
            'Consider using more advanced vocabulary'
        ]
    }
    # 3. Return both
    return { 'response': ai_response, 'feedback': feedback } 