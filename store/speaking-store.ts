import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { speakingPrompts, SpeakingPrompt } from '@/mocks/speaking';

interface SpeakingAttempt {
  promptId: string;
  date: string;
  duration: number;
  feedback?: {
    pronunciation: number;
    grammar: number;
    vocabulary: number;
    fluency: number;
    overall: number;
    comments: string;
  };
}

interface SpeakingProgress {
  [promptId: string]: {
    attempts: SpeakingAttempt[];
    bestScore: number | null;
  };
}

interface SpeakingState {
  prompts: SpeakingPrompt[];
  progress: SpeakingProgress;
  currentFilter: 'all' | 'beginner' | 'intermediate' | 'advanced' | 'daily life' | 'work' | 'travel' | 'opinion' | 'scenario';
  searchQuery: string;
  
  // Actions
  setCurrentFilter: (filter: 'all' | 'beginner' | 'intermediate' | 'advanced' | 'daily life' | 'work' | 'travel' | 'opinion' | 'scenario') => void;
  setSearchQuery: (query: string) => void;
  addAttempt: (attempt: SpeakingAttempt) => void;
  updateFeedback: (promptId: string, attemptDate: string, feedback: SpeakingAttempt['feedback']) => void;
  resetProgress: () => void;
  
  // Computed
  getFilteredPrompts: () => SpeakingPrompt[];
  getAttemptedCount: () => number;
  getAverageScore: () => number;
  getBestScore: () => number;
}

export const useSpeakingStore = create<SpeakingState>()(
  persist(
    (set, get) => ({
      prompts: speakingPrompts,
      progress: {},
      currentFilter: 'all',
      searchQuery: '',
      
      setCurrentFilter: (filter) => set({ currentFilter: filter }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      addAttempt: (attempt) => set((state) => {
        const promptProgress = state.progress[attempt.promptId] || { attempts: [], bestScore: null };
        
        return {
          progress: {
            ...state.progress,
            [attempt.promptId]: {
              ...promptProgress,
              attempts: [...promptProgress.attempts, attempt],
            }
          }
        };
      }),
      
      updateFeedback: (promptId, attemptDate, feedback) => set((state) => {
        const promptProgress = state.progress[promptId];
        if (!promptProgress) return state;
        
        const updatedAttempts = promptProgress.attempts.map(attempt => {
          if (attempt.date === attemptDate) {
            return { ...attempt, feedback };
          }
          return attempt;
        });
        
        // Calculate best score
        const scores = updatedAttempts
          .filter(a => a.feedback?.overall !== undefined)
          .map(a => a.feedback!.overall);
        
        const bestScore = scores.length > 0 ? Math.max(...scores) : null;
        
        return {
          progress: {
            ...state.progress,
            [promptId]: {
              attempts: updatedAttempts,
              bestScore,
            }
          }
        };
      }),
      
      resetProgress: () => set({ progress: {} }),
      
      getFilteredPrompts: () => {
        const { prompts, currentFilter, searchQuery } = get();
        
        return prompts.filter(prompt => {
          // Apply level/category filter
          if (currentFilter !== 'all') {
            if (
              currentFilter !== prompt.level && 
              currentFilter !== prompt.category
            ) {
              return false;
            }
          }
          
          // Apply search filter
          if (searchQuery && !prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
          }
          
          return true;
        });
      },
      
      getAttemptedCount: () => {
        const { progress } = get();
        return Object.keys(progress).length;
      },
      
      getAverageScore: () => {
        const { progress } = get();
        
        const scores = Object.values(progress)
          .flatMap(p => p.attempts)
          .filter(a => a.feedback?.overall !== undefined)
          .map(a => a.feedback!.overall);
        
        if (scores.length === 0) return 0;
        
        const sum = scores.reduce((acc, score) => acc + score, 0);
        return sum / scores.length;
      },
      
      getBestScore: () => {
        const { progress } = get();
        
        const bestScores = Object.values(progress)
          .map(p => p.bestScore)
          .filter(score => score !== null) as number[];
        
        if (bestScores.length === 0) return 0;
        
        return Math.max(...bestScores);
      },
    }),
    {
      name: 'speaking-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);