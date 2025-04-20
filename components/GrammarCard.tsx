import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import colors from '@/constants/colors';
import { Card } from './Card';

interface GrammarCardProps {
  title: string;
  explanation: string;
  examples: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  onPress?: () => void;
}

export const GrammarCard: React.FC<GrammarCardProps> = ({
  title,
  explanation,
  examples,
  level,
  onPress,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
    if (onPress) onPress();
  };

  const getLevelColor = () => {
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

  return (
    <Card style={styles.container}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor() }]}>
            <Text style={styles.levelText}>{level}</Text>
          </View>
        </View>
        {expanded ? (
          <ChevronUp size={20} color={colors.primary} />
        ) : (
          <ChevronDown size={20} color={colors.primary} />
        )}
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.content}>
          <Text style={styles.explanation}>{explanation}</Text>
          
          <Text style={styles.examplesTitle}>Examples:</Text>
          {examples.map((example, index) => (
            <View key={index} style={styles.exampleItem}>
              <Text style={styles.exampleText}>{example}</Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  levelText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  explanation: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  exampleItem: {
    backgroundColor: colors.gray[100],
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  exampleText: {
    fontSize: 14,
    color: colors.text,
    fontStyle: 'italic',
  },
});