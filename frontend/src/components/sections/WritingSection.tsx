
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Pen, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WritingSectionProps {
  userLevel: number;
}

const WritingSection = ({ userLevel }: WritingSectionProps) => {
  const [currentMode, setCurrentMode] = useState<'practice' | 'test'>('practice');
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
  const [essay, setEssay] = useState("");
  const [realTimeFeedback, setRealTimeFeedback] = useState<any>(null);
  const [finalFeedback, setFinalFeedback] = useState<any>(null);
  const [wordCount, setWordCount] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (essay.length > 0) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [essay]);

  // Real-time analysis
  useEffect(() => {
    const words = essay.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);

    if (words.length > 20) {
      // Simulate real-time AI feedback
      setRealTimeFeedback({
        grammarScore: 85,
        vocabularyScore: 78,
        coherenceScore: 82,
        suggestions: [
          "Consider using more transitional phrases",
          "Good use of complex sentence structures",
          "Vary your vocabulary more"
        ]
      });
    }
  }, [essay]);

  const getPracticePrompts = () => {
    if (userLevel < 10) {
      return [
        {
          title: "Describe Your Best Friend",
          prompt: "Write about your best friend. Describe what they look like, what you like to do together, and why they are special to you. Write at least 150 words.",
          targetWords: 150,
          difficulty: "Beginner"
        },
        {
          title: "My Favorite Season",
          prompt: "Write about your favorite season of the year. Explain why you like it, what activities you do during this season, and how it makes you feel. Write at least 150 words.",
          targetWords: 150,
          difficulty: "Beginner"
        },
        {
          title: "A Day in My Life",
          prompt: "Describe a typical day in your life from morning to evening. Include what you do, where you go, and who you spend time with. Write at least 150 words.",
          targetWords: 150,
          difficulty: "Beginner"
        }
      ];
    } else if (userLevel < 20) {
      return [
        {
          title: "Technology in Education",
          prompt: "Some people believe that technology has made education better, while others think it has made it worse. Discuss both views and give your own opinion. Write at least 250 words.",
          targetWords: 250,
          difficulty: "Intermediate"
        },
        {
          title: "Working from Home",
          prompt: "More and more people are working from home instead of going to an office. What are the advantages and disadvantages of this trend? Give your opinion and support it with examples. Write at least 250 words.",
          targetWords: 250,
          difficulty: "Intermediate"
        },
        {
          title: "Social Media Impact",
          prompt: "Social media has changed the way people communicate and share information. Do you think this has been a positive or negative development? Discuss both sides and give your opinion. Write at least 250 words.",
          targetWords: 250,
          difficulty: "Intermediate"
        }
      ];
    } else {
      return [
        {
          title: "Environmental Conservation",
          prompt: "Climate change is one of the most pressing issues of our time. Analyze the role of individual responsibility versus government action in addressing environmental challenges. Support your argument with specific examples and evidence. Write at least 300 words.",
          targetWords: 300,
          difficulty: "Advanced"
        },
        {
          title: "Globalization Effects",
          prompt: "Globalization has brought both benefits and challenges to modern society. Critically evaluate the economic, cultural, and social impacts of globalization on developing countries. Use specific examples to support your analysis. Write at least 300 words.",
          targetWords: 300,
          difficulty: "Advanced"
        },
        {
          title: "Artificial Intelligence Ethics",
          prompt: "As artificial intelligence becomes more prevalent in society, ethical concerns about its use are growing. Analyze the potential benefits and risks of AI development, and propose guidelines for its responsible implementation. Write at least 300 words.",
          targetWords: 300,
          difficulty: "Advanced"
        }
      ];
    }
  };

  const getIELTSQuestions = () => {
    return [
      {
        title: "IELTS Task 2: Work-Life Balance",
        prompt: "In many countries, people are working longer hours and have less leisure time. What are the causes of this problem? What measures can be taken to solve it? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        targetWords: 250,
        difficulty: "IELTS Academic"
      },
      {
        title: "IELTS Task 2: Education and Technology",
        prompt: "Some people think that children should start learning a foreign language at primary school, while others believe that children should begin in secondary school. Discuss both these views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        targetWords: 250,
        difficulty: "IELTS Academic"
      },
      {
        title: "IELTS Task 2: Environmental Issues",
        prompt: "Some people believe that environmental problems are too big for individual countries and individuals to address. They argue that only international cooperation can solve these problems. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        targetWords: 250,
        difficulty: "IELTS Academic"
      },
      {
        title: "IELTS Task 2: Transportation",
        prompt: "In some cities, there are few controls on the design and construction of homes and other buildings, and owners can decide on the style of their houses. Do the advantages of this outweigh the disadvantages? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        targetWords: 250,
        difficulty: "IELTS Academic"
      },
      {
        title: "IELTS Task 2: Media and Society",
        prompt: "Some people think that the news media nowadays have become much more influential in people's lives, while others believe it is not the case. Discuss both these views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        targetWords: 250,
        difficulty: "IELTS Academic"
      },
      {
        title: "IELTS Task 2: Health and Lifestyle",
        prompt: "Prevention is better than cure. Researching and treating diseases is too costly so it would be better to invest in preventative measures. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        targetWords: 250,
        difficulty: "IELTS Academic"
      },
      {
        title: "IELTS Task 2: Urban Development",
        prompt: "As cities continue to grow, more and more people live in urban areas rather than rural areas. What are the causes of this trend? Do you think this is a positive or negative development? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        targetWords: 250,
        difficulty: "IELTS Academic"
      },
      {
        title: "IELTS Task 2: Cultural Traditions",
        prompt: "Some people believe that it is important to preserve cultural traditions, while others think that these traditions prevent progress and should be abandoned. Discuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        targetWords: 250,
        difficulty: "IELTS Academic"
      }
    ];
  };

  const practicePrompts = getPracticePrompts();
  const ieltsQuestions = getIELTSQuestions();
  const availableQuestions = currentMode === 'practice' ? practicePrompts : ieltsQuestions;
  const currentPrompt = selectedQuestionIndex !== null ? availableQuestions[selectedQuestionIndex] : null;

  const handleSubmit = () => {
    setFinalFeedback({
      overall: 84,
      taskResponse: 82,
      coherence: 86,
      vocabulary: 80,
      grammar: 88,
      suggestions: [
        "Excellent organization and structure",
        "Strong use of examples to support arguments",
        "Consider expanding on counterarguments",
        "Good command of complex grammar structures"
      ],
      strengths: [
        "Clear thesis statement",
        "Logical paragraph structure",
        "Effective conclusion"
      ],
      improvements: [
        "Use more sophisticated vocabulary",
        "Add more specific examples",
        "Improve sentence variety"
      ]
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const goBack = () => {
    setCurrentMode('practice');
    setSelectedQuestionIndex(null);
    setEssay("");
    setFinalFeedback(null);
    setRealTimeFeedback(null);
    setWordCount(0);
    setTimeSpent(0);
  };

  const handleStartWriting = () => {
    if (selectedQuestionIndex !== null) {
      setEssay("");
      setFinalFeedback(null);
      setRealTimeFeedback(null);
      setWordCount(0);
      setTimeSpent(0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Writing Section</h2>
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

      {/* Question Selection */}
      {selectedQuestionIndex === null && (
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Select a {currentMode === 'practice' ? 'Practice' : 'IELTS'} Question
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={(value) => setSelectedQuestionIndex(parseInt(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a writing topic..." />
              </SelectTrigger>
              <SelectContent>
                {availableQuestions.map((question, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {question.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {availableQuestions.map((question, index) => (
                <Card 
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-shadow dark:border-gray-700 dark:hover:bg-gray-800"
                  onClick={() => setSelectedQuestionIndex(index)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{question.title}</h4>
                      <Badge variant="secondary">{question.difficulty}</Badge>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                        {question.prompt.substring(0, 100)}...
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Target: {question.targetWords} words
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Writing Interface */}
      {selectedQuestionIndex !== null && currentPrompt && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Prompt */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                      <Pen className="h-5 w-5" />
                      <span>{currentPrompt.title}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="secondary">{currentPrompt.difficulty}</Badge>
                      <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(timeSpent)}</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedQuestionIndex(null)}
                    className="text-gray-700 dark:text-gray-200"
                  >
                    Choose Different Topic
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{currentPrompt.prompt}</p>
                {currentMode === 'test' && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>IELTS Writing Task 2 Instructions:</strong> You should spend about 40 minutes on this task. 
                      Write at least 250 words. Your response will be evaluated on task achievement, coherence and cohesion, 
                      lexical resource, and grammatical range and accuracy.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Writing Area */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-gray-900 dark:text-white">Your Essay</CardTitle>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {wordCount}/{currentPrompt.targetWords} words
                    </span>
                    <Progress 
                      value={(wordCount / currentPrompt.targetWords) * 100} 
                      className="w-24 h-2"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Start writing your essay here..."
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  className="min-h-[400px] text-base leading-relaxed text-gray-900 dark:text-white dark:bg-gray-800"
                />
                
                {!finalFeedback && (
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      💡 Real-time feedback appears as you write
                    </div>
                    <Button 
                      onClick={handleSubmit}
                      disabled={wordCount < currentPrompt.targetWords * 0.8}
                    >
                      Submit for Review
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Feedback Panel */}
          <div className="space-y-4">
            {/* Real-time Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">Real-time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {!realTimeFeedback ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Pen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Start writing to see live feedback!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {[
                        { label: "Grammar", score: realTimeFeedback.grammarScore },
                        { label: "Vocabulary", score: realTimeFeedback.vocabularyScore },
                        { label: "Coherence", score: realTimeFeedback.coherenceScore }
                      ].map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-700 dark:text-gray-200">{item.label}</span>
                            <span className="text-gray-700 dark:text-gray-200">{item.score}%</span>
                          </div>
                          <Progress value={item.score} className="h-1" />
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white">Live Suggestions:</h4>
                      {realTimeFeedback.suggestions.map((suggestion: string, index: number) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                          <p className="text-xs text-gray-700 dark:text-gray-300">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Final Feedback */}
            {finalFeedback && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-white">Final Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {finalFeedback.overall}/100
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Overall Score</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Task Response", score: finalFeedback.taskResponse },
                      { label: "Coherence", score: finalFeedback.coherence },
                      { label: "Vocabulary", score: finalFeedback.vocabulary },
                      { label: "Grammar", score: finalFeedback.grammar }
                    ].map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-200">{item.label}</span>
                          <span className="text-gray-700 dark:text-gray-200">{item.score}/100</span>
                        </div>
                        <Progress value={item.score} className="h-1" />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-green-700 dark:text-green-300">Strengths:</h4>
                      {finalFeedback.strengths.map((strength: string, index: number) => (
                        <p key={index} className="text-xs text-green-600 dark:text-green-400 ml-2">• {strength}</p>
                      ))}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-orange-700 dark:text-orange-300">Areas for Improvement:</h4>
                      {finalFeedback.improvements.map((improvement: string, index: number) => (
                        <p key={index} className="text-xs text-orange-600 dark:text-orange-400 ml-2">• {improvement}</p>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => {
                      setSelectedQuestionIndex(null);
                      setEssay("");
                      setFinalFeedback(null);
                      setRealTimeFeedback(null);
                      setWordCount(0);
                      setTimeSpent(0);
                    }}
                    className="w-full"
                  >
                    Try Another Topic
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingSection;
