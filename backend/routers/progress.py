from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta
from ..database import get_db
from ..models import User, ProgressRecord

router = APIRouter()

class ProgressStats(BaseModel):
    reading_level: int
    listening_level: int
    speaking_level: int
    writing_level: int
    total_points: int
    streak_days: int
    recent_activities: List[dict]
    achievements: List[dict]

class ActivitySummary(BaseModel):
    activity_type: str
    date: datetime
    score: float
    duration: int
    points_earned: int

@router.get("/stats/{user_id}")
async def get_user_stats(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get comprehensive stats for a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get recent activities
    recent_activities = (
        db.query(ProgressRecord)
        .filter(ProgressRecord.user_id == user_id)
        .order_by(ProgressRecord.created_at.desc())
        .limit(10)
        .all()
    )
    
    # Calculate achievements
    achievements = calculate_achievements(user, recent_activities)
    
    return ProgressStats(
        reading_level=user.reading_level,
        listening_level=user.listening_level,
        speaking_level=user.speaking_level,
        writing_level=user.writing_level,
        total_points=user.points,
        streak_days=user.streak_days,
        recent_activities=[{
            "type": activity.activity_type,
            "score": activity.score,
            "date": activity.created_at,
            "metadata": activity.metadata
        } for activity in recent_activities],
        achievements=achievements
    )

@router.get("/activity-summary")
async def get_activity_summary(
    user_id: int,
    start_date: datetime,
    end_date: datetime,
    db: Session = Depends(get_db)
):
    """Get activity summary for a date range"""
    activities = (
        db.query(ProgressRecord)
        .filter(
            ProgressRecord.user_id == user_id,
            ProgressRecord.created_at.between(start_date, end_date)
        )
        .all()
    )
    
    return [
        ActivitySummary(
            activity_type=activity.activity_type,
            date=activity.created_at,
            score=activity.score,
            duration=activity.metadata.get("duration", 0),
            points_earned=calculate_points(activity)
        )
        for activity in activities
    ]

@router.post("/update-streak")
async def update_streak(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Update user's daily streak"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if there was activity in the last 24 hours
    recent_activity = (
        db.query(ProgressRecord)
        .filter(
            ProgressRecord.user_id == user_id,
            ProgressRecord.created_at >= datetime.utcnow() - timedelta(days=1)
        )
        .first()
    )
    
    if recent_activity:
        # Update streak
        if not user.last_activity or user.last_activity.date() < datetime.utcnow().date():
            user.streak_days += 1
            # Award streak points
            streak_bonus = min(user.streak_days * 10, 100)  # Cap bonus at 100 points
            user.points += streak_bonus
    else:
        # Reset streak if no activity in last 24 hours
        user.streak_days = 0
    
    user.last_activity = datetime.utcnow()
    db.commit()
    
    return {"streak_days": user.streak_days, "total_points": user.points}

@router.post("/update-level")
async def update_user_level(
    user_id: int,
    activity_type: str,
    new_score: float,
    db: Session = Depends(get_db)
):
    """Update user's level based on recent performance"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get average of recent scores
    recent_scores = (
        db.query(ProgressRecord)
        .filter(
            ProgressRecord.user_id == user_id,
            ProgressRecord.activity_type == activity_type
        )
        .order_by(ProgressRecord.created_at.desc())
        .limit(5)
        .all()
    )
    
    scores = [record.score for record in recent_scores] + [new_score]
    avg_score = sum(scores) / len(scores)
    
    # Update level based on activity type
    level_attr = f"{activity_type}_level"
    current_level = getattr(user, level_attr)
    
    # Calculate new level (0-30 scale)
    new_level = min(30, int(avg_score * 30))
    
    # Only increase level if significant improvement
    if new_level > current_level:
        setattr(user, level_attr, new_level)
        # Award points for level up
        level_up_bonus = (new_level - current_level) * 50
        user.points += level_up_bonus
        db.commit()
    
    return {
        "activity_type": activity_type,
        "new_level": new_level,
        "level_change": new_level - current_level,
        "points_earned": level_up_bonus if new_level > current_level else 0
    }

def calculate_points(activity: ProgressRecord) -> int:
    """Calculate points for an activity based on score and duration"""
    base_points = int(activity.score * 100)  # Base points from score
    duration_bonus = activity.metadata.get("duration", 0) // 5  # Bonus points for duration (1 point per 5 minutes)
    return base_points + duration_bonus

def calculate_achievements(user: User, activities: List[ProgressRecord]) -> List[dict]:
    """Calculate user's achievements based on their progress"""
    achievements = []
    
    # Streak achievements
    if user.streak_days >= 7:
        achievements.append({
            "title": "Week Warrior",
            "description": "Maintained a 7-day learning streak",
            "icon": "🔥"
        })
    
    # Level achievements
    for skill in ["reading", "listening", "speaking", "writing"]:
        level = getattr(user, f"{skill}_level")
        if level >= 10:
            achievements.append({
                "title": f"{skill.capitalize()} Novice",
                "description": f"Reached level 10 in {skill}",
                "icon": "⭐"
            })
        if level >= 20:
            achievements.append({
                "title": f"{skill.capitalize()} Expert",
                "description": f"Reached level 20 in {skill}",
                "icon": "🌟"
            })
        if level >= 30:
            achievements.append({
                "title": f"{skill.capitalize()} Master",
                "description": f"Reached level 30 in {skill}",
                "icon": "👑"
            })
    
    # Activity count achievements
    activity_counts = {}
    for activity in activities:
        activity_counts[activity.activity_type] = activity_counts.get(activity.activity_type, 0) + 1
        
        if activity_counts[activity.activity_type] >= 10:
            achievements.append({
                "title": f"{activity.activity_type.capitalize()} Explorer",
                "description": f"Completed 10 {activity.activity_type} exercises",
                "icon": "🎯"
            })
    
    return achievements 