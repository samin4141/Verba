import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { listeningContents, ListeningContent, Vocabulary } from '@/mocks/listening';

interface SavedVocabulary extends Vocabulary {
  contentId: string;
  savedAt: string;
}

interface ListeningProgress {
  [contentId: string]: {
    completed: boolean;
    lastListened: string | null;
    progress: number; // 0 to 1
    saved: boolean;
    liked: boolean;
  };
}

interface ListeningState {
  contents: ListeningContent[];
  progress: ListeningProgress;
  savedVocabulary: SavedVocabulary[];
  currentFilter: 'all' | 'beginner' | 'intermediate' | 'advanced' | 'saved';
  searchQuery: string;
  
  // Actions
  setCurrentFilter: (filter: 'all' | 'beginner' | 'intermediate' | 'advanced' | 'saved') => void;
  setSearchQuery: (query: string) => void;
  updateProgress: (contentId: string, progress: number) => void;
  markContentCompleted: (contentId: string) => void;
  toggleSaveContent: (contentId: string) => void;
  toggleLikeContent: (contentId: string) => void;
  saveVocabulary: (vocabulary: Vocabulary, contentId: string) => void;
  removeVocabulary: (word: string) => void;
  resetProgress: () => void;
  
  // Computed
  getFilteredContents: () => ListeningContent[];
  getSavedContents: () => ListeningContent[];
  getCompletedCount: () => number;
  getTotalProgress: () => number;
}

export const useListeningStore = create<ListeningState>()(
  persist(
    (set, get) => ({
      contents: listeningContents,
      progress: {},
      savedVocabulary: [],
      currentFilter: 'all',
      searchQuery: '',
      
      setCurrentFilter: (filter) => set({ currentFilter: filter }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      updateProgress: (contentId, progress) => set((state) => ({
        progress: {
          ...state.progress,
          [contentId]: {
            ...state.progress[contentId],
            progress,
            lastListened: new Date().toISOString(),
          }
        }
      })),
      
      markContentCompleted: (contentId) => set((state) => ({
        progress: {
          ...state.progress,
          [contentId]: {
            ...state.progress[contentId],
            completed: true,
            progress: 1,
            lastListened: new Date().toISOString(),
          }
        }
      })),
      
      toggleSaveContent: (contentId) => set((state) => {
        const currentProgress = state.progress[contentId] || { 
          completed: false, 
          lastListened: null, 
          progress: 0,
          saved: false,
          liked: false
        };
        
        return {
          progress: {
            ...state.progress,
            [contentId]: {
              ...currentProgress,
              saved: !currentProgress.saved,
            }
          }
        };
      }),
      
      toggleLikeContent: (contentId) => set((state) => {
        const currentProgress = state.progress[contentId] || { 
          completed: false, 
          lastListened: null, 
          progress: 0,
          saved: false,
          liked: false
        };
        
        return {
          progress: {
            ...state.progress,
            [contentId]: {
              ...currentProgress,
              liked: !currentProgress.liked,
            }
          }
        };
      }),
      
      saveVocabulary: (vocabulary, contentId) => set((state) => ({
        savedVocabulary: [
          ...state.savedVocabulary,
          {
            ...vocabulary,
            contentId,
            savedAt: new Date().toISOString(),
          }
        ]
      })),
      
      removeVocabulary: (word) => set((state) => ({
        savedVocabulary: state.savedVocabulary.filter(v => v.word !== word)
      })),
      
      resetProgress: () => set({ 
        progress: {},
        savedVocabulary: []
      }),
      
      getFilteredContents: () => {
        const { contents, currentFilter, searchQuery, progress } = get();
        
        return contents.filter(content => {
          // Apply level filter
          if (currentFilter !== 'all' && currentFilter !== 'saved') {
            if (content.level !== currentFilter) {
              return false;
            }
          }
          
          // Apply saved filter
          if (currentFilter === 'saved') {
            const contentProgress = progress[content.id];
            if (!contentProgress || !contentProgress.saved) {
              return false;
            }
          }
          
          // Apply search filter
          if (searchQuery && !content.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
          }
          
          return true;
        });
      },
      
      getSavedContents: () => {
        const { contents, progress } = get();
        
        return contents.filter(content => {
          const contentProgress = progress[content.id];
          return contentProgress && contentProgress.saved;
        });
      },
      
      getCompletedCount: () => {
        const { progress } = get();
        return Object.values(progress).filter(p => p.completed).length;
      },
      
      getTotalProgress: () => {
        const { contents, progress } = get();
        const completedCount = Object.values(progress).filter(p => p.completed).length;
        return contents.length > 0 ? completedCount / contents.length : 0;
      },
    }),
    {
      name: 'listening-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);