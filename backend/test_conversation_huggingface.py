import os
from dotenv import load_dotenv
import azure.cognitiveservices.speech as speechsdk
import cohere
from cohere.errors import (
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    TooManyRequestsError,
    ServiceUnavailableError
)
import time

# Load environment variables
load_dotenv()

# Initialize Azure Speech config
speech_config = speechsdk.SpeechConfig(
    subscription=os.getenv("AZURE_SPEECH_KEY"),
    region=os.getenv("AZURE_SPEECH_REGION")
)

def get_ai_response(prompt: str, conversation_history: list) -> str:
    """Get response using Cohere's API"""
    
    # Get and verify token with debug info
    api_key = os.getenv('COHERE_API_KEY')
    print("\nDebug: Checking Cohere API key configuration...")
    
    if not api_key:
        print("Error: COHERE_API_KEY not found in .env file!")
        return "Configuration error. Please check the console for details."
    
    try:
        # Initialize Cohere client
        co = cohere.Client(api_key)
        
        # Format conversation history for Cohere
        formatted_history = []
        for msg in conversation_history[:-1]:  # Exclude the latest message
            role = "User" if msg["role"] == "user" else "Chatbot"
            formatted_history.append({"role": role, "message": msg["content"]})
        
        # Generate response using Cohere
        response = co.chat(
            message=prompt,
            chat_history=formatted_history,
            model="command",  # You can change this to other models like "command-light" or "command-nightly"
            temperature=0.7,
        )
        
        return response.text
            
    except UnauthorizedError:
        print("\nError: Invalid API key")
        print("Please make sure your Cohere API key is valid")
        return "Authentication error. Please check your API key."
    except BadRequestError as e:
        print(f"\nError: Bad request - {e}")
        print("This might be due to invalid input format or model parameters")
        return "There was an error with the request format. Please try again."
    except TooManyRequestsError:
        print("\nError: Rate limit exceeded")
        print("You have exceeded the rate limit for API calls")
        return "Too many requests. Please wait a moment and try again."
    except ServiceUnavailableError:
        print("\nError: Service is currently unavailable")
        print("The Cohere API service might be experiencing issues")
        return "Service temporarily unavailable. Please try again later."
    except (ForbiddenError, NotFoundError) as e:
        print(f"\nError accessing API: {e}")
        return "There was an error accessing the AI service. Please try again later."
    except Exception as e:
        print(f"\nUnexpected error: {e}")
        return "I apologize, but I'm having trouble processing your request."

def simulate_conversation():
    # Check .env file first
    if not os.path.exists('.env'):
        print("\nError: .env file not found!")
        print("Please create a .env file in the backend directory with your Cohere API key:")
        print('COHERE_API_KEY=your-api-key-here')
        return
        
    api_key = os.getenv('COHERE_API_KEY')
    if not api_key:
        print("\nError: COHERE_API_KEY not found in .env file!")
        print("Please add your Cohere API key to the .env file:")
        print('COHERE_API_KEY=your-api-key-here')
        return
        
    print("\nStarting conversation test...")
    print("Speak when you see 'Listening...'. Press Ctrl+C to exit.")
    print("\nNote: First response might take 20 seconds as the model loads...")
    
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
                
                # Get AI response using Cohere
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
    print("Verba Speaking Test (Cohere Version)")
    print("===================================")
    print("This will test the conversation flow using Cohere's API:")
    print("1. Speech-to-text (Azure)")
    print("2. AI processing (Cohere - Testing Connection)")
    print("3. Text-to-speech (Azure)")
    print("\nMake sure your microphone is connected!")
    
    # Run the conversation
    simulate_conversation() 