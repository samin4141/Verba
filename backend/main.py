from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from openai import AsyncOpenAI
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Configure OpenAI
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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

async def generate_reading_passage(level: int, topic: Optional[str] = None, length: str = "medium") -> dict:
    # Define length parameters
    length_words = {
        "short": "150-200",
        "medium": "300-400",
        "long": "500-600"
    }

    # Create prompt based on level
    level_descriptions = {
        (1, 10): "basic vocabulary and simple sentence structures",
        (11, 20): "intermediate vocabulary and varied sentence structures",
        (21, 30): "advanced vocabulary, complex sentence structures, and academic language"
    }

    # Get appropriate level description
    level_desc = next(desc for (low, high), desc in level_descriptions.items() if low <= level <= high)

    # Build the prompt
    topic_prompt = f" about {topic}" if topic else ""
    system_prompt = f"""Generate an English reading passage suitable for language learners.
    Requirements:
    1. Level: Use {level_desc}
    2. Length: {length_words[length]} words
    3. Topic{topic_prompt}
    4. Include:
       - A clear title
       - Well-structured paragraphs
       - Engaging content that promotes critical thinking
    5. Also generate 5 questions that test:
       - Main idea comprehension
       - Specific details
       - Vocabulary understanding
       - Inference skills
       - Critical analysis
    
    Format the response as a JSON object with:
    {{
        "title": "The title",
        "content": "The passage content",
        "questions": [
            {{
                "id": 1,
                "text": "Question text",
                "type": "multiple_choice/open_ended",
                "options": ["A", "B", "C", "D"] (for multiple choice only),
                "correct_answer": "The correct answer"
            }}
        ]
    }}"""

    try:
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "Generate the passage and questions"}
            ],
            temperature=0.7
        )
        
        # Parse the response
        passage_data = json.loads(response.choices[0].message.content)
        return passage_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating passage: {str(e)}")

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

# Reading Routes
@app.get("/api/reading/passage")
async def get_default_reading_passage():
    # Default values for GET request
    return await generate_reading_passage(level=15, topic="General Knowledge", length="medium")

@app.post("/api/reading/passage")
async def get_custom_reading_passage(request: ReadingPassageRequest):
    return await generate_reading_passage(request.level, request.topic, request.length)

@app.post("/api/reading/evaluate")
async def evaluate_reading(answers: dict):
    try:
        # Use OpenAI to evaluate the answers
        evaluation_prompt = f"""Evaluate these English reading comprehension answers.
        Questions and Answers: {json.dumps(answers)}
        
        Provide evaluation as JSON with:
        {{
            "score": (0-1 float),
            "feedback": [list of specific feedback points],
            "suggestions": [list of improvement suggestions]
        }}"""

        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": evaluation_prompt},
                {"role": "user", "content": "Evaluate the answers"}
            ]
        )
        
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error evaluating answers: {str(e)}")

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

# Writing Routes
@app.post("/api/writing/feedback")
async def get_writing_feedback(text: str):
    # Mock feedback
    return {
        "grammar_score": 0.9,
        "vocabulary_score": 0.85,
        "structure_score": 0.8,
        "suggestions": [
            "Consider using more varied sentence structures",
            "Good use of technical vocabulary",
            "Well-organized paragraphs"
        ]
    }

# Listening Routes
@app.get("/api/listening/content")
async def get_listening_content():
    return {
        "title": "Understanding Technology Trends",
        "url": "https://example.com/mock-audio",
        "transcript": "This is a mock transcript for testing purposes.",
        "questions": [
            {
                "id": 1,
                "text": "What is the main topic of the audio?",
                "type": "multiple_choice",
                "options": ["Technology", "Nature", "History", "Art"]
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True) 