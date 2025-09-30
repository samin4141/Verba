# Verba

An English learning platform that helps you practice for IELTS/CELPIP. Uses AI to give you feedback on reading, listening, speaking, and writing.

## What it does

- Takes an initial test to figure out your level
- Generates reading passages and questions based on your skill level
- Pulls YouTube videos for listening practice with transcripts
- Lets you have conversations with AI for speaking practice  
- Checks your writing in real-time and gives you feedback
- Tracks your progress with points and streaks

## What's inside

**Backend:**
- FastAPI for the server
- SQLAlchemy + SQLite for the database
- Ollama running locally for AI stuff (no more paid API calls)
- Azure Speech API for voice recognition (working on replacing this with local Whisper)

**Frontend:**
- React + TypeScript
- Vite for building
- Tailwind for styling
- All the shadcn/ui components

## Getting started

Check out `backend/SETUP_OLLAMA.md` for backend setup.

Frontend is just:
```bash
cd frontend
npm install
npm run dev
```

Then hit `http://localhost:8080`

## Note

This is a work in progress. Some features might be broken or half-finished. That's just how it is sometimes.
