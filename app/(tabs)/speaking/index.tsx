import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Search, Filter, Mic, Star } from 'lucide-react-native';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { useSpeakingStore } from '@/store/speaking-store';
import colors from '@/constants/colors';

export default function SpeakingScreen() {
  const router = useRouter();
  const { 
    getFilteredPrompts, 
    getAttemptedCount,
    getAverageScore,
    currentFilter,
    setCurrentFilter,
    searchQuery,
    setSearchQuery,
    progress,
  } = useSpeakingStore();

  const [showFilters, setShowFilters] = useState(false);
  
  const filteredPrompts = getFilteredPrompts();
  const attemptedCount = getAttemptedCount();
  const averageScore = getAverageScore();
  const totalCount = useSpeakingStore.getState().prompts.length;

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePromptPress = (promptId: string) => {
    router.push(`/speaking/${promptId}`);
  };

  const renderPromptCard = ({ item }) => {
    const promptProgress = progress[item.id];
    const hasAttempts = promptProgress && promptProgress.attempts.length > 0;
    const bestScore = promptProgress?.bestScore;
    
    return (
      <TouchableOpacity 
        onPress={() => handlePromptPress(item.id)}
        activeOpacity={0.7}
      >
        <Card style={styles.promptCard}>
          <View style={styles.promptHeader}>
            <View style={[styles.levelBadge, { backgroundColor: getLevelColor(item.level) }]}>
              <Text style={styles.levelText}>{item.level}</Text>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            {hasAttempts && (
              <View style={styles.attemptsBadge}>
                <Text style={styles.attemptsText}>
                  {promptProgress.attempts.length} {promptProgress.attempts.length === 1 ? 'attempt' : 'attempts'}
                </Text>
              </View>
            )}
          </View>
          
          <Text style={styles.promptText} numberOfLines={3}>
            {item.prompt}
          </Text>
          
          <View style={styles.promptFooter}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {Math.floor(item.timeLimit / 60)}:{(item.timeLimit % 60).toString().padStart(2, '0')}
              </Text>
            </View>
            
            {bestScore !== null && bestScore !== undefined && (
              <View style={styles.scoreContainer}>
                <Star size={16} color={colors.warning} fill={colors.warning} />
                <Text style={styles.scoreText}>{bestScore.toFixed(1)}/5</Text>
              </View>
            )}
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Speaking Practice',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.filterButton} 
              onPress={toggleFilters}
            >
              <Filter size={20} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />

      <View style={styles.header}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{attemptedCount}</Text>
            <Text style={styles.statLabel}>Prompts Attempted</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{averageScore.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Average Score</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{Math.round((attemptedCount / totalCount) * 100)}%</Text>
            <Text style={styles.statLabel}>Completion</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={colors.gray[500]} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search speaking prompts..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.gray[500]}
          />
        </View>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>Filter by:</Text>
          <View style={styles.filterOptions}>
            <TouchableOpacity
              style={[
                styles.filterOption,
                currentFilter === 'all' && styles.filterOptionActive,
              ]}
              onPress={() => setCurrentFilter('all')}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  currentFilter === 'all' && styles.filterOptionTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            
            <Text style={styles.filterSectionTitle}>Level:</Text>
            <TouchableOpacity
              style={[
                styles.filterOption,
                currentFilter === 'beginner' && styles.filterOptionActive,
              ]}
              onPress={() => setCurrentFilter('beginner')}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  currentFilter === 'beginner' && styles.filterOptionTextActive,
                ]}
              >
                Beginner
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterOption,
                currentFilter === 'intermediate' && styles.filterOptionActive,
              ]}
              onPress={() => setCurrentFilter('intermediate')}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  currentFilter === 'intermediate' && styles.filterOptionTextActive,
                ]}
              >
                Intermediate
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterOption,
                currentFilter === 'advanced' && styles.filterOptionActive,
              ]}
              onPress={() => setCurrentFilter('advanced')}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  currentFilter === 'advanced' && styles.filterOptionTextActive,
                ]}
              >
                Advanced
              </Text>
            </TouchableOpacity>
            
            <Text style={styles.filterSectionTitle}>Category:</Text>
            <TouchableOpacity
              style={[
                styles.filterOption,
                currentFilter === 'daily life' && styles.filterOptionActive,
              ]}
              onPress={() => setCurrentFilter('daily life')}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  currentFilter === 'daily life' && styles.filterOptionTextActive,
                ]}
              >
                Daily Life
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterOption,
                currentFilter === 'work' && styles.filterOptionActive,
              ]}
              onPress={() => setCurrentFilter('work')}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  currentFilter === 'work' && styles.filterOptionTextActive,
                ]}
              >
                Work
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterOption,
                currentFilter === 'travel' && styles.filterOptionActive,
              ]}
              onPress={() => setCurrentFilter('travel')}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  currentFilter === 'travel' && styles.filterOptionTextActive,
                ]}
              >
                Travel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterOption,
                currentFilter === 'opinion' && styles.filterOptionActive,
              ]}
              onPress={() => setCurrentFilter('opinion')}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  currentFilter === 'opinion' && styles.filterOptionTextActive,
                ]}
              >
                Opinion
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterOption,
                currentFilter === 'scenario' && styles.filterOptionActive,
              ]}
              onPress={() => setCurrentFilter('scenario')}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  currentFilter === 'scenario' && styles.filterOptionTextActive,
                ]}
              >
                Scenario
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {filteredPrompts.length > 0 ? (
        <FlatList
          data={filteredPrompts}
          renderItem={renderPromptCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Mic size={60} color={colors.gray[300]} />
          <Text style={styles.emptyTitle}>No speaking prompts found</Text>
          <Text style={styles.emptyText}>
            Try adjusting your search or filters to find what you're looking for.
          </Text>
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
  header: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.text,
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: colors.gray[100],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  filterSectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textLight,
    marginTop: 8,
    marginBottom: 4,
    width: '100%',
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  filterOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  filterOptionTextActive: {
    color: colors.white,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  promptCard: {
    marginBottom: 12,
  },
  promptHeader: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
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
  attemptsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  attemptsText: {
    color: colors.white,
    fontSize: 12,
  },
  promptText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  promptFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: colors.textLight,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
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
  },
  filterButton: {
    padding: 8,
    marginRight: 8,
  },
});