import os
from dotenv import load_dotenv
from typing import List, Dict, Optional
import aiohttp
import asyncio
import json

# Load environment variables
load_dotenv()

class LLMService:
    def __init__(self):
        """Initialize LLM service with Ollama"""
        self.ollama_url = os.getenv('OLLAMA_URL', 'http://localhost:11434')
        self.model = os.getenv('OLLAMA_MODEL', 'llama3.2')
    
    async def get_response(self, 
                          prompt: str, 
                          conversation_history: List[Dict[str, str]], 
                          system_prompt: Optional[str] = None) -> str:
        """
        Get AI response using Ollama's local API asynchronously
        Args:
            prompt: The current user message
            conversation_history: List of previous messages
            system_prompt: Optional prompt to guide the AI's behavior
        Returns:
            AI response text
        """
        try:
            # Format conversation history for Ollama
            messages = []
            
            # Add system prompt if provided
            if system_prompt:
                messages.append({
                    "role": "system",
                    "content": system_prompt
                })
            
            # Add conversation history
            for msg in conversation_history:
                messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
            
            # Add current prompt
            messages.append({
                "role": "user",
                "content": prompt
            })
            
            # Call Ollama API
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.ollama_url}/api/chat",
                    json={
                        "model": self.model,
                        "messages": messages,
                        "stream": False,
                        "options": {
                            "temperature": 0.7,
                        }
                    },
                    timeout=aiohttp.ClientTimeout(total=120)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result['message']['content']
                    else:
                        error_data = await response.text()
                        raise ValueError(f"Ollama API request failed: {error_data}")
            
        except aiohttp.ClientError as e:
            raise ValueError(f"Network error connecting to Ollama: {e}. Make sure Ollama is running.")
        except asyncio.TimeoutError:
            raise ValueError("Request to Ollama timed out. The model might be processing a large request.")
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