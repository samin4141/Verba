import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import colors from '@/constants/colors';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  showPercentage?: boolean;
  color?: string;
  backgroundColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  showPercentage = false,
  color = colors.primary,
  backgroundColor = colors.gray[200]
}) => {
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const percentage = Math.round(clampedProgress * 100);
  
  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.progressContainer, 
          { height, backgroundColor }
        ]}
      >
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${percentage}%`,
              backgroundColor: color 
            }
          ]} 
        />
      </View>
      {showPercentage && (
        <Text style={styles.percentageText}>{percentage}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressContainer: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
    color: colors.textLight,
    minWidth: 40,
    textAlign: 'right',
  }
});