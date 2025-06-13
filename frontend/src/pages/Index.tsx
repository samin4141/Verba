
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Book, Headphones, Mic, Pen, Trophy, Sparkles, Target, Clock, Award } from "lucide-react";
import AssessmentModal from "@/components/AssessmentModal";
import ReadingSection from "@/components/sections/ReadingSection";
import ListeningSection from "@/components/sections/ListeningSection";
import SpeakingSection from "@/components/sections/SpeakingSection";
import WritingSection from "@/components/sections/WritingSection";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [currentSection, setCurrentSection] = useState<string>('dashboard');
  const [userLevel, setUserLevel] = useState<number | null>(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [userStats, setUserStats] = useState({
    streak: 7,
    totalPoints: 1250,
    reading: 18,
    listening: 22,
    speaking: 15,
    writing: 16
  });

  const { user } = useAuth();

  const sections = [
    { id: 'reading', name: 'Reading', icon: Book, color: 'from-blue-500 to-blue-600', bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20', borderColor: 'border-blue-200 dark:border-blue-700' },
    { id: 'listening', name: 'Listening', icon: Headphones, color: 'from-green-500 to-green-600', bgColor: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20', borderColor: 'border-green-200 dark:border-green-700' },
    { id: 'speaking', name: 'Speaking', icon: Mic, color: 'from-red-500 to-red-600', bgColor: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20', borderColor: 'border-red-200 dark:border-red-700' },
    { id: 'writing', name: 'Writing', icon: Pen, color: 'from-purple-500 to-purple-600', bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20', borderColor: 'border-purple-200 dark:border-purple-700' }
  ];

  const handleAssessmentComplete = (level: number) => {
    setUserLevel(level);
    setShowAssessment(false);
  };

  const goBackToDashboard = () => {
    setCurrentSection('dashboard');
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'reading':
        return <ReadingSection userLevel={userLevel || 15} onBack={goBackToDashboard} />;
      case 'listening':
        return <ListeningSection userLevel={userLevel || 15} onBack={goBackToDashboard} />;
      case 'speaking':
        return <SpeakingSection userLevel={userLevel || 15} onBack={goBackToDashboard} />;
      case 'writing':
        return <WritingSection userLevel={userLevel || 15} onBack={goBackToDashboard} />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Learning</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Master English with Verba
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Transform your English skills with personalized AI-driven lessons designed for IELTS success
          </p>
          
          {!userLevel && (
            <Button 
              onClick={() => setShowAssessment(true)}
              size="lg"
              className="bg-white text-purple-600 hover:bg-blue-50 hover:text-purple-700 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Target className="h-5 w-5 mr-2" />
              Start Your Assessment
            </Button>
          )}
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-300/20 to-transparent rounded-full blur-2xl"></div>
      </div>

      {/* User Stats */}
      {userLevel && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-200/50 to-transparent rounded-full blur-xl"></div>
            <CardHeader className="text-center relative z-10">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center mb-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-orange-600 dark:text-orange-400">{userStats.streak}</CardTitle>
              <CardDescription className="font-medium text-orange-700 dark:text-orange-300">Day Streak</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-200/50 to-transparent rounded-full blur-xl"></div>
            <CardHeader className="text-center relative z-10">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center mb-3">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{userStats.totalPoints}</CardTitle>
              <CardDescription className="font-medium text-emerald-700 dark:text-emerald-300">Total Points</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200/50 to-transparent rounded-full blur-xl"></div>
            <CardHeader className="text-center relative z-10">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mb-3">
                <Target className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-blue-600 dark:text-blue-400">{userLevel}/30</CardTitle>
              <CardDescription className="font-medium text-blue-700 dark:text-blue-300">Overall Level</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-200/50 to-transparent rounded-full blur-xl"></div>
            <CardHeader className="text-center relative z-10">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mb-3">
                <Award className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">12</CardTitle>
              <CardDescription className="font-medium text-yellow-700 dark:text-yellow-300">Achievements</CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Skills Progress */}
      {userLevel && (
        <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Trophy className="h-6 w-6 mr-3 text-yellow-500" />
              Your English Skills
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Track your progress across all four language skills
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {sections.map((section) => {
              const score = userStats[section.id as keyof typeof userStats] as number;
              const percentage = (score / 30) * 100;
              return (
                <div key={section.id} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg`}>
                        <section.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">{section.name}</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Level {score}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold">
                      {score}/30
                    </Badge>
                  </div>
                  <div className="relative">
                    <Progress value={percentage} className="h-3 bg-gray-200 dark:bg-gray-700" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Choose Your Practice Area</h2>
          <p className="text-gray-600 dark:text-gray-300">Select a skill to start your personalized learning journey</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section) => (
            <Card 
              key={section.id}
              className={`group cursor-pointer border-2 ${section.borderColor} ${section.bgColor} hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 overflow-hidden relative`}
              onClick={() => setCurrentSection(section.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-8 text-center relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  <section.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{section.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Master {section.name.toLowerCase()} skills with AI guidance</p>
                <div className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                  Start Practice
                  <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    return user?.email?.split('@')[0] || 'there';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div 
                className="flex items-center space-x-2 cursor-pointer group"
                onClick={goBackToDashboard}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Verba
                </h1>
              </div>
              {userLevel && (
                <Badge variant="outline" className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                  Level {userLevel}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-2">
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    variant={currentSection === section.id ? "default" : "ghost"}
                    onClick={() => setCurrentSection(section.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      currentSection === section.id 
                        ? `bg-gradient-to-r ${section.color} text-white shadow-lg` 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <section.icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{section.name}</span>
                  </Button>
                ))}
              </nav>
              
              <UserProfileDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentSection === 'dashboard' && (
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {getDisplayName()}! 👋
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Ready to continue your English mastery journey?
            </p>
          </div>
        )}
        {renderCurrentSection()}
      </main>

      {/* Assessment Modal */}
      <AssessmentModal 
        open={showAssessment} 
        onClose={() => setShowAssessment(false)}
        onComplete={handleAssessmentComplete}
      />
    </div>
  );
};

export default Index;
