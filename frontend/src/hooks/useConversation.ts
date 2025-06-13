
import { useState, useCallback } from 'react';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  audioUrl?: string;
  feedback?: {
    pronunciation: number;
    grammar: number;
    vocabulary: number;
    fluency: number;
    suggestions: string[];
  };
}

export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: Date;
  topic?: string;
}

const STORAGE_KEY = 'english_ai_conversations';
const MAX_STORAGE_DAYS = 2;

export const useConversation = () => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Filter out conversations older than 2 days
      const filtered = parsed.filter((conv: any) => {
        const createdAt = new Date(conv.createdAt);
        const daysDiff = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= MAX_STORAGE_DAYS;
      });
      return filtered;
    }
    return [];
  });

  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  const saveConversations = useCallback((convs: Conversation[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
    setConversations(convs);
  }, []);

  const createConversation = useCallback((topic?: string) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      messages: [],
      createdAt: new Date(),
      topic
    };
    
    const updatedConversations = [newConversation, ...conversations];
    saveConversations(updatedConversations);
    setCurrentConversation(newConversation);
    
    return newConversation;
  }, [conversations, saveConversations]);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    if (!currentConversation) return;

    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, newMessage]
    };

    const updatedConversations = conversations.map(conv => 
      conv.id === currentConversation.id ? updatedConversation : conv
    );

    saveConversations(updatedConversations);
    setCurrentConversation(updatedConversation);
  }, [currentConversation, conversations, saveConversations]);

  const generateAIResponse = useCallback(async (userMessage: string) => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock AI response with feedback
    const responses = [
      "That's a great point! Your pronunciation is quite clear.",
      "I understand what you're saying. Have you considered using more varied vocabulary?",
      "Excellent fluency! Try to work on connecting your ideas more smoothly.",
      "Good grammar usage. Let's explore this topic further.",
      "Your speaking pace is perfect. Can you elaborate on that?"
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];
    
    const feedback = {
      pronunciation: Math.floor(Math.random() * 20) + 80, // 80-100
      grammar: Math.floor(Math.random() * 15) + 85, // 85-100
      vocabulary: Math.floor(Math.random() * 25) + 75, // 75-100
      fluency: Math.floor(Math.random() * 20) + 80, // 80-100
      suggestions: [
        "Try to speak with more confidence",
        "Consider using more advanced vocabulary",
        "Work on natural pauses between sentences"
      ].slice(0, Math.floor(Math.random() * 3) + 1)
    };

    addMessage({
      type: 'ai',
      content: response,
      feedback
    });
  }, [addMessage]);

  const cleanupOldConversations = useCallback(() => {
    const filtered = conversations.filter(conv => {
      const daysDiff = (Date.now() - new Date(conv.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= MAX_STORAGE_DAYS;
    });
    
    if (filtered.length !== conversations.length) {
      saveConversations(filtered);
    }
  }, [conversations, saveConversations]);

  return {
    conversations,
    currentConversation,
    createConversation,
    setCurrentConversation,
    addMessage,
    generateAIResponse,
    cleanupOldConversations
  };
};
