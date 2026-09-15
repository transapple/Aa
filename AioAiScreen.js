import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const STARTERS = [
  'Which students have unpaid fees this term?',
  'Summarize today\u2019s attendance',
  'Draft a message to parents about mid-term break',
];

export default function AioAiScreen() {
  const [messages, setMessages] = useState([
    { id: 'welcome', role: 'assistant', text: "Hi! I'm AiO — ask me about students, fees, attendance, or anything else in your school data." },
  ]);
  const [input, setInput] = useState('');

  function send(text) {
    const trimmed = (text ?? input).trim();
    if (!trimmed) return;
    const userMsg = { id: Date.now().toString(), role: 'user', text: trimmed };
    // Placeholder reply — wire this up to an AI backend (e.g. the Anthropic
    // API) once you're ready to connect real school data as context.
    const reply = {
      id: Date.now().toString() + '-r',
      role: 'assistant',
      text: "This is a placeholder response. Connect AiO to your backend and school data to get real answers here.",
    };
    setMessages((prev) => [...prev, userMsg, reply]);
    setInput('');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.chatContent}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant]}>
              <Text style={item.role === 'user' ? styles.bubbleUserText : styles.bubbleAssistantText}>{item.text}</Text>
            </View>
          )}
          ListFooterComponent={
            messages.length <= 1 ? (
              <View style={styles.startersWrap}>
                {STARTERS.map((s) => (
                  <TouchableOpacity key={s} style={styles.starterChip} onPress={() => send(s)}>
                    <Text style={styles.starterText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null
          }
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask AiO anything about your school..."
            onSubmitEditing={() => send()}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => send()}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEF2F9' },
  chatContent: { padding: 16, paddingBottom: 8 },
  bubble: { maxWidth: '85%', borderRadius: 16, padding: 12, marginBottom: 10 },
  bubbleAssistant: { backgroundColor: '#fff', alignSelf: 'flex-start', borderTopLeftRadius: 4 },
  bubbleUser: { backgroundColor: '#16274A', alignSelf: 'flex-end', borderTopRightRadius: 4 },
  bubbleAssistantText: { color: '#16274A', fontSize: 14 },
  bubbleUserText: { color: '#fff', fontSize: 14 },
  startersWrap: { marginTop: 8, gap: 8 },
  starterChip: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#E5E9F2' },
  starterText: { fontSize: 13, color: '#16274A', fontWeight: '600' },
  inputRow: { flexDirection: 'row', padding: 12, gap: 8, backgroundColor: '#fff', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#EEF2F9', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#16274A', alignItems: 'center', justifyContent: 'center' },
});
