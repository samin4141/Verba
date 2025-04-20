import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react-native';
import { ProgressBar } from './ProgressBar';
import colors from '@/constants/colors';

interface AudioPlayerProps {
  title: string;
  duration: number; // in seconds
  currentTime?: number;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (position: number) => void;
  onForward?: () => void;
  onRewind?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  title,
  duration,
  currentTime = 0,
  isPlaying = false,
  onPlay,
  onPause,
  onSeek,
  onForward,
  onRewind,
}) => {
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        <ProgressBar 
          progress={progress} 
          height={4} 
          color={colors.primary}
        />
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={onRewind}>
          <SkipBack size={24} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.playButton} 
          onPress={isPlaying ? onPause : onPlay}
        >
          {isPlaying ? (
            <Pause size={24} color={colors.white} />
          ) : (
            <Play size={24} color={colors.white} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={onForward}>
          <SkipForward size={24} color={colors.text} />
        </TouchableOpacity>
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  timeText: {
    fontSize: 12,
    color: colors.textLight,
    minWidth: 35,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
  },
});