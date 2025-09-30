import os
from dotenv import load_dotenv
from typing import List, Dict, Optional
import aiohttp
import asyncio
import json

# grab env variables
load_dotenv()

class LLMService:
    def __init__(self):
        # get ollama settings from env
        self.ollama_url = os.getenv('OLLAMA_URL', 'http://localhost:11434')
        self.model_name = os.getenv('OLLAMA_MODEL', 'llama3.2')
    
    async def get_response(self, 
                          prompt: str, 
                          conversation_history: List[Dict[str, str]], 
                          system_prompt: Optional[str] = None) -> str:
        # this talks to ollama and gets a response
        # will throw errors if ollama isnt running or times out
        try:
            messages = []
            
            # add system prompt if we got one
            if system_prompt:
                messages.append({
                    "role": "system",
                    "content": system_prompt
                })
            
            # add conversation history
            for msg in conversation_history:
                messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
            
            # add the current user message
            messages.append({
                "role": "user",
                "content": prompt
            })
            
            # call ollama
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.ollama_url}/api/chat",
                    json={
                        "model": self.model_name,
                        "messages": messages,
                        "stream": False,
                        "options": {
                            "temperature": 0.7,
                        }
                    },
                    timeout=aiohttp.ClientTimeout(total=120)
                ) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        return data['message']['content']
                    else:
                        error_text = await resp.text()
                        raise ValueError(f"ollama request failed: {error_text}")
            
        except aiohttp.ClientError as e:
            raise ValueError(f"cant connect to ollama: {e}. is it running?")
        except asyncio.TimeoutError:
            raise ValueError("ollama timed out. maybe try a smaller model?")
        except Exception as e:
            print(f"unexpected error in llm service: {e}")
            raise ValueError(f"something went wrong: {e}")
    
    def get_speaking_prompt(self) -> str:
        # prompt for the speaking tutor AI
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