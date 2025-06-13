from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os
from dotenv import load_dotenv
import json
from routers import speaking

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Verba - English Learning Platform",
    description="Backend API for Verba English Learning Platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(speaking.router, prefix="/api/speaking", tags=["speaking"])

# Mock User Data (keeping this for testing)
mock_user = {
    "id": 1,
    "email": "test@example.com",
    "full_name": "Test User",
    "reading_level": 15,
    "listening_level": 12,
    "speaking_level": 18,
    "writing_level": 14,
    "points": 1250,
    "streak_days": 5
}

class ReadingPassageRequest(BaseModel):
    level: int
    topic: Optional[str] = None
    length: Optional[str] = "medium"  # short, medium, long

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to Verba English Learning Platform API"}

# User Routes
@app.get("/api/user/profile")
async def get_user_profile():
    return mock_user

@app.get("/api/user/progress")
async def get_user_progress():
    return {
        "levels": {
            "reading": mock_user["reading_level"],
            "listening": mock_user["listening_level"],
            "speaking": mock_user["speaking_level"],
            "writing": mock_user["writing_level"]
        },
        "points": mock_user["points"],
        "streak": mock_user["streak_days"]
    }

# Speaking Routes
@app.get("/api/speaking/prompt")
async def get_speaking_prompt():
    return {
        "topic": "Technology in Daily Life",
        "questions": [
            "How has technology changed your daily life?",
            "What are the advantages and disadvantages of social media?",
            "Do you think artificial intelligence will replace human jobs?"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True) 