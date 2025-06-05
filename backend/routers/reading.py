from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import openai
import os
from ..database import get_db
from ..models import User, ProgressRecord

router = APIRouter()

class ReadingPassage(BaseModel):
    title: str
    content: str
    questions: List[dict]
    level: int

class ReadingResponse(BaseModel):
    passage_id: str
    answers: List[dict]

@router.get("/generate-passage")
async def generate_reading_passage(
    level: int,
    topic: Optional[str] = None,
    db: Session = Depends(get_db)
):
    openai.api_key = os.getenv("OPENAI_API_KEY")
    
    # Generate a reading passage based on user's level
    system_prompt = f"""Generate an English reading passage suitable for level {level}/30 (30 being highest).
    The passage should be challenging but comprehensible for this level.
    Include a title and 5 questions (mix of multiple choice and open-ended) that test:
    1. Main idea comprehension
    2. Vocabulary understanding
    3. Inference skills
    4. Detail recognition
    5. Critical thinking
    
    Format the response as a JSON object with:
    - title
    - content
    - questions (array of question objects with type, text, and answers)"""
    
    topic_context = f" The topic should be about {topic}." if topic else ""
    
    response = await openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Generate a passage{topic_context}"}
        ]
    )
    
    # Parse and return the generated passage
    passage_data = eval(response.choices[0].message.content)
    return ReadingPassage(**passage_data)

@router.post("/evaluate")
async def evaluate_reading_response(
    response: ReadingResponse,
    db: Session = Depends(get_db)
):
    openai.api_key = os.getenv("OPENAI_API_KEY")
    
    # Evaluate each answer
    total_score = 0
    feedback = []
    
    for answer in response.answers:
        evaluation = await openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an English reading assessment expert. Evaluate the answer and provide a score (0-1) and constructive feedback."},
                {"role": "user", "content": f"Question: {answer['question']}\nStudent's Answer: {answer['answer']}"}
            ]
        )
        
        result = eval(evaluation.choices[0].message.content)
        total_score += result["score"]
        feedback.append(result["feedback"])
    
    # Calculate average score
    average_score = total_score / len(response.answers)
    
    # Store progress record
    progress_record = ProgressRecord(
        user_id=1,  # Replace with actual user ID from auth
        activity_type="reading",
        score=average_score,
        metadata={
            "passage_id": response.passage_id,
            "feedback": feedback
        }
    )
    db.add(progress_record)
    db.commit()
    
    return {
        "score": average_score,
        "feedback": feedback,
        "recommendations": generate_recommendations(average_score)
    }

def generate_recommendations(score: float) -> List[str]:
    if score < 0.3:
        return [
            "Focus on basic vocabulary building",
            "Practice reading simpler texts",
            "Review basic grammar structures"
        ]
    elif score < 0.6:
        return [
            "Work on understanding context clues",
            "Practice summarizing paragraphs",
            "Focus on identifying main ideas"
        ]
    else:
        return [
            "Challenge yourself with academic texts",
            "Practice advanced inference skills",
            "Focus on critical analysis"
        ] 