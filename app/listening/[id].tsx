import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Heart, Bookmark, Share2 } from 'lucide-react-native';
import { AudioPlayer } from '@/components/AudioPlayer';
import { FlashCard } from '@/components/FlashCard';
import { useListeningStore } from '@/store/listening-store';
import colors from '@/constants/colors';

export default function ListeningDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { 
    contents, 
    progress,
    toggleSaveContent,
    toggleLikeContent,
    updateProgress,
    markContentCompleted,
    saveVocabulary,
    removeVocabulary,
    savedVocabulary
  } = useListeningStore();
  
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentVocabIndex, setCurrentVocabIndex] = useState(0);
  
  const content = contents.find(c => c.id === id);
  
  if (!content) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Content not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const contentProgress = progress[content.id] || { 
    completed: false, 
    lastListened: null, 
    progress: 0,
    saved: false,
    liked: false
  };
  
  const handlePlay = () => {
    setIsPlaying(true);
    // In a real app, this would control actual audio playback
  };
  
  const handlePause = () => {
    setIsPlaying(false);
    // In a real app, this would control actual audio playback
  };
  
  const handleSeek = (position: number) => {
    setCurrentTime(position * content.duration);
    updateProgress(content.id, position);
    // In a real app, this would seek the audio to the specified position
  };
  
  const handleForward = () => {
    const newTime = Math.min(currentTime + 10, content.duration);
    setCurrentTime(newTime);
    updateProgress(content.id, newTime / content.duration);
    // In a real app, this would seek the audio forward by 10 seconds
  };
  
  const handleRewind = () => {
    const newTime = Math.max(currentTime - 10, 0);
    setCurrentTime(newTime);
    updateProgress(content.id, newTime / content.duration);
    // In a real app, this would seek the audio backward by 10 seconds
  };
  
  const handleSaveVocabulary = (vocabulary) => {
    saveVocabulary(vocabulary, content.id);
  };
  
  const handleRemoveVocabulary = (word) => {
    removeVocabulary(word);
  };
  
  const isVocabularySaved = (word) => {
    return savedVocabulary.some(v => v.word === word);
  };
  
  // Simulate audio progress
  useEffect(() => {
    let interval;
    
    if (isPlaying && currentTime < content.duration) {
      interval = setInterval(() => {
        const newTime = currentTime + 1;
        setCurrentTime(newTime);
        updateProgress(content.id, newTime / content.duration);
        
        if (newTime >= content.duration) {
          setIsPlaying(false);
          markContentCompleted(content.id);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTime, content.duration]);
  
  // Initialize current time from saved progress
  useEffect(() => {
    if (contentProgress.progress > 0) {
      setCurrentTime(contentProgress.progress * content.duration);
    }
  }, []);
  
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{
          title: content.title,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerAction}
                onPress={() => toggleLikeContent(content.id)}
              >
                <Heart 
                  size={20} 
                  color={contentProgress.liked ? colors.secondary : colors.gray[500]} 
                  fill={contentProgress.liked ? colors.secondary : 'none'}
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerAction}
                onPress={() => toggleSaveContent(content.id)}
              >
                <Bookmark 
                  size={20} 
                  color={contentProgress.saved ? colors.primary : colors.gray[500]} 
                  fill={contentProgress.saved ? colors.primary : 'none'}
                />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      {content.imageUrl && (
        <Image 
          source={{ uri: content.imageUrl }} 
          style={styles.image} 
          resizeMode="cover"
        />
      )}
      
      <View style={styles.contentContainer}>
        <View style={styles.metaContainer}>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(content.level) }]}>
            <Text style={styles.levelText}>{content.level}</Text>
          </View>
          {content.source && (
            <Text style={styles.source}>{content.source}</Text>
          )}
          {content.date && (
            <Text style={styles.date}>{content.date}</Text>
          )}
        </View>
        
        <Text style={styles.title}>{content.title}</Text>
        
        <AudioPlayer
          title={`${content.title} Audio`}
          duration={content.duration}
          currentTime={currentTime}
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onSeek={handleSeek}
          onForward={handleForward}
          onRewind={handleRewind}
        />
        
        <View style={styles.contentTextContainer}>
          <TouchableOpacity 
            style={styles.translationToggle}
            onPress={() => setShowTranslation(!showTranslation)}
          >
            <Text style={styles.translationToggleText}>
              {showTranslation ? "Hide Translation" : "Show Translation"}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.contentText}>{content.content}</Text>
          
          {showTranslation && content.translation && (
            <View style={styles.translationContainer}>
              <Text style={styles.translationTitle}>Translation:</Text>
              <Text style={styles.translationText}>{content.translation}</Text>
            </View>
          )}
        </View>
        
        {content.vocabulary && content.vocabulary.length > 0 && (
          <View style={styles.vocabularySection}>
            <Text style={styles.sectionTitle}>Vocabulary</Text>
            
            <FlashCard
              word={content.vocabulary[currentVocabIndex].word}
              translation={content.vocabulary[currentVocabIndex].translation}
              example={content.vocabulary[currentVocabIndex].example}
              onRemember={() => {
                if (!isVocabularySaved(content.vocabulary[currentVocabIndex].word)) {
                  handleSaveVocabulary(content.vocabulary[currentVocabIndex]);
                }
                
                if (currentVocabIndex < content.vocabulary.length - 1) {
                  setCurrentVocabIndex(currentVocabIndex + 1);
                } else {
                  setCurrentVocabIndex(0);
                }
              }}
              onReview={() => {
                if (currentVocabIndex < content.vocabulary.length - 1) {
                  setCurrentVocabIndex(currentVocabIndex + 1);
                } else {
                  setCurrentVocabIndex(0);
                }
              }}
            />
            
            <View style={styles.vocabNavigation}>
              <Text style={styles.vocabCounter}>
                {currentVocabIndex + 1} of {content.vocabulary.length}
              </Text>
            </View>
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
  headerActions: {
    flexDirection: 'row',
  },
  headerAction: {
    padding: 8,
    marginLeft: 8,
  },
  image: {
    width: '100%',
    height: 200,
  },
  contentContainer: {
    padding: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
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
  source: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
    color: colors.gray[500],
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  contentTextContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  translationToggle: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  translationToggleText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  contentText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  translationContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  translationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  translationText: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  vocabularySection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  vocabNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  vocabCounter: {
    fontSize: 14,
    color: colors.textLight,
  },
});