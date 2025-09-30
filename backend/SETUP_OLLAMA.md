# Running the backend with Ollama

So you want to run this thing locally without paying for APIs? Here's how.

## What you need

1. Ollama (grab it from https://ollama.ai)
2. Python 3.8 or newer

## Setup

### 1. Get Ollama running

```bash
# Install Ollama first (check their website)

# Download a model (llama3.2 works pretty well)
ollama pull llama3.2

# Or try these if you want:
# ollama pull mistral     (faster)
# ollama pull phi3        (even faster, less smart)
# ollama pull llama3.1    (smarter, slower)
```

### 2. Start the Ollama server

```bash
ollama serve
```

It runs on `http://localhost:11434` by default.

### 3. Install Python stuff

```bash
cd backend
pip install -r requirements.txt
```

### 4. Make a .env file

Create `.env` in the backend folder:

```bash
# Ollama stuff
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2

# If you have Azure Speech (optional)
# AZURE_SPEECH_KEY=your_key
# AZURE_SPEECH_REGION=us-east-1

# YouTube API (optional, only for listening features)
# YOUTUBE_API_KEY=your_key

# Database (just uses SQLite)
DATABASE_URL=sqlite:///./verba.db

# Some random secret for JWT
JWT_SECRET=change_this_to_something_random
```

### 5. Run it

```bash
# Set up the database first
python init_db.py

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Testing

Want to test if Ollama is working?

```bash
python test_ollama_connection.py
```

Or test the full speaking bot:

```bash
python test_speaking_bot.py
```

## Which model should I use?

- **llama3.2** - good default, not too slow
- **mistral** - faster, still pretty good
- **phi3** - super fast, but not as smart
- **llama3.1** - best quality, but slow as hell

Just depends on your hardware tbh.

## Going fully local

Still using Azure for speech recognition? You can replace it with Whisper:

```bash
pip install openai-whisper
# or if you want it faster:
pip install faster-whisper
```

Then update `services/speech_service.py` to use Whisper instead. I might do this later.

## Common problems

**Can't connect to Ollama**
- Is it running? Try `ollama serve`
- Check `ollama list` to see your models
- Make sure the URL in `.env` is right

**Super slow responses**
- Try a smaller model (phi3 or mistral)
- First request is always slow (loading the model)
- Check your CPU/RAM usage

**Model not found**
- Did you pull it? `ollama pull llama3.2`
- Check what you have: `ollama list`

## Performance tips

- Ollama will use your GPU if you have one (makes it way faster)
- The first request is slow because it loads the model into memory
- After that it's pretty quick
- Lower temperature (like 0.3) makes responses more consistent
- Try different models until you find one that works for your machine

## What changed

Before we were using:
- Cohere API (paid) -> now using Ollama (local, free)
- OpenAI API (paid) -> now using Ollama (local, free)
- Azure Speech (still using this, but can swap for Whisper)
- YouTube API (still using for listening features)

So basically everything runs locally now except voice stuff and YouTube videos.

## Next steps

- Probably should add local Whisper support
- Fine-tune the prompts for smaller models
- Maybe add some caching so it's faster

That's it. Should work now.
