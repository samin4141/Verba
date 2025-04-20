import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Mic, MicOff, Clock, AlertCircle } from 'lucide-react-native';
import { SpeakingTest } from '@/components/SpeakingTest';
import { Button } from '@/components/Button';
import { useSpeakingStore } from '@/store/speaking-store';
import colors from '@/constants/colors';

export default function SpeakingDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { 
    prompts,
    addAttempt,
    updateFeedback,
    progress,
  } = useSpeakingStore();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const prompt = prompts.find(p => p.id === id);
  
  if (!prompt) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Prompt not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const promptProgress = progress[prompt.id] || { attempts: [], bestScore: null };
  
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    // In a real app, this would start actual audio recording
  };
  
  const handleStopRecording = () => {
    setIsRecording(false);
    setHasRecorded(true);
    
    // Add the attempt to the store
    const attempt = {
      promptId: prompt.id,
      date: new Date().toISOString(),
      duration: recordingTime,
    };
    
    addAttempt(attempt);
    
    // In a real app, this would stop actual audio recording
  };
  
  const handleSubmitForFeedback = () => {
    setIsSubmitting(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      // Generate mock feedback
      const mockFeedback = {
        pronunciation: Math.floor(Math.random() * 3) + 3, // 3-5
        grammar: Math.floor(Math.random() * 3) + 2, // 2-4
        vocabulary: Math.floor(Math.random() * 3) + 2, // 2-4
        fluency: Math.floor(Math.random() * 3) + 2, // 2-4
        overall: 0, // Will be calculated
        comments: generateFeedbackComment(),
      };
      
      // Calculate overall score
      mockFeedback.overall = (
        mockFeedback.pronunciation + 
        mockFeedback.grammar + 
        mockFeedback.vocabulary + 
        mockFeedback.fluency
      ) / 4;
      
      setFeedback(mockFeedback);
      
      // Update the feedback in the store
      const attempts = promptProgress.attempts;
      if (attempts.length > 0) {
        const latestAttempt = attempts[attempts.length - 1];
        updateFeedback(prompt.id, latestAttempt.date, mockFeedback);
      }
      
      setIsSubmitting(false);
    }, 2000);
  };
  
  const generateFeedbackComment = () => {
    const comments = [
      "Good effort! Your pronunciation is clear, but try to work on your sentence structure. Use more complex sentences to express your ideas. Your vocabulary is appropriate for this level, but could be more varied. Practice speaking at a more natural pace to improve fluency.",
      "Well done! You communicated your ideas effectively. Your grammar is generally accurate with a few minor errors. Try to incorporate more advanced vocabulary to enrich your speech. Your pronunciation is good, but pay attention to word stress in longer words.",
      "Nice job! Your fluency is impressive, with minimal hesitation. Some grammar points need attention, particularly with verb tenses. Your vocabulary range is good, but try to use more idiomatic expressions. Work on the pronunciation of certain sounds that don't exist in your native language.",
      "Great attempt! You have a good command of vocabulary related to this topic. Your grammar is mostly accurate, but watch out for article usage. Your speech was a bit slow at times - try to maintain a more consistent pace. Your pronunciation is clear, though some sounds need refinement.",
    ];
    
    return comments[Math.floor(Math.random() * comments.length)];
  };
  
  // Simulate recording time
  useEffect(() => {
    let interval;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          
          // Auto-stop if time limit is reached
          if (newTime >= prompt.timeLimit) {
            setIsRecording(false);
            setHasRecorded(true);
            
            // Add the attempt to the store
            const attempt = {
              promptId: prompt.id,
              date: new Date().toISOString(),
              duration: prompt.timeLimit,
            };
            
            addAttempt(attempt);
            
            clearInterval(interval);
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, prompt.timeLimit]);
  
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Speaking Practice',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.contentContainer}>
        <View style={styles.metaContainer}>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(prompt.level) }]}>
            <Text style={styles.levelText}>{prompt.level}</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{prompt.category}</Text>
          </View>
          <View style={styles.timeBadge}>
            <Clock size={14} color={colors.textLight} />
            <Text style={styles.timeText}>
              {Math.floor(prompt.timeLimit / 60)}:{(prompt.timeLimit % 60).toString().padStart(2, '0')}
            </Text>
          </View>
        </View>
        
        <SpeakingTest
          prompt={prompt.prompt}
          isRecording={isRecording}
          recordingTime={recordingTime}
          onRecord={handleStartRecording}
          onStopRecording={handleStopRecording}
          onSubmit={handleSubmitForFeedback}
          feedback={feedback}
        />
        
        {!isRecording && !hasRecorded && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instructions:</Text>
            <Text style={styles.instructionsText}>
              1. Tap the microphone button to start recording your answer.
            </Text>
            <Text style={styles.instructionsText}>
              2. You have {Math.floor(prompt.timeLimit / 60)}:{(prompt.timeLimit % 60).toString().padStart(2, '0')} minutes to complete your response.
            </Text>
            <Text style={styles.instructionsText}>
              3. Tap the microphone button again to stop recording when you're finished.
            </Text>
            <Text style={styles.instructionsText}>
              4. Submit your recording for AI feedback on your pronunciation, grammar, vocabulary, and fluency.
            </Text>
          </View>
        )}
        
        {prompt.sampleAnswer && (
          <View style={styles.sampleAnswerContainer}>
            <Text style={styles.sampleAnswerTitle}>Sample Answer:</Text>
            <Text style={styles.sampleAnswerText}>{prompt.sampleAnswer}</Text>
          </View>
        )}
        
        {promptProgress.attempts.length > 0 && (
          <View style={styles.previousAttemptsContainer}>
            <Text style={styles.previousAttemptsTitle}>Previous Attempts:</Text>
            {promptProgress.attempts.map((attempt, index) => (
              <View key={index} style={styles.attemptItem}>
                <View style={styles.attemptHeader}>
                  <Text style={styles.attemptDate}>
                    {new Date(attempt.date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.attemptDuration}>
                    {Math.floor(attempt.duration / 60)}:{(attempt.duration % 60).toString().padStart(2, '0')}
                  </Text>
                </View>
                {attempt.feedback ? (
                  <View style={styles.attemptFeedback}>
                    <Text style={styles.attemptScore}>
                      Score: {attempt.feedback.overall.toFixed(1)}/5
                    </Text>
                  </View>
                ) : (
                  <View style={styles.attemptNoFeedback}>
                    <AlertCircle size={14} color={colors.warning} />
                    <Text style={styles.attemptNoFeedbackText}>No feedback submitted</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'beginner':
      return colors.success;
    case 'intermediate':
      return colors.warning;
    case 'advanced':
      return colors.error;
    default:
      return colors.info;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  backLink: {
    fontSize: 16,
    color: colors.primary,
  },
  backButton: {
    padding: 8,
  },
  contentContainer: {
    padding: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  levelText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: colors.gray[200],
  },
  categoryText: {
    color: colors.text,
    fontSize: 12,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
    gap: 4,
  },
  timeText: {
    color: colors.textLight,
    fontSize: 12,
  },
  instructionsContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
    lineHeight: 20,
  },
  sampleAnswerContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  sampleAnswerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  sampleAnswerText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  previousAttemptsContainer: {
    marginTop: 24,
  },
  previousAttemptsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  attemptItem: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  attemptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  attemptDate: {
    fontSize: 14,
    color: colors.text,
  },
  attemptDuration: {
    fontSize: 14,
    color: colors.textLight,
  },
  attemptFeedback: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attemptScore: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  attemptNoFeedback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attemptNoFeedbackText: {
    fontSize: 14,
    color: colors.warning,
  },
});