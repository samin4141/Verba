// components/SpeakingBot.tsx
import React, { useState, useEffect } from 'react'
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native'
import Voice from '@react-native-voice/voice'
import * as Speech from 'expo-speech'

type Message = { role: 'user' | 'assistant'; content: string }

export default function SpeakingBot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [recording, setRecording] = useState(false)

  useEffect(() => {
    Voice.onSpeechResults = e => {
      const text = e.value?.[0] || ''
      onUserText(text)
    }
    Voice.onSpeechError = e => {
      console.error(e)
      setRecording(false)
    }
    return () => {
      Voice.destroy().then(Voice.removeAllListeners)
    }
  }, [messages])

  const startRecording = async () => {
    try {
      await Voice.start('en-US')
      setRecording(true)
    } catch (e) {
      console.error(e)
    }
  }

  const stopRecording = async () => {
    try { await Voice.stop() } catch {}
    setRecording(false)
  }

  const onUserText = async (text: string) => {
    stopRecording()
    const newMsgs = [...messages, { role: 'user', content: text }]
    setMessages(newMsgs)

    // 1) call your Hugging Face /api/chat endpoint
    const res = await fetch('https://YOUR_BACKEND_URL/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMsgs }),
    })
    const { message } = await res.json()
    const aiMsg = { role: 'assistant', content: message.content }
    setMessages(prev => [...newMsgs, aiMsg])

    // 2) speak it
    Speech.speak(aiMsg.content, { language: 'en-US' })
  }

  return (
    <View style={styles.container}>
      <Button
        title={ recording ? 'Recording… Tap to stop' : '🎙️ Talk' }
        onPress={ recording ? stopRecording : startRecording }
      />
      <ScrollView style={styles.history}>
        {messages.map((m,i) => (
          <Text key={i} style={m.role==='user' ? styles.user : styles.assistant}>
            {m.content}
          </Text>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16 },
  history: { marginTop:16 },
  user: { textAlign:'right', backgroundColor:'#d0ebff', padding:8, marginVertical:4, borderRadius:4 },
  assistant: { textAlign:'left', backgroundColor:'#f1f3f5', padding:8, marginVertical:4, borderRadius:4 },
})
