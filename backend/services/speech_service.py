import os
from dotenv import load_dotenv
import azure.cognitiveservices.speech as speechsdk
import asyncio
from typing import Optional, Callable

# grab env s
load_dotenv()

class SpeechService:
    def __init__(self):
        # setup azure speech 
        speech_key = os.getenv("AZURE_SPEECH_KEY")
        region = os.getenv("AZURE_SPEECH_REGION")
        
        if not speech_key or not region:
            raise ValueError("need azure speech credentials in .env")
        
        self.config = speechsdk.SpeechConfig(
            subscription=speech_key,
            region=region
        )
        self.config.speech_recognition_language = "en-US"
        self.config.speech_synthesis_voice_name = "en-US-JennyNeural" 
        
        self.recognizer = None
        self.synthesizer = None
    
    async def start_continuous_recognition(self, callback):
        # keeps listening until stopped
        try:
            self.recognizer = speechsdk.SpeechRecognizer(speech_config=self.config)
            
            def on_recognized(evt):
                if evt.result.reason == speechsdk.ResultReason.RecognizedSpeech:
                    callback(evt.result.text)
            
            self.recognizer.recognized.connect(on_recognized)
            self.recognizer.start_continuous_recognition()
            return True
        except Exception as e:
            print(f"couldnt start recognition: {e}")
            return False
    
    async def stop_continuous_recognition(self):
        # stops the continuous listening
        try:
            if self.recognizer:
                self.recognizer.stop_continuous_recognition()
                return True
            return False
        except Exception as e:
            print(f"Error stopping recognition: {str(e)}")
            return False
    
    async def synthesize_speech(self, text: str) -> bool:
        # text to speech
        try:
            if not self.synthesizer:
                self.synthesizer = speechsdk.SpeechSynthesizer(speech_config=self.config)
            
            result = self.synthesizer.speak_text_async(text).get()
            return result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted
        except Exception as e:
            print(f"speech synthesis failed: {e}")
            return False
    
    async def recognize_speech(self) -> tuple[str, bool]:
        # single utterance recognition
        try:
            self.recognizer = speechsdk.SpeechRecognizer(speech_config=self.config)
            result = self.recognizer.recognize_once_async().get()
            
            if result.reason == speechsdk.ResultReason.RecognizedSpeech:
                return result.text, True
            elif result.reason == speechsdk.ResultReason.NoMatch:
                print(f"couldnt recognize speech: {result.no_match_details}")
                return "", False
            else:
                print(f"recognition error: {result.reason}")
                return "", False
                
        except Exception as e:
            print(f"speech recognition failed: {e}")
            return "", False
    
    async def recognize_speech_from_file(self, file_path: str) -> tuple[str, bool]:
        # transcribe audio file
        try:
            audio_cfg = speechsdk.AudioConfig(filename=file_path)
            recognizer = speechsdk.SpeechRecognizer(speech_config=self.config, audio_config=audio_cfg)
            result = recognizer.recognize_once_async().get()
            if result.reason == speechsdk.ResultReason.RecognizedSpeech:
                return result.text, True
            elif result.reason == speechsdk.ResultReason.NoMatch:
                print(f"no speech found in file: {result.no_match_details}")
                return "", False
            else:
                print(f"file recognition error: {result.reason}")
                return "", False
        except Exception as e:
            print(f"failed to transcribe file: {e}")
            return "", False 