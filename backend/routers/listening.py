from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import openai
import os
from googleapiclient.discovery import build
import yt_dlp
from ..database import get_db
from ..models import User, ProgressRecord

router = APIRouter()

class ListeningContent(BaseModel):
    title: str
    url: str
    duration: int
    difficulty_level: int
    topics: List[str]
    transcript: Optional[str] = None
    questions: Optional[List[dict]] = None

class ListeningResponse(BaseModel):
    content_id: str
    answers: List[dict]

@router.get("/recommend-content")
async def recommend_content(
    user_level: int,
    topics: Optional[List[str]] = None,
    duration_range: Optional[tuple] = None
):
    """Recommend YouTube content based on user's level and interests"""
    youtube = build('youtube', 'v3', developerKey=os.getenv('YOUTUBE_API_KEY'))
    
    # Build search query based on topics and level
    level_terms = {
        (0, 10): "basic english listening",
        (11, 20): "intermediate english listening",
        (21, 30): "advanced english listening"
    }
    
    level_term = next(term for (low, high), term in level_terms.items() 
                     if low <= user_level <= high)
    
    search_query = f"{level_term}"
    if topics:
        search_query += f" {' '.join(topics)}"
    
    # Search YouTube
    search_response = youtube.search().list(
        q=search_query,
        part='snippet',
        maxResults=10,
        type='video',
        videoCaption='closedCaption'  # Only videos with captions
    ).execute()
    
    videos = []
    for item in search_response['items']:
        video_id = item['id']['videoId']
        
        # Get video details
        video_response = youtube.videos().list(
            part='contentDetails,statistics',
            id=video_id
        ).execute()
        
        if video_response['items']:
            video_details = video_response['items'][0]
            
            # Extract duration and convert to seconds
            duration = video_details['contentDetails']['duration']
            # TODO: Convert ISO 8601 duration to seconds
            
            videos.append(ListeningContent(
                title=item['snippet']['title'],
                url=f"https://www.youtube.com/watch?v={video_id}",
                duration=duration,
                difficulty_level=user_level,
                topics=topics or [],
                transcript=None  # Will be fetched when needed
            ))
    
    return videos

@router.get("/get-transcript/{video_id}")
async def get_transcript(video_id: str):
    """Get transcript for a YouTube video"""
    ydl_opts = {
        'writesubtitles': True,
        'subtitleslangs': ['en'],
        'skip_download': True,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}", download=False)
            if 'subtitles' in info and 'en' in info['subtitles']:
                return {"transcript": info['subtitles']['en'][0]['data']}
            else:
                raise HTTPException(status_code=404, detail="No English transcript available")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/generate-questions")
async def generate_questions(transcript: str, level: int):
    """Generate questions based on the transcript"""
    openai.api_key = os.getenv("OPENAI_API_KEY")
    
    response = await openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": f"""Generate 5 listening comprehension questions for level {level}/30 based on the transcript.
            Include a mix of:
            1. Main idea questions
            2. Detail questions
            3. Inference questions
            4. Vocabulary questions
            
            Format as JSON with:
            - question_text
            - type (multiple_choice/short_answer)
            - options (for multiple choice)
            - correct_answer"""},
            {"role": "user", "content": transcript}
        ]
    )
    
    return response.choices[0].message.content

@router.post("/evaluate")
async def evaluate_listening_response(
    response: ListeningResponse,
    db: Session = Depends(get_db)
):
    """Evaluate user's answers to listening questions"""
    openai.api_key = os.getenv("OPENAI_API_KEY")
    
    total_score = 0
    feedback = []
    
    for answer in response.answers:
        evaluation = await openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Evaluate the answer to this listening comprehension question. Provide a score (0-1) and specific feedback."},
                {"role": "user", "content": f"Question: {answer['question']}\nUser's Answer: {answer['answer']}\nCorrect Answer: {answer['correct_answer']}"}
            ]
        )
        
        result = eval(evaluation.choices[0].message.content)
        total_score += result["score"]
        feedback.append(result["feedback"])
    
    average_score = total_score / len(response.answers)
    
    # Store progress record
    progress_record = ProgressRecord(
        user_id=1,  # Replace with actual user ID from auth
        activity_type="listening",
        score=average_score,
        metadata={
            "content_id": response.content_id,
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
            "Practice with slower, clearer audio content",
            "Focus on basic vocabulary in context",
            "Try watching videos with subtitles first"
        ]
    elif score < 0.6:
        return [
            "Challenge yourself with natural speech speed",
            "Practice with different accents",
            "Focus on understanding context clues"
        ]
    else:
        return [
            "Try content without subtitles",
            "Practice with academic lectures",
            "Focus on note-taking while listening"
        ] 