
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Headphones, Play, Pause, Volume2, ArrowLeft, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ListeningSectionProps {
  userLevel: number;
}

const ListeningSection = ({ userLevel }: ListeningSectionProps) => {
  const [currentMode, setCurrentMode] = useState<'practice' | 'test'>('practice');
  const [isPlaying, setIsPlaying] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  // Sample audio content based on user level
  const getAudioContent = () => {
    if (userLevel < 10) {
      return {
        title: "Daily Conversations",
        description: "Listen to everyday conversations and answer questions",
        duration: "8:30",
        difficulty: "Beginner",
        transcript: "Sarah: Hello, my name is Sarah. I work at a local bookstore downtown. Every morning at 9 AM, I help customers find books they want to read. I really enjoy talking to people about their favorite stories and recommending new authors. Our bookstore has been in business for over 20 years. We specialize in fiction, but we also have sections for cooking, travel, and children's books. On weekends, we host reading groups where people discuss the books they've read during the week..."
      };
    } else if (userLevel < 20) {
      return {
        title: "Academic Lecture: Psychology",
        description: "University lecture on cognitive psychology",
        duration: "12:45",
        difficulty: "Intermediate",
        transcript: "Professor: Today we'll explore the fascinating world of memory formation and cognitive psychology. Recent neuroscientific research has revealed that our brains don't simply record experiences like a video camera. Instead, memory is a complex, reconstructive process. When we recall an event, we're not just retrieving a stored file; we're actively rebuilding the memory using various neural networks. This process can be influenced by our current emotional state, subsequent experiences, and even social factors..."
      };
    } else {
      return {
        title: "BBC News Report: Global Economics",
        description: "Current affairs and international economic developments",
        duration: "15:20",
        difficulty: "Advanced",
        transcript: "News Anchor: The implications of artificial intelligence on global economics continue to generate intense debate among policymakers and economists worldwide. Leading financial experts argue that while AI presents unprecedented opportunities for productivity gains and economic growth, it also poses significant challenges to traditional employment structures. The International Monetary Fund released a comprehensive report this week highlighting the need for coordinated international policies to address the economic disruption caused by rapid AI adoption across various industries..."
      };
    }
  };

  const audioContent = getAudioContent();

  // IELTS Listening has 40 questions across 4 sections, so 10 questions per section
  const questions = [
    {
      question: "What is the speaker's main occupation?",
      type: "multiple-choice" as const,
      options: ["Teacher", "Bookstore worker", "Librarian", "Writer"]
    },
    {
      question: "What time does the speaker start work?",
      type: "multiple-choice" as const,
      options: ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"]
    },
    {
      question: "How long has the business been operating?",
      type: "short-answer" as const
    },
    {
      question: "The speaker mentions three types of book sections. Name them:",
      type: "short-answer" as const
    },
    {
      question: "When do reading groups meet?",
      type: "multiple-choice" as const,
      options: ["Weekdays", "Weekends", "Every day", "Once a month"]
    },
    {
      question: "Complete the sentence: Memory formation is a _______ process.",
      type: "fill-blank" as const
    },
    {
      question: "According to the lecture, what influences memory recall?",
      type: "multiple-choice" as const,
      options: ["Only current emotions", "Neural networks and emotions", "Just past experiences", "Social media"]
    },
    {
      question: "The brain's memory system is compared to:",
      type: "multiple-choice" as const,
      options: ["A video camera", "A computer", "A library", "A telephone"]
    },
    {
      question: "Which organization released the economic report?",
      type: "short-answer" as const
    },
    {
      question: "AI is said to present both _______ and _______.",
      type: "fill-blank" as const
    }
  ];

  const recommendedContent = [
    {
      title: "TED Talks",
      description: `Curated content for level ${userLevel}`,
      topics: ["Technology", "Science", "Society", "Innovation"],
      difficulty: audioContent.difficulty
    },
    {
      title: "BBC News",
      description: `Curated content for level ${userLevel}`,
      topics: ["World News", "Politics", "Economics", "Culture"],
      difficulty: audioContent.difficulty
    },
    {
      title: "Academic Lectures",
      description: `Curated content for level ${userLevel}`,
      topics: ["Psychology", "History", "Literature", "Science"],
      difficulty: audioContent.difficulty
    }
  ];

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const goBack = () => {
    setCurrentMode('practice');
    setAnswers({});
    setShowResults(false);
    setIsPlaying(false);
  };

  const calculateScore = () => {
    // Simple scoring - in real implementation would check correct answers
    const answeredQuestions = Object.keys(answers).length;
    return Math.round((answeredQuestions / questions.length) * 85); // Mock score
  };

  const handleContentClick = (contentType: string) => {
    // This will be implemented later when videos are added
    console.log(`Opening ${contentType} content page`);
    // For now, just show an alert
    alert(`${contentType} videos will be available soon!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Listening Section</h2>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={currentMode === 'practice' ? 'default' : 'outline'}
            onClick={() => setCurrentMode('practice')}
          >
            Practice
          </Button>
          <Button 
            variant={currentMode === 'test' ? 'default' : 'outline'}
            onClick={() => setCurrentMode('test')}
          >
            IELTS Test
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audio Player */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <Headphones className="h-5 w-5" />
                  <span>{audioContent.title}</span>
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {audioContent.description}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="secondary">{audioContent.difficulty}</Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{audioContent.duration}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Audio Controls */}
            <div className="flex items-center justify-center space-x-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlayback}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <div className="flex-1 bg-gray-300 dark:bg-gray-600 h-2 rounded-full">
                <div className="bg-blue-500 h-2 rounded-full w-1/3"></div>
              </div>
              <Volume2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>

            {/* Simulated Audio Transcript (for demo) */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Audio Transcript (Demo):</strong> {audioContent.transcript}
              </p>
            </div>

            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              <p>🎧 Use headphones for the best experience</p>
              <p>You can replay the audio up to 2 times in the actual test</p>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Questions 1-{questions.length}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 max-h-[600px] overflow-y-auto">
            {questions.map((question, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`answer-${index}`} className="font-medium text-gray-900 dark:text-white">
                  {index + 1}. {question.question}
                </Label>
                
                {question.type === 'multiple-choice' ? (
                  <RadioGroup 
                    value={answers[index] || ""} 
                    onValueChange={(value) => handleAnswerChange(index, value)}
                  >
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={option} 
                          id={`q${index}-${optionIndex}`} 
                        />
                        <Label 
                          htmlFor={`q${index}-${optionIndex}`}
                          className="cursor-pointer text-sm text-gray-700 dark:text-gray-200"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <Input
                    id={`answer-${index}`}
                    placeholder="Type your answer here..."
                    value={answers[index] || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    className="text-gray-900 dark:text-white dark:bg-gray-800"
                  />
                )}
              </div>
            ))}

            {!showResults ? (
              <Button 
                onClick={handleSubmit}
                className="w-full"
                disabled={Object.keys(answers).length !== questions.length}
              >
                Submit Answers
              </Button>
            ) : (
              <div className="space-y-4">
                <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {calculateScore()}%
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {calculateScore() >= 70 ? "Excellent listening skills!" : "Keep practicing to improve!"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Button 
                  onClick={() => {
                    setShowResults(false);
                    setAnswers({});
                    setIsPlaying(false);
                  }}
                  className="w-full"
                >
                  Try Another Audio
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Featured Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Recommended for Your Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedContent.map((content, index) => (
              <div 
                key={index} 
                className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer dark:border-gray-700 dark:hover:bg-gray-800"
                onClick={() => handleContentClick(content.title)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{content.title}</h4>
                  <ExternalLink className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {content.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {content.topics.map((topic, topicIndex) => (
                    <Badge key={topicIndex} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
                <Badge variant="outline" className="mt-2">
                  {content.difficulty}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListeningSection;
