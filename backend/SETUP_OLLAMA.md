# Verba Backend Setup with Ollama

This guide will help you set up the Verba backend to run completely locally using Ollama.

## Prerequisites

1. **Install Ollama**: Download and install Ollama from [https://ollama.ai](https://ollama.ai)
2. **Python 3.8+**: Make sure you have Python installed

## Setup Instructions

### 1. Install Ollama and Pull a Model

```bash
# Install Ollama (follow instructions at https://ollama.ai)

# Pull a recommended model (llama3.2 is a good balance of speed and quality)
ollama pull llama3.2

# Or try other models:
# ollama pull llama3.1
# ollama pull mistral
# ollama pull phi3
```

### 2. Start Ollama Server

```bash
ollama serve
```

This will start the Ollama server on `http://localhost:11434` (default port).

### 3. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Ollama Configuration (Local LLM)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2

# Azure Speech Services (for speech-to-text and text-to-speech)
# Optional: You can replace this with local Whisper for STT
AZURE_SPEECH_KEY=your_azure_speech_key_here
AZURE_SPEECH_REGION=your_azure_region_here

# YouTube API (for listening content recommendations)
# Optional: Only needed if you want to use YouTube content recommendations
YOUTUBE_API_KEY=your_youtube_api_key_here

# Database Configuration
DATABASE_URL=sqlite:///./verba.db

# JWT Secret for Authentication
JWT_SECRET=your_jwt_secret_here
```

### 5. Run the Backend

```bash
# Initialize the database
python init_db.py

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Testing

### Test the Speaking Bot

```bash
python test_speaking_bot.py
```

### Test Conversation Flow

```bash
python test_conversation_huggingface.py
```

## Recommended Ollama Models

- **llama3.2** (Default): Good balance of speed and quality
- **llama3.1**: Larger model, better quality but slower
- **mistral**: Fast and efficient
- **phi3**: Smaller model, very fast but less capable

## Optional: Local Speech-to-Text

If you want to run everything locally without Azure Speech Services, you can:

1. Install Whisper locally:
```bash
pip install openai-whisper
# or for faster inference:
pip install faster-whisper
```

2. Update `backend/services/speech_service.py` to use local Whisper instead of Azure Speech Services.

## Troubleshooting

### Ollama Connection Error
- Make sure Ollama is running: `ollama serve`
- Check if the model is pulled: `ollama list`
- Verify the URL in `.env` matches your Ollama server

### Slow Response Times
- Try a smaller model like `phi3` or `mistral`
- Check your system resources (CPU/GPU usage)
- Increase timeout in the code if needed

### Model Not Found
- Pull the model first: `ollama pull llama3.2`
- Check available models: `ollama list`

## Performance Tips

1. **Use GPU acceleration**: Ollama automatically uses GPU if available
2. **Keep Ollama running**: First request loads the model (slow), subsequent requests are faster
3. **Adjust temperature**: Lower temperature (0.3-0.5) for more consistent responses
4. **Model selection**: Start with `llama3.2`, adjust based on your hardware

## What's Changed from External APIs

- ✅ **Cohere API** → Ollama (local)
- ✅ **OpenAI GPT** → Ollama (local)
- ⚠️ **Azure Speech Services** → Still using Azure (can be replaced with local Whisper)
- ⚠️ **YouTube API** → Still using YouTube API (optional feature)

## Next Steps

- Consider replacing Azure Speech Services with local Whisper
- Optimize prompts for better responses with smaller models
- Experiment with different Ollama models for your use case

