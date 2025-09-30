from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os
from dotenv import load_dotenv
import json
from routers import speaking

load_dotenv()

app = FastAPI(
    title="Verba - English Learning Platform",
    description="Backend API for Verba",
    version="1.0.0"
)

# CORS setup - allowing everything for now
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# add speaking routes
app.include_router(speaking.router, prefix="/api/speaking", tags=["speaking"])

# mock data for testing
# TODO: replace with actual database queries
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
    length: Optional[str] = "medium"

@app.get("/")
async def root():
    return {"message": "Verba API"}

# user endpoints
@app.get("/api/user/profile")
async def get_profile():
    return mock_user

@app.get("/api/user/progress")
async def get_progress():
    # just returning mock data for now
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

@app.get("/api/speaking/prompt")
async def get_prompt():
    # sample speaking prompts
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