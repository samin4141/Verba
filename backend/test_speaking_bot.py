import asyncio
import os
import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.append(str(backend_dir))

from services.speech_service import SpeechService
from services.llm_service import LLMService
from models.speaking import Message
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def main():
    print("Initializing Speaking Bot...")
    print("Make sure you have set up your .env file with AZURE_SPEECH_KEY, AZURE_SPEECH_REGION, and COHERE_API_KEY")
    
    # Initialize services
    try:
        speech_service = SpeechService()
        llm_service = LLMService()
    except Exception as e:
        print(f"Error initializing services: {e}")
        print("Please check your .env file and API keys")
        return

    # Keep track of conversation
    conversation_history = []
    
    # Get initial greeting from AI
    try:
        print("\nStarting conversation...")
        welcome_msg = await llm_service.get_response(
            "Let's start our English conversation practice.",
            [],
            llm_service.get_speaking_prompt()
        )
        print(f"\nAI: {welcome_msg}")
        
        # Synthesize welcome message
        await speech_service.synthesize_speech(welcome_msg)
        
        conversation_history.append({"role": "assistant", "content": welcome_msg})
        
    except Exception as e:
        print(f"Error starting conversation: {e}")
        return

    # Main conversation loop
    try:
        while True:
            print("\nListening... (Press Ctrl+C to end the conversation)")
            
            # Get speech input
            user_text, success = await speech_service.recognize_speech()
            
            if not success:
                print("Could not recognize speech. Please try again.")
                continue
            
            print(f"\nYou said: {user_text}")
            
            # Add user message to history
            conversation_history.append({"role": "user", "content": user_text})
            
            # Get AI response
            ai_response = await llm_service.get_response(
                user_text,
                conversation_history,
                llm_service.get_speaking_prompt()
            )
            
            print(f"\nAI: {ai_response}")
            
            # Add AI response to history
            conversation_history.append({"role": "assistant", "content": ai_response})
            
            # Synthesize AI response
            await speech_service.synthesize_speech(ai_response)
            
    except KeyboardInterrupt:
        print("\n\nEnding conversation...")
        
        # Get final feedback
        try:
            print("\nGenerating feedback...")
            feedback_prompt = "Please provide feedback on the student's English speaking skills based on our conversation. Include strengths and areas for improvement."
            feedback = await llm_service.get_response(
                feedback_prompt,
                conversation_history,
                llm_service.get_speaking_prompt()
            )
            
            print("\nFeedback on your speaking practice:")
            print("-----------------------------------")
            print(feedback)
            
            # Synthesize feedback
            await speech_service.synthesize_speech(feedback)
            
        except Exception as e:
            print(f"Error generating feedback: {e}")
    
    except Exception as e:
        print(f"Error during conversation: {e}")

if __name__ == "__main__":
    asyncio.run(main()) 