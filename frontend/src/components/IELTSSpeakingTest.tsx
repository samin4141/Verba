
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, Square, Clock, User, Timer } from 'lucide-react';

interface IELTSSpeakingTestProps {
  userLevel: number;
}

const IELTSSpeakingTest = ({ userLevel }: IELTSSpeakingTestProps) => {
  const [currentPart, setCurrentPart] = useState<1 | 2 | 3>(1);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<any>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimedTest, setIsTimedTest] = useState(false);

  // Part 1: Introduction and Interview (4-5 minutes)
  const part1Questions = [
    "Could you tell me your full name, please?",
    "What shall I call you?",
    "Where are you from?",
    "Do you work or are you a student?",
    "What do you like about your hometown?",
    "Do you enjoy cooking? Why or why not?",
    "How often do you use public transport?",
    "What's your favorite season and why?",
    "Do you prefer to stay at home or go out in the evening?",
    "What kind of music do you like?",
    "Do you think it's important to learn about other cultures?",
    "How do you usually spend your weekends?"
  ];

  // Part 2: Long Turn (3-4 minutes including 1 minute preparation)
  const part2Topics = [
    {
      title: "Describe a memorable journey you have taken",
      points: [
        "Where you went",
        "Who you went with",
        "What you did there",
        "And explain why it was memorable"
      ]
    },
    {
      title: "Describe a book that influenced you",
      points: [
        "What the book was about",
        "When you read it",
        "Why you chose to read it",
        "And explain how it influenced you"
      ]
    },
    {
      title: "Describe a skill you would like to learn",
      points: [
        "What the skill is",
        "Why you want to learn it",
        "How you would learn it",
        "And explain how this skill would benefit you"
      ]
    },
    {
      title: "Describe a person who has been important in your life",
      points: [
        "Who this person is",
        "How you know them",
        "What they have done for you",
        "And explain why they are important to you"
      ]
    }
  ];

  // Part 3: Discussion (4-5 minutes)
  const part3Questions = [
    "How do you think travel has changed compared to the past?",
    "What are the advantages and disadvantages of different forms of transport?",
    "Do you think people travel too much these days?",
    "How might travel change in the future?",
    "What role do books play in education today?",
    "How has technology changed the way people read?",
    "Do you think physical books will disappear in the future?",
    "What skills do you think are most important for young people to learn?",
    "How has the way people learn skills changed over time?",
    "What role should governments play in education and skill development?",
    "How important are family relationships in modern society?",
    "Do you think social media has changed how people form relationships?"
  ];

  const getCurrentQuestions = () => {
    switch (currentPart) {
      case 1: return part1Questions;
      case 2: return [part2Topics[Math.floor(Math.random() * part2Topics.length)].title];
      case 3: return part3Questions;
      default: return [];
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    
    if (isTimedTest) {
      // Set timer based on part
      const duration = currentPart === 2 ? 120 : currentPart === 1 ? 30 : 60;
      setTimeLeft(duration);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsProcessing(true);
    
    // Simulate speech processing
    setTimeout(() => {
      const mockResponse = "Thank you for your response. That was very well articulated.";
      setResponses([...responses, mockResponse]);
      setIsProcessing(false);
      
      // Move to next question or part
      const questions = getCurrentQuestions();
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else if (currentPart < 3) {
        setCurrentPart((currentPart + 1) as 1 | 2 | 3);
        setCurrentQuestion(0);
      } else {
        // Test completed, show feedback
        generateFeedback();
      }
    }, 2000);
  };

  const generateFeedback = () => {
    const mockFeedback = {
      overall: 7.5,
      fluency: 7,
      lexical: 8,
      grammar: 7,
      pronunciation: 8,
      detailed: {
        strengths: [
          "Good use of varied vocabulary",
          "Natural flow of speech",
          "Clear pronunciation",
          "Appropriate use of linking words",
          "Good range of grammatical structures"
        ],
        improvements: [
          "Work on complex grammatical structures",
          "Extend responses with more details and examples",
          "Use more sophisticated vocabulary in formal contexts",
          "Practice stress and intonation patterns"
        ]
      }
    };
    setFeedback(mockFeedback);
  };

  const startTest = (timed: boolean = false) => {
    setTestStarted(true);
    setIsTimedTest(timed);
    setCurrentPart(1);
    setCurrentQuestion(0);
    setResponses([]);
    setFeedback(null);
  };

  const resetTest = () => {
    setTestStarted(false);
    setCurrentPart(1);
    setCurrentQuestion(0);
    setResponses([]);
    setFeedback(null);
    setIsRecording(false);
    setIsProcessing(false);
    setIsTimedTest(false);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && timeLeft > 0 && isTimedTest) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRecording && isTimedTest) {
      stopRecording();
    }
    return () => clearInterval(interval);
  }, [isRecording, timeLeft, isTimedTest]);

  if (!testStarted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>IELTS Speaking Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold">Ready to start your IELTS Speaking Test?</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              This test consists of 3 parts and takes approximately 11-14 minutes. 
              You'll be assessed on fluency, vocabulary, grammar, and pronunciation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium">Part 1</h4>
              <p className="text-sm text-gray-600">Introduction & Interview</p>
              <p className="text-xs text-gray-500">4-5 minutes</p>
              <p className="text-xs text-gray-500">Personal questions</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium">Part 2</h4>
              <p className="text-sm text-gray-600">Long Turn</p>
              <p className="text-xs text-gray-500">3-4 minutes</p>
              <p className="text-xs text-gray-500">1 min prep + 2 min talk</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium">Part 3</h4>
              <p className="text-sm text-gray-600">Discussion</p>
              <p className="text-xs text-gray-500">4-5 minutes</p>
              <p className="text-xs text-gray-500">Abstract topics</p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => startTest(false)} size="lg" variant="outline">
                Practice Mode
              </Button>
              <Button onClick={() => startTest(true)} size="lg">
                <Timer className="h-4 w-4 mr-2" />
                Timed Test
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Practice mode: Take your time • Timed test: Authentic IELTS timing
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (feedback) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {feedback.overall}/9
            </div>
            <p className="text-gray-600">Overall Band Score</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Fluency & Coherence", score: feedback.fluency },
              { label: "Lexical Resource", score: feedback.lexical },
              { label: "Grammatical Range", score: feedback.grammar },
              { label: "Pronunciation", score: feedback.pronunciation }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{item.label}</span>
                  <Badge>{item.score}/9</Badge>
                </div>
                <Progress value={(item.score / 9) * 100} className="h-2" />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
              <ul className="space-y-1">
                {feedback.detailed.strengths.map((strength: string, index: number) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-orange-600 mb-2">Areas for Improvement</h4>
              <ul className="space-y-1">
                {feedback.detailed.improvements.map((improvement: string, index: number) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center space-x-2">
            <Button onClick={resetTest}>Take Another Test</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const questions = getCurrentQuestions();
  const currentQuestionText = questions[currentQuestion];
  const currentTopic = currentPart === 2 ? part2Topics.find(topic => topic.title === currentQuestionText) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="h-[500px] flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-2">
                <span>Part {currentPart} - IELTS Speaking Test</span>
                {isTimedTest && (
                  <Badge variant="outline">
                    <Timer className="h-3 w-3 mr-1" />
                    Timed
                  </Badge>
                )}
              </CardTitle>
              <Badge variant="outline">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 space-y-6">
              {/* Current Question */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  {currentPart === 1 && "Examiner asks:"}
                  {currentPart === 2 && "Describe:"}
                  {currentPart === 3 && "Let's discuss:"}
                </h4>
                <p className="text-blue-800">{currentQuestionText}</p>
                
                {currentPart === 2 && currentTopic && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-blue-900 mb-2">You should say:</p>
                    <ul className="text-sm space-y-1">
                      {currentTopic.points.map((point, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                    {isTimedTest && (
                      <p className="text-xs text-blue-700 mt-2 font-medium">
                        You have 1 minute to prepare, then speak for 1-2 minutes.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Recording Interface */}
              <div className="text-center space-y-4">
                {!isRecording && !isProcessing && (
                  <div className="space-y-4">
                    <Button
                      size="lg"
                      onClick={startRecording}
                      className="w-24 h-24 rounded-full bg-red-500 hover:bg-red-600"
                    >
                      <Mic className="h-8 w-8" />
                    </Button>
                    <p className="text-sm text-gray-600">Click to start speaking</p>
                    {isTimedTest && (
                      <p className="text-xs text-gray-500">
                        Part {currentPart} timing: {currentPart === 1 ? "30 seconds" : currentPart === 2 ? "2 minutes" : "1 minute"} per response
                      </p>
                    )}
                  </div>
                )}

                {isRecording && (
                  <div className="space-y-4">
                    <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center animate-pulse mx-auto">
                      <Square className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      {isTimedTest && (
                        <div className="flex items-center justify-center space-x-2 text-red-600">
                          <Clock className="h-4 w-4" />
                          <span className="font-mono">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                        </div>
                      )}
                      <p className="text-sm text-gray-600 mt-2">Recording... Click to stop</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={stopRecording}
                    >
                      Stop Recording
                    </Button>
                  </div>
                )}

                {isProcessing && (
                  <div className="space-y-4">
                    <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center mx-auto">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                    <p className="text-blue-600 font-medium">Processing your response...</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Progress */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Test Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Part</span>
                <Badge>{currentPart} of 3</Badge>
              </div>
              <Progress value={(currentPart / 3) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Questions in Part {currentPart}</span>
                <Badge variant="outline">{currentQuestion + 1} of {questions.length}</Badge>
              </div>
              <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {responses.length}
              </div>
              <p className="text-sm text-gray-600">Responses Given</p>
            </div>

            {isTimedTest && (
              <div className="text-center p-2 bg-yellow-50 rounded">
                <p className="text-xs text-yellow-700 font-medium">TIMED TEST MODE</p>
                <p className="text-xs text-yellow-600">Authentic IELTS timing applied</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Test Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className={`p-2 rounded ${currentPart === 1 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                <p className="font-medium">Part 1: Introduction</p>
                <p className="text-gray-600">Personal questions about familiar topics</p>
                <p className="text-xs text-gray-500">12 questions, 30 seconds each (timed)</p>
              </div>
              <div className={`p-2 rounded ${currentPart === 2 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                <p className="font-medium">Part 2: Long Turn</p>
                <p className="text-gray-600">2-minute individual presentation</p>
                <p className="text-xs text-gray-500">1 min prep + 2 min talk (timed)</p>
              </div>
              <div className={`p-2 rounded ${currentPart === 3 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                <p className="font-medium">Part 3: Discussion</p>
                <p className="text-gray-600">Abstract discussion related to Part 2</p>
                <p className="text-xs text-gray-500">12 questions, 1 minute each (timed)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IELTSSpeakingTest;
