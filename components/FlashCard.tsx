import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Card } from '@/components/Card';
import colors from '@/constants/colors';

interface FlashCardProps {
  word: string;
  translation: string;
  example?: string;
  onRemember?: () => void;
  onReview?: () => void;
}

export const FlashCard: React.FC<FlashCardProps> = ({
  word,
  translation,
  example,
  onRemember,
  onReview
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={handleFlip}
      style={styles.container}
    >
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          {!isFlipped ? (
            <View style={styles.frontSide}>
              <Text style={styles.wordText}>{word}</Text>
              {example && (
                <Text style={styles.exampleText}>"{example}"</Text>
              )}
            </View>
          ) : (
            <View style={styles.backSide}>
              <Text style={styles.translationText}>{translation}</Text>
              <Text style={styles.wordTextBack}>{word}</Text>
              {example && (
                <Text style={styles.exampleText}>"{example}"</Text>
              )}
            </View>
          )}
        </View>
      </Card>
      
      {isFlipped && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.reviewButton]} 
            onPress={onReview}
          >
            <Text style={styles.reviewButtonText}>Review Later</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.rememberButton]} 
            onPress={onRemember}
          >
            <Text style={styles.rememberButtonText}>I Remember</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 8,
  },
  card: {
    width: '100%',
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cardContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frontSide: {
    alignItems: 'center',
  },
  backSide: {
    alignItems: 'center',
  },
  wordText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  wordTextBack: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
  translationText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
    width: '100%',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewButton: {
    backgroundColor: colors.gray[200],
  },
  rememberButton: {
    backgroundColor: colors.primary,
  },
  reviewButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  rememberButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
});