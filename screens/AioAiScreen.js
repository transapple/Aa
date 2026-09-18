import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenHeader, Tappable, Reveal, colors, gradients, radius, spacing, shadow } from '../theme/UI';

const STARTERS = [
  { text: 'Which students have unpaid fees this term?', icon: 'cash-outline' },
  { text: 'Summarize today\u2019s attendance', icon: 'checkmark-done-outline' },
  { text: 'Draft a message to parents about mid-term break', icon: 'mail-outline' },
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
      <ScreenHeader
        eyebrow="AI assistant"
        title="AiO ai ✨"
        subtitle="Ask anything about your school"
        gradient={gradients.plum}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Reveal index={index} delay={0} style={{ marginBottom: 10 }}>
              {item.role === 'user' ? (
                <LinearGradient colors={gradients.plum} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.bubble, styles.bubbleUser]}>
                  <Text style={styles.bubbleUserText}>{item.text}</Text>
                </LinearGradient>
              ) : (
                <View style={[styles.bubble, styles.bubbleAssistant, shadow.soft]}>
                  <View style={styles.assistantTag}>
                    <Ionicons name="sparkles" size={12} color={colors.violet} />
                    <Text style={styles.assistantTagText}>AiO</Text>
                  </View>
                  <Text style={styles.bubbleAssistantText}>{item.text}</Text>
                </View>
              )}
            </Reveal>
          )}
          ListFooterComponent={
            messages.length <= 1 ? (
              <View style={styles.startersWrap}>
                <Text style={styles.startersLabel}>Try asking</Text>
                {STARTERS.map((s, i) => (
                  <Reveal index={i} delay={200} key={s.text}>
                    <Tappable style={[styles.starterChip, shadow.soft]} onPress={() => send(s.text)}>
                      <View style={styles.starterIconWrap}>
                        <Ionicons name={s.icon} size={16} color={colors.violet} />
                      </View>
                      <Text style={styles.starterText}>{s.text}</Text>
                      <Ionicons name="arrow-forward" size={16} color={colors.inkFaint} />
                    </Tappable>
                  </Reveal>
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
            placeholderTextColor={colors.placeholder}
            onSubmitEditing={() => send()}
          />
          <Tappable onPress={() => send()} scaleTo={0.88}>
            <LinearGradient colors={gradients.plum} style={styles.sendBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Ionicons name="send" size={17} color="#fff" />
            </LinearGradient>
          </Tappable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  chatContent: { padding: spacing.lg, paddingBottom: 8 },
  bubble: { maxWidth: '86%', borderRadius: radius.lg, padding: 14 },
  bubbleAssistant: { backgroundColor: colors.surface, alignSelf: 'flex-start', borderTopLeftRadius: 4 },
  bubbleUser: { alignSelf: 'flex-end', borderTopRightRadius: 4 },
  bubbleAssistantText: { color: colors.ink, fontSize: 14, lineHeight: 20, fontWeight: '500' },
  bubbleUserText: { color: '#fff', fontSize: 14, lineHeight: 20, fontWeight: '500' },
  assistantTag: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  assistantTagText: { fontSize: 11, fontWeight: '800', color: colors.violet, textTransform: 'uppercase', letterSpacing: 0.4 },
  startersWrap: { marginTop: 10, gap: 10 },
  startersLabel: { fontSize: 12, fontWeight: '700', color: colors.inkFaint, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.4 },
  starterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 13,
    gap: 10,
  },
  starterIconWrap: { width: 30, height: 30, borderRadius: 10, backgroundColor: '#F1ECFE', alignItems: 'center', justifyContent: 'center' },
  starterText: { flex: 1, fontSize: 13, color: colors.ink, fontWeight: '600' },
  inputRow: { flexDirection: 'row', padding: 12, gap: 10, backgroundColor: colors.surface, alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border },
  input: { flex: 1, backgroundColor: colors.bg, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 11, fontSize: 14, color: colors.ink },
  sendBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', ...shadow.floating },
});
