
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AIChatbot from "@/components/AIChatbot";
import IELTSSpeakingTest from "@/components/IELTSSpeakingTest";

interface SpeakingSectionProps {
  userLevel: number;
}

const SpeakingSection = ({ userLevel }: SpeakingSectionProps) => {
  const [currentMode, setCurrentMode] = useState<'conversation' | 'ielts'>('conversation');

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-3xl font-bold">Speaking Section</h2>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={currentMode === 'conversation' ? 'default' : 'outline'}
            onClick={() => setCurrentMode('conversation')}
          >
            General Conversation
          </Button>
          <Button 
            variant={currentMode === 'ielts' ? 'default' : 'outline'}
            onClick={() => setCurrentMode('ielts')}
          >
            IELTS Speaking Test
          </Button>
        </div>
      </div>

      {currentMode === 'conversation' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Conversation Partner</CardTitle>
              <p className="text-gray-600">
                Have natural conversations with our AI and get instant feedback on your speaking skills.
              </p>
            </CardHeader>
          </Card>
          <AIChatbot userLevel={userLevel} />
        </div>
      )}

      {currentMode === 'ielts' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>IELTS Speaking Test</CardTitle>
              <p className="text-gray-600">
                Take a mock IELTS speaking test with structured parts and get detailed feedback and scoring.
              </p>
            </CardHeader>
          </Card>
          <IELTSSpeakingTest userLevel={userLevel} />
        </div>
      )}
    </div>
  );
};

export default SpeakingSection;
