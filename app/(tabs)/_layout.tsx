import React from "react";
import { Tabs } from "expo-router";
import { Book, Headphones, Mic } from "lucide-react-native";
import colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.gray[200],
        },
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '600',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="grammar"
        options={{
          title: "Grammar",
          tabBarIcon: ({ color, size }) => (
            <Book size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="listening"
        options={{
          title: "Listening",
          tabBarIcon: ({ color, size }) => (
            <Headphones size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="speaking"
        options={{
          title: "Speaking",
          tabBarIcon: ({ color, size }) => (
            <Mic size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}