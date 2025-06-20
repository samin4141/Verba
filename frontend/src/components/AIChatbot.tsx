import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Send, MessageCircle } from 'lucide-react';
import { useConversation, type Message } from '@/hooks/useConversation';

interface AIChatbotProps {
  userLevel: number;
}

const AIChatbot = ({ userLevel }: AIChatbotProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [messages, setMessages] = useState([]);
  const [sessionStats, setSessionStats] = useState({ pronunciation: 0, grammar: 0, vocabulary: 0, fluency: 0, suggestions: [] });
  
  const {
    currentConversation,
    createConversation,
    addMessage,
    generateAIResponse,
    cleanupOldConversations
  } = useConversation();

  useEffect(() => {
    cleanupOldConversations();
  }, [cleanupOldConversations]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentConversation?.messages]);

  const startRecording = async () => {
    setError('');
    console.log('Starting audio recording...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        setError('');
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob);
        try {
          console.log('Sending audio to backend...');
          const response = await fetch('http://localhost:8000/api/speaking/transcribe', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          console.log('Transcription response:', data);
          if (data.success) {
            setRecordedText(data.text);
            setMessages(prev => [...prev, { role: 'user', text: data.text }]);
            setIsProcessing(true);
            try {
              console.log('Sending message to grade_and_respond:', data.text, messages);
              const resp = await fetch('http://localhost:8000/api/speaking/grade_and_respond', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: data.text, history: messages }),
              });
              const result = await resp.json();
              console.log('AI response:', result);
              setMessages(prev => [...prev, { role: 'ai', text: result.response, feedback: result.feedback }]);
              setSessionStats(result.feedback);
            } catch (err) {
              setError('Error getting AI response.');
              console.error('Error getting AI response:', err);
            }
            setIsProcessing(false);
          } else {
            setError('Could not transcribe audio.');
            console.error('Transcription failed:', data);
            setIsProcessing(false);
          }
        } catch (err) {
          setError('Error contacting backend.');
          console.error('Error contacting backend:', err);
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      console.log('MediaRecorder started.');
    } catch (err) {
      alert('Microphone access denied or not available.');
      console.error('Microphone access error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      setIsProcessing(true);
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log('Stopped recording.');
    }
  };

  const sendMessage = async () => {
    if (!recordedText.trim()) return;
    
    if (!currentConversation) {
      createConversation('AI Conversation');
    }

    setIsProcessing(true);
    
    // Add user message
    addMessage({
      type: 'user',
      content: recordedText
    });

    // Clear the input
    setRecordedText('');

    // Generate AI response
    await generateAIResponse(recordedText);
    setIsProcessing(false);
  };

  const handleStartNewConversation = () => {
    createConversation('New AI Conversation');
  };

  const renderMessage = (message: Message) => (
    <div
      key={message.id}
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          message.type === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <span className="text-xs opacity-70">
          {message.timestamp.toLocaleTimeString()}
        </span>
        
        {message.feedback && (
          <div className="mt-2 p-2 bg-white/10 rounded text-xs">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>Pronunciation: {message.feedback.pronunciation}/100</div>
              <div>Grammar: {message.feedback.grammar}/100</div>
              <div>Vocabulary: {message.feedback.vocabulary}/100</div>
              <div>Fluency: {message.feedback.fluency}/100</div>
            </div>
            {message.feedback.suggestions.length > 0 && (
              <div>
                <p className="font-medium mb-1">Suggestions:</p>
                <ul className="list-disc list-inside">
                  {message.feedback.suggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>AI Conversation Partner</span>
              </CardTitle>
              <Button size="sm" onClick={handleStartNewConversation}>
                New Chat
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              {currentConversation?.messages.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Start a conversation with your AI partner!</p>
                  <p className="text-sm mt-2">Click the microphone button to begin speaking</p>
                </div>
              )}
              
              {currentConversation?.messages.map(renderMessage)}
              
              {isProcessing && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center text-red-600">
                  {error}
                </div>
              )}
            </ScrollArea>
            
            {/* Voice Recording Interface */}
            <div className="p-6 border-t bg-gray-50">
              <div className="text-center space-y-4">
                {!isRecording && !recordedText && (
                  <div className="space-y-4">
                    <Button
                      size="lg"
                      onClick={startRecording}
                      disabled={isProcessing}
                      className="w-20 h-20 rounded-full bg-blue-500 hover:bg-blue-600"
                    >
                      <Mic className="h-8 w-8" />
                    </Button>
                    <p className="text-sm text-gray-600">
                      Tap to speak with your AI conversation partner
                    </p>
                  </div>
                )}

                {isRecording && (
                  <div className="space-y-4">
                    <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center animate-pulse mx-auto">
                      <MicOff className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-red-600 font-medium">Recording...</p>
                      <p className="text-sm text-gray-600">Speak clearly into your microphone</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={stopRecording}
                    >
                      Stop Recording
                    </Button>
                  </div>
                )}

                {recordedText && !isRecording && (
                  <div className="space-y-4">
                    <div className="p-4 bg-white border rounded-lg">
                      <p className="text-sm text-gray-800">{recordedText}</p>
                    </div>
                    <div className="flex justify-center space-x-2">
                      <Button
                        onClick={() => setRecordedText('')}
                        variant="outline"
                        disabled={isProcessing}
                      >
                        Record Again
                      </Button>
                      <Button
                        onClick={sendMessage}
                        disabled={isProcessing}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Feedback Panel */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Session Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {currentConversation?.messages.filter(m => m.type === 'user').length || 0}
              </div>
              <p className="text-sm text-gray-600">Messages Sent</p>
            </div>
            
            {currentConversation?.messages.length ? (
              <div className="space-y-3">
                <h4 className="font-medium">Latest Feedback:</h4>
                {(() => {
                  const lastAIMessage = [...(currentConversation?.messages || [])]
                    .reverse()
                    .find(m => m.type === 'ai' && m.feedback);
                  
                  if (!lastAIMessage?.feedback) return null;
                  
                  return (
                    <div className="space-y-2">
                      {[
                        { label: "Pronunciation", score: lastAIMessage.feedback.pronunciation },
                        { label: "Grammar", score: lastAIMessage.feedback.grammar },
                        { label: "Vocabulary", score: lastAIMessage.feedback.vocabulary },
                        { label: "Fluency", score: lastAIMessage.feedback.fluency }
                      ].map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{item.label}</span>
                            <Badge variant={item.score >= 85 ? "default" : "secondary"}>
                              {item.score}/100
                            </Badge>
                          </div>
                          <Progress value={item.score} className="h-1" />
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>💡 Speak clearly and at a natural pace</p>
              <p>🎯 Try to use varied vocabulary</p>
              <p>🗣️ Practice expressing complete thoughts</p>
              <p>⏱️ Conversations are stored for 2 days</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIChatbot;
