
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface AssessmentModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (level: number) => void;
}

const AssessmentModal = ({ open, onClose, onComplete }: AssessmentModalProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const questions = [
    {
      question: "What is the past tense of 'go'?",
      options: ["goed", "went", "gone", "going"],
      correct: "went"
    },
    {
      question: "Choose the correct sentence:",
      options: [
        "I have been living here since 5 years",
        "I have been living here for 5 years",
        "I am living here since 5 years",
        "I live here since 5 years"
      ],
      correct: "I have been living here for 5 years"
    },
    {
      question: "What does 'ubiquitous' mean?",
      options: [
        "Very rare",
        "Present everywhere",
        "Extremely old",
        "Difficult to understand"
      ],
      correct: "Present everywhere"
    },
    {
      question: "Choose the correct form: 'If I _____ rich, I would travel the world.'",
      options: ["am", "was", "were", "will be"],
      correct: "were"
    },
    {
      question: "What is a synonym for 'meticulous'?",
      options: ["Careless", "Detailed", "Quick", "Loud"],
      correct: "Detailed"
    }
  ];

  const handleNext = () => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate level based on correct answers
      const correctAnswers = newAnswers.filter((answer, index) => 
        answer === questions[index].correct
      ).length;
      
      const level = Math.round((correctAnswers / questions.length) * 30);
      onComplete(Math.max(5, level)); // Minimum level of 5
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>English Level Assessment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {questions[currentQuestion].question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={handleNext}
              disabled={!selectedAnswer}
            >
              {currentQuestion < questions.length - 1 ? "Next Question" : "Complete Assessment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentModal;
