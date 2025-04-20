import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { grammarRules, GrammarRule } from '@/mocks/grammar';

interface GrammarProgress {
  [ruleId: string]: {
    completed: boolean;
    lastStudied: string | null;
    quizScore: number | null;
  };
}

interface GrammarState {
  rules: GrammarRule[];
  progress: GrammarProgress;
  currentFilter: 'all' | 'beginner' | 'intermediate' | 'advanced';
  searchQuery: string;
  
  // Actions
  setCurrentFilter: (filter: 'all' | 'beginner' | 'intermediate' | 'advanced') => void;
  setSearchQuery: (query: string) => void;
  markRuleCompleted: (ruleId: string) => void;
  updateQuizScore: (ruleId: string, score: number) => void;
  resetProgress: () => void;
  
  // Computed
  getFilteredRules: () => GrammarRule[];
  getCompletedCount: () => number;
  getTotalProgress: () => number;
}

export const useGrammarStore = create<GrammarState>()(
  persist(
    (set, get) => ({
      rules: grammarRules,
      progress: {},
      currentFilter: 'all',
      searchQuery: '',
      
      setCurrentFilter: (filter) => set({ currentFilter: filter }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      markRuleCompleted: (ruleId) => set((state) => ({
        progress: {
          ...state.progress,
          [ruleId]: {
            ...state.progress[ruleId],
            completed: true,
            lastStudied: new Date().toISOString(),
          }
        }
      })),
      
      updateQuizScore: (ruleId, score) => set((state) => ({
        progress: {
          ...state.progress,
          [ruleId]: {
            ...state.progress[ruleId],
            quizScore: score,
          }
        }
      })),
      
      resetProgress: () => set({ progress: {} }),
      
      getFilteredRules: () => {
        const { rules, currentFilter, searchQuery } = get();
        
        return rules.filter(rule => {
          // Apply level filter
          if (currentFilter !== 'all' && rule.level !== currentFilter) {
            return false;
          }
          
          // Apply search filter
          if (searchQuery && !rule.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
          }
          
          return true;
        });
      },
      
      getCompletedCount: () => {
        const { rules, progress } = get();
        return Object.values(progress).filter(p => p.completed).length;
      },
      
      getTotalProgress: () => {
        const { rules, progress } = get();
        const completedCount = Object.values(progress).filter(p => p.completed).length;
        return rules.length > 0 ? completedCount / rules.length : 0;
      },
    }),
    {
      name: 'grammar-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);