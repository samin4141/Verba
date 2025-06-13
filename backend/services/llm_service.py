import os
from dotenv import load_dotenv
import cohere
from cohere.errors import (
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    TooManyRequestsError,
    ServiceUnavailableError
)
from typing import List, Dict, Optional
import aiohttp  # Added for async HTTP requests
import asyncio

# Load environment variables
load_dotenv()

class LLMService:
    def __init__(self):
        """Initialize LLM service with Cohere"""
        api_key = os.getenv('COHERE_API_KEY')
        if not api_key:
            raise ValueError("COHERE_API_KEY not found in environment variables")
        self.client = cohere.Client(api_key)
        self.api_key = api_key  # Store API key for async client
    
    async def get_response(self, 
                          prompt: str, 
                          conversation_history: List[Dict[str, str]], 
                          system_prompt: Optional[str] = None) -> str:
        """
        Get AI response using Cohere's chat API asynchronously
        Args:
            prompt: The current user message
            conversation_history: List of previous messages
            system_prompt: Optional prompt to guide the AI's behavior
        Returns:
            AI response text
        """
        try:
            # Format conversation history for Cohere
            formatted_history = []
            for msg in conversation_history:
                role = "User" if msg["role"] == "user" else "Chatbot"
                formatted_history.append({"role": role, "message": msg["content"]})
            
            # Add system prompt if provided
            if system_prompt:
                formatted_history.insert(0, {
                    "role": "System",
                    "message": system_prompt
                })
            
            # Since Cohere's Python client doesn't have native async support,
            # we'll use their REST API directly with aiohttp for true async behavior
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    "https://api.cohere.ai/v1/chat",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "message": prompt,
                        "chat_history": formatted_history,
                        "model": "command",
                        "temperature": 0.7,
                    }
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result['text']
                    else:
                        error_data = await response.json()
                        raise ValueError(f"API request failed: {error_data}")
            
        except aiohttp.ClientError as e:
            raise ValueError(f"Network error: {e}")
        except UnauthorizedError:
            raise ValueError("Invalid API key. Please check your Cohere API key.")
        except BadRequestError as e:
            raise ValueError(f"Invalid request format: {e}")
        except TooManyRequestsError:
            raise ValueError("Rate limit exceeded. Please try again later.")
        except ServiceUnavailableError:
            raise ValueError("Cohere service is temporarily unavailable.")
        except (ForbiddenError, NotFoundError) as e:
            raise ValueError(f"Error accessing Cohere API: {e}")
        except Exception as e:
            raise ValueError(f"Unexpected error: {e}")
    
    def get_speaking_prompt(self) -> str:
        """Return the system prompt for speaking practice"""
        return """You are an English speaking tutor. Your role is to:
        1. Engage in natural conversations with the student
        2. Correct any grammar or pronunciation mistakes
        3. Provide constructive feedback
        4. Adapt your language to the student's level
        5. Keep responses clear and concise
        6. Encourage the student to speak more
        7. Use simple language that's easy to understand
        Please maintain a friendly tone throughout the conversation but be strict in correcting the student's mistakes.
        You will be a teacher and the student will be a student.
        You will correct mistakes and provide feedback on the student's speaking skills.
        You will start with correcting the most basic mistakes and gradually increase the difficulty.
        You will be concise and to the point.
        You will be strict in correcting the student's mistakes.
        You will teach the student based on IELTS speaking criteria. Use that grading scale to give feedback.`
        You will be a teacher and the student will be a student.
        Give concise and short feedback.
        Judge accurately.
        Everytime you give feedback, you will give a score out of 9 like a real IELTS exam.
        Everytime you speak back, dont be too long, allow the student to speak much more than you.
        Always start the conversation with a greeting and "Let's start the practice session.

        """