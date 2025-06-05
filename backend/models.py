from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # User's current levels (0-30)
    reading_level = Column(Integer, default=0)
    listening_level = Column(Integer, default=0)
    speaking_level = Column(Integer, default=0)
    writing_level = Column(Integer, default=0)
    
    # Gamification
    points = Column(Integer, default=0)
    streak_days = Column(Integer, default=0)
    last_activity = Column(DateTime)
    
    # Relationships
    assessments = relationship("Assessment", back_populates="user")
    progress_records = relationship("ProgressRecord", back_populates="user")

class Assessment(Base):
    __tablename__ = "assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    assessment_type = Column(String)  # "initial" or "progress"
    reading_score = Column(Float)
    listening_score = Column(Float)
    speaking_score = Column(Float)
    writing_score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="assessments")

class ProgressRecord(Base):
    __tablename__ = "progress_records"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    activity_type = Column(String)  # "reading", "listening", "speaking", "writing"
    score = Column(Float)
    metadata = Column(JSON)  # Store additional activity-specific data
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="progress_records") 