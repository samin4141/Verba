"""
Simple test to verify Ollama connection
"""
import requests
import os
from dotenv import load_dotenv

load_dotenv()

OLLAMA_URL = os.getenv('OLLAMA_URL', 'http://localhost:11434')
OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', 'llama3.2')

def test_ollama_connection():
    print("=" * 50)
    print("Testing Ollama Connection")
    print("=" * 50)
    print(f"\nOllama URL: {OLLAMA_URL}")
    print(f"Model: {OLLAMA_MODEL}")
    
    # Test 1: Check if Ollama is running
    print("\n1. Checking if Ollama is running...")
    try:
        response = requests.get(f"{OLLAMA_URL}/api/version", timeout=5)
        if response.status_code == 200:
            print("   ✅ Ollama is running!")
        else:
            print(f"   ❌ Ollama returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Could not connect to Ollama: {e}")
        return False
    
    # Test 2: Send a simple chat request
    print("\n2. Testing chat API with a simple question...")
    try:
        response = requests.post(
            f"{OLLAMA_URL}/api/chat",
            json={
                "model": OLLAMA_MODEL,
                "messages": [
                    {"role": "user", "content": "Say 'Hello!' in one word."}
                ],
                "stream": False
            },
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            ai_response = result['message']['content']
            print(f"   ✅ Ollama responded: '{ai_response}'")
            return True
        else:
            print(f"   ❌ Chat request failed with status {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error during chat: {e}")
        return False

if __name__ == "__main__":
    success = test_ollama_connection()
    
    print("\n" + "=" * 50)
    if success:
        print("✅ ALL TESTS PASSED!")
        print("\nYour backend is ready to use Ollama!")
        print("You can now start the backend with:")
        print("  uvicorn main:app --reload")
    else:
        print("❌ TESTS FAILED")
        print("\nTroubleshooting:")
        print("1. Make sure Ollama is running (it should already be)")
        print("2. Check if the model is installed: ollama list")
        print("3. Try pulling the model: ollama pull llama3.2")
    print("=" * 50)

