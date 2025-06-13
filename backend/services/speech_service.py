import os
from dotenv import load_dotenv
import azure.cognitiveservices.speech as speechsdk
import asyncio
from typing import Optional, Callable

# Load environment variables
load_dotenv()

class SpeechService:
    def __init__(self):
        """Initialize speech service with Azure credentials"""
        self.speech_key = os.getenv("AZURE_SPEECH_KEY")
        self.service_region = os.getenv("AZURE_SPEECH_REGION")
        
        if not self.speech_key or not self.service_region:
            raise ValueError("Azure Speech credentials not found in environment variables")
        
        self.speech_config = speechsdk.SpeechConfig(
            subscription=self.speech_key,
            region=self.service_region
        )
        self.speech_config.speech_recognition_language = "en-US"
        self.speech_config.speech_synthesis_voice_name = "en-US-JennyNeural"
        
        self.recognizer = None
        self.synthesizer = None
    
    async def start_continuous_recognition(self, callback):
        """Start continuous speech recognition"""
        try:
            self.recognizer = speechsdk.SpeechRecognizer(speech_config=self.speech_config)
            
            def handle_result(evt):
                if evt.result.reason == speechsdk.ResultReason.RecognizedSpeech:
                    callback(evt.result.text)
            
            self.recognizer.recognized.connect(handle_result)
            self.recognizer.start_continuous_recognition()
            return True
        except Exception as e:
            print(f"Error starting recognition: {str(e)}")
            return False
    
    async def stop_continuous_recognition(self):
        """Stop continuous speech recognition"""
        try:
            if self.recognizer:
                self.recognizer.stop_continuous_recognition()
                return True
            return False
        except Exception as e:
            print(f"Error stopping recognition: {str(e)}")
            return False
    
    async def synthesize_speech(self, text: str) -> bool:
        """Synthesize speech from text"""
        try:
            if not self.synthesizer:
                self.synthesizer = speechsdk.SpeechSynthesizer(speech_config=self.speech_config)
            
            result = self.synthesizer.speak_text_async(text).get()
            return result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted
        except Exception as e:
            print(f"Error synthesizing speech: {str(e)}")
            return False
    
    async def recognize_speech(self) -> tuple[str, bool]:
        """
        Single utterance recognition
        Returns: (text, success)
        """
        try:
            self.recognizer = speechsdk.SpeechRecognizer(speech_config=self.speech_config)
            result = self.recognizer.recognize_once_async().get()
            
            if result.reason == speechsdk.ResultReason.RecognizedSpeech:
                return result.text, True
            elif result.reason == speechsdk.ResultReason.NoMatch:
                print(f"No speech could be recognized: {result.no_match_details}")
                return "", False
            else:
                print(f"Error recognizing speech: {result.reason}")
                return "", False
                
        except Exception as e:
            print(f"Error in speech recognition: {e}")
            return "", False
    
    async def recognize_speech_from_file(self, file_path: str) -> tuple[str, bool]:
        """
        Recognize speech from an audio file.
        Returns: (text, success)
        """
        try:
            audio_config = speechsdk.AudioConfig(filename=file_path)
            recognizer = speechsdk.SpeechRecognizer(speech_config=self.speech_config, audio_config=audio_config)
            result = recognizer.recognize_once_async().get()
            if result.reason == speechsdk.ResultReason.RecognizedSpeech:
                return result.text, True
            elif result.reason == speechsdk.ResultReason.NoMatch:
                print(f"No speech could be recognized: {result.no_match_details}")
                return "", False
            else:
                print(f"Error recognizing speech: {result.reason}")
                return "", False
        except Exception as e:
            print(f"Error in speech recognition from file: {e}")
            return "", False 