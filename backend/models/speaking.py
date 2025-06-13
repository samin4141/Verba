from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Message(BaseModel):
    role: str
    content: str
    timestamp: datetime = datetime.now()

class SpeakingSession(BaseModel):
    id: Optional[str] = None
    user_id: int
    topic: Optional[str] = None
    difficulty_level: Optional[str] = None
    conversation_history: List[Message] = []
    created_at: datetime = datetime.now()
    ended_at: Optional[datetime] = None

class SpeakingResponse(BaseModel):
    text: str
    feedback: Optional[dict] = None
    score: Optional[float] = None 