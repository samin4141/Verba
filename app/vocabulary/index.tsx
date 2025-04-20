import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, BookOpen, X } from 'lucide-react-native';
import { FlashCard } from '@/components/FlashCard';
import { useListeningStore } from '@/store/listening-store';
import colors from '@/constants/colors';

export default function VocabularyScreen() {
  const router = useRouter();
  const { 
    savedVocabulary,
    removeVocabulary,
  } = useListeningStore();
  
  const renderVocabularyCard = ({ item }) => (
    <View style={styles.vocabCardContainer}>
      <FlashCard
        word={item.word}
        translation={item.translation}
        example={item.example}
        onRemember={() => {}}
        onReview={() => {}}
      />
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeVocabulary(item.word)}
      >
        <X size={16} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'My Vocabulary',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Saved Words</Text>
        <Text style={styles.headerSubtitle}>
          {savedVocabulary.length} {savedVocabulary.length === 1 ? 'word' : 'words'} saved
        </Text>
      </View>
      
      {savedVocabulary.length > 0 ? (
        <FlatList
          data={savedVocabulary}
          renderItem={renderVocabularyCard}
          keyExtractor={(item, index) => `${item.word}-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <BookOpen size={60} color={colors.gray[300]} />
          <Text style={styles.emptyTitle}>No vocabulary saved yet</Text>
          <Text style={styles.emptyText}>
            Save words from listening exercises to build your vocabulary.
          </Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push('/listening')}
          >
            <Text style={styles.browseButtonText}>Browse Listening Content</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 8,
  },
  header: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  vocabCardContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.error,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  browseButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});