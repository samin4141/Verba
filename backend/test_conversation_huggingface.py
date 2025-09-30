import os
from dotenv import load_dotenv
import azure.cognitiveservices.speech as speechsdk
import requests
import time

# Load environment variables
load_dotenv()

# Initialize Azure Speech config
speech_config = speechsdk.SpeechConfig(
    subscription=os.getenv("AZURE_SPEECH_KEY"),
    region=os.getenv("AZURE_SPEECH_REGION")
)

# Ollama configuration
OLLAMA_URL = os.getenv('OLLAMA_URL', 'http://localhost:11434')
OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', 'llama3.2')

def get_ai_response(prompt: str, conversation_history: list) -> str:
    """Get response using Ollama's local API"""
    
    print("\nDebug: Connecting to Ollama...")
    
    try:
        # Format conversation history for Ollama
        messages = []
        for msg in conversation_history:
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })
        
        # Generate response using Ollama
        response = requests.post(
            f"{OLLAMA_URL}/api/chat",
            json={
                "model": OLLAMA_MODEL,
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                }
            },
            timeout=120
        )
        
        if response.status_code == 200:
            result = response.json()
            return result['message']['content']
        else:
            print(f"\nError: Ollama API returned status {response.status_code}")
            return "There was an error connecting to Ollama. Make sure it's running."
            
    except requests.exceptions.ConnectionError:
        print("\nError: Could not connect to Ollama")
        print("Make sure Ollama is running with: ollama serve")
        return "Could not connect to Ollama. Please make sure Ollama is running."
    except requests.exceptions.Timeout:
        print("\nError: Request to Ollama timed out")
        return "Request timed out. The model might be processing a large request."
    except Exception as e:
        print(f"\nUnexpected error: {e}")
        return "I apologize, but I'm having trouble processing your request."

def simulate_conversation():
    # Check if Ollama is running
    try:
        response = requests.get(f"{OLLAMA_URL}/api/version", timeout=5)
        if response.status_code != 200:
            print("\nError: Could not connect to Ollama!")
            print("Please make sure Ollama is running with: ollama serve")
            return
    except:
        print("\nError: Could not connect to Ollama!")
        print("Please make sure Ollama is running with: ollama serve")
        print(f"Expected Ollama at: {OLLAMA_URL}")
        return
        
    print("\nStarting conversation test...")
    print("Speak when you see 'Listening...'. Press Ctrl+C to exit.")
    print(f"\nUsing Ollama model: {OLLAMA_MODEL}")
    print("Note: First response might take a moment as the model loads...")
    
    # Configure speech recognizer
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config)
    
    # Configure speech synthesizer for responses
    speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config)
    
    conversation_history = []
    
    try:
        while True:
            print("\nListening...")
            
            # Get speech input
            result = speech_recognizer.recognize_once_async().get()
            
            if result.reason == speechsdk.ResultReason.RecognizedSpeech:
                user_message = result.text
                print(f"\nYou said: {user_message}")
                
                # Add user message to history
                conversation_history.append({"role": "user", "content": user_message})
                
                # Get AI response using Ollama
                response = get_ai_response(user_message, conversation_history)
                print(f"\nAI: {response}")
                
                # Add response to history
                conversation_history.append({"role": "assistant", "content": response})
                
                # Speak response
                speech_result = speech_synthesizer.speak_text_async(response).get()
                
                if speech_result.reason != speechsdk.ResultReason.SynthesizingAudioCompleted:
                    print(f"Error synthesizing speech: {speech_result.reason}")
                
            elif result.reason == speechsdk.ResultReason.NoMatch:
                print(f"No speech could be recognized: {result.no_match_details}")
            else:
                print(f"Error recognizing speech: {result.reason}")
                
    except KeyboardInterrupt:
        print("\nEnding conversation...")
        
        # Provide conversation summary
        print("\nConversation Summary:")
        print("---------------------")
        for message in conversation_history:
            role = "You" if message["role"] == "user" else "AI"
            print(f"{role}: {message['content']}")

if __name__ == "__main__":
    print("Verba Speaking Test (Ollama Version)")
    print("===================================")
    print("This will test the conversation flow using Ollama:")
    print("1. Speech-to-text (Azure)")
    print("2. AI processing (Ollama - Local)")
    print("3. Text-to-speech (Azure)")
    print("\nMake sure your microphone is connected and Ollama is running!")
    
    # Run the conversation
    simulate_conversation() 