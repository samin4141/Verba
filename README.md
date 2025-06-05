# Verba - AI-Powered English Learning Platform

Verba is a comprehensive English learning platform that uses AI to provide personalized learning experiences across reading, listening, speaking, and writing skills.

## Features

- **Initial Assessment**: Evaluate user's English proficiency across all skills
- **Reading**: AI-generated passages and comprehension questions
- **Listening**: Curated content from YouTube with transcripts and exercises
- **Speaking**: Real-time conversation with AI and pronunciation feedback
- **Writing**: Real-time writing feedback and comprehensive evaluations
- **Progress Tracking**: Level system, points, streaks, and achievements

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **AI Services**:
  - OpenAI GPT-3.5 for content generation and evaluation
  - Azure Speech Services for pronunciation analysis
  - Whisper API for speech-to-text
  - YouTube Data API for content curation

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/verba.git
cd verba
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the root directory with:
```env
DATABASE_URL=sqlite:///./verba.db  # For development
OPENAI_API_KEY=your_openai_api_key
AZURE_SPEECH_KEY=your_azure_speech_key
AZURE_SPEECH_REGION=your_azure_region
YOUTUBE_API_KEY=your_youtube_api_key
SECRET_KEY=your_jwt_secret_key
```

5. Initialize the database:
```bash
python backend/init_db.py
```

6. Run the development server:
```bash
uvicorn backend.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

- `DATABASE_URL`: Database connection string
- `OPENAI_API_KEY`: OpenAI API key for GPT-3.5 and Whisper
- `AZURE_SPEECH_KEY`: Azure Speech Services key
- `AZURE_SPEECH_REGION`: Azure Speech Services region
- `YOUTUBE_API_KEY`: YouTube Data API key
- `SECRET_KEY`: Secret key for JWT token generation

## API Endpoints

### Authentication
- POST `/api/auth/register`: Register new user
- POST `/api/auth/token`: Login and get access token
- GET `/api/auth/me`: Get current user info
- POST `/api/auth/change-password`: Change password

### Assessment
- POST `/api/assessment/initial`: Take initial assessment
- GET `/api/assessment/results`: Get assessment results

### Reading
- GET `/api/reading/generate-passage`: Get AI-generated reading passage
- POST `/api/reading/evaluate`: Evaluate reading comprehension

### Speaking
- POST `/api/speaking/generate-prompt`: Get speaking prompt
- POST `/api/speaking/analyze-speech`: Analyze speech recording
- POST `/api/speaking/chat`: Chat with AI conversation partner

### Writing
- POST `/api/writing/generate-prompt`: Get writing prompt
- POST `/api/writing/real-time-feedback`: Get real-time writing feedback
- POST `/api/writing/evaluate`: Get comprehensive writing evaluation

### Listening
- GET `/api/listening/recommend-content`: Get recommended listening content
- GET `/api/listening/get-transcript/{video_id}`: Get video transcript
- POST `/api/listening/generate-questions`: Generate questions for content
- POST `/api/listening/evaluate`: Evaluate listening comprehension

### Progress
- GET `/api/progress/stats/{user_id}`: Get user progress stats
- GET `/api/progress/activity-summary`: Get activity summary
- POST `/api/progress/update-streak`: Update daily streak
- POST `/api/progress/update-level`: Update skill level

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.