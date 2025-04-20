import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Mic, MicOff, Play, Pause } from 'lucide-react-native';
import colors from '@/constants/colors';
import { Button } from './Button';

interface SpeakingTestProps {
  prompt: string;
  onRecord?: () => void;
  onStopRecording?: () => void;
  onSubmit?: () => void;
  isRecording?: boolean;
  recordingTime?: number;
  feedback?: {
    pronunciation: number;
    grammar: number;
    vocabulary: number;
    fluency: number;
    overall: number;
    comments: string;
  };
}

export const SpeakingTest: React.FC<SpeakingTestProps> = ({
  prompt,
  onRecord,
  onStopRecording,
  onSubmit,
  isRecording = false,
  recordingTime = 0,
  feedback,
}) => {
  // Format recording time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.promptContainer}>
        <Text style={styles.promptTitle}>Speaking Prompt:</Text>
        <Text style={styles.promptText}>{prompt}</Text>
      </View>
      
      <View style={styles.recordingContainer}>
        {isRecording ? (
          <>
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>Recording... {formatTime(recordingTime)}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.recordButton} 
              onPress={onStopRecording}
            >
              <MicOff size={28} color={colors.white} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.recordingInstructions}>
              Tap the microphone to start recording your answer
            </Text>
            
            <TouchableOpacity 
              style={styles.recordButton} 
              onPress={onRecord}
            >
              <Mic size={28} color={colors.white} />
            </TouchableOpacity>
          </>
        )}
      </View>
      
      {!isRecording && recordingTime > 0 && (
        <Button 
          title="Submit for Feedback" 
          onPress={onSubmit}
          style={styles.submitButton}
        />
      )}
      
      {feedback && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackTitle}>Feedback</Text>
          
          <View style={styles.scoreContainer}>
            <ScoreItem label="Pronunciation" score={feedback.pronunciation} />
            <ScoreItem label="Grammar" score={feedback.grammar} />
            <ScoreItem label="Vocabulary" score={feedback.vocabulary} />
            <ScoreItem label="Fluency" score={feedback.fluency} />
            <View style={styles.overallScore}>
              <Text style={styles.overallScoreLabel}>Overall:</Text>
              <Text style={styles.overallScoreValue}>{feedback.overall}/5</Text>
            </View>
          </View>
          
          <View style={styles.commentsContainer}>
            <Text style={styles.commentsTitle}>Comments:</Text>
            <Text style={styles.commentsText}>{feedback.comments}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

interface ScoreItemProps {
  label: string;
  score: number;
}

const ScoreItem: React.FC<ScoreItemProps> = ({ label, score }) => {
  return (
    <View style={styles.scoreItem}>
      <Text style={styles.scoreLabel}>{label}:</Text>
      <View style={styles.scoreStars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <View 
            key={star} 
            style={[
              styles.star, 
              star <= score ? styles.starFilled : styles.starEmpty
            ]} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 8,
  },
  promptContainer: {
    marginBottom: 20,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  promptText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  recordingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.error,
    marginRight: 8,
  },
  recordingText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '500',
  },
  recordingInstructions: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
    textAlign: 'center',
  },
  recordButton: {
    backgroundColor: isRecording => isRecording ? colors.error : colors.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    marginTop: 16,
  },
  feedbackContainer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  scoreContainer: {
    marginBottom: 16,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 14,
    color: colors.text,
    width: 100,
  },
  scoreStars: {
    flexDirection: 'row',
  },
  star: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
  },
  starFilled: {
    backgroundColor: colors.primary,
  },
  starEmpty: {
    backgroundColor: colors.gray[300],
  },
  overallScore: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  overallScoreLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  overallScoreValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 8,
  },
  commentsContainer: {
    backgroundColor: colors.gray[100],
    padding: 12,
    borderRadius: 8,
  },
  commentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  commentsText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
});