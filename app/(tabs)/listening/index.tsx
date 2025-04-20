import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Search, Filter, Headphones, BookmarkPlus } from 'lucide-react-native';
import { ContentCard } from '@/components/ContentCard';
import { ProgressBar } from '@/components/ProgressBar';
import { useListeningStore } from '@/store/listening-store';
import colors from '@/constants/colors';

export default function ListeningScreen() {
  const router = useRouter();
  const { 
    getFilteredContents, 
    getTotalProgress, 
    getCompletedCount,
    currentFilter,
    setCurrentFilter,
    searchQuery,
    setSearchQuery,
    toggleSaveContent,
    toggleLikeContent,
    progress,
  } = useListeningStore();

  const [showFilters, setShowFilters] = useState(false);
  
  const filteredContents = getFilteredContents();
  const totalProgress = getTotalProgress();
  const completedCount = getCompletedCount();
  const totalCount = useListeningStore.getState().contents.length;

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleContentPress = (contentId: string) => {
    router.push(`/listening/${contentId}`);
  };

  const renderContentCard = ({ item }) => {
    const contentProgress = progress[item.id] || { saved: false, liked: false };
    
    return (
      <ContentCard
        title={item.title}
        content={item.content}
        imageUrl={item.imageUrl}
        source={item.source}
        date={item.date}
        saved={contentProgress.saved}
        liked={contentProgress.liked}
        onSave={() => toggleSaveContent(item.id)}
        onLike={() => toggleLikeContent(item.id)}
        onPress={() => handleContentPress(item.id)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Listening',
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
        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>Your Progress</Text>
          <Text style={styles.progressText}>
            {completedCount} of {totalCount} lessons completed
          </Text>
          <ProgressBar 
            progress={totalProgress} 
            showPercentage 
            height={8}
          />
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={colors.gray[500]} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search listening content..."
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
            <TouchableOpacity
              style={[
                styles.filterOption,
                currentFilter === 'saved' && styles.filterOptionActive,
              ]}
              onPress={() => setCurrentFilter('saved')}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  currentFilter === 'saved' && styles.filterOptionTextActive,
                ]}
              >
                Saved
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {filteredContents.length > 0 ? (
        <FlatList
          data={filteredContents}
          renderItem={renderContentCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Headphones size={60} color={colors.gray[300]} />
          <Text style={styles.emptyTitle}>No content found</Text>
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
  progressContainer: {
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
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