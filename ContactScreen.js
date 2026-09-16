import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ScreenHeader,
  Card,
  Badge,
  Reveal,
  GradientButton,
  colors,
  gradients,
  radius,
  spacing,
} from '../theme/UI';

const SEED_REQUESTS = [
  { id: 'r1', subject: 'Cannot generate report card', status: 'open', created_at: new Date().toISOString() },
];

export default function ContactScreen() {
  const [requests, setRequests] = useState(SEED_REQUESTS);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  function submit() {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Missing info', 'Please add a subject and a message.');
      return;
    }
    setRequests((prev) => [{ id: Date.now().toString(), subject, status: 'open', created_at: new Date().toISOString() }, ...prev]);
    setSubject('');
    setMessage('');
    Alert.alert('Sent', 'Your support request has been sent to TransApple.');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="Support" title="Contact" subtitle="Reach the TransApple support team" gradient={gradients.sky} />

        <View style={styles.body}>
          <Card style={{ marginBottom: 20 }}>
            <Text style={styles.helper}>Having an issue or a question about the app? Send us a message and our team will get back to you.</Text>
            <Text style={styles.label}>Subject</Text>
            <TextInput style={styles.input} value={subject} onChangeText={setSubject} placeholder="e.g. Cannot generate report card" placeholderTextColor={colors.placeholder} />
            <Text style={styles.label}>Message</Text>
            <TextInput style={[styles.input, styles.textArea]} value={message} onChangeText={setMessage} placeholder="Describe the issue..." placeholderTextColor={colors.placeholder} multiline />
            <GradientButton label="Send to support" icon="send" gradient={gradients.sky} onPress={submit} style={{ marginTop: 16 }} />
          </Card>

          <Text style={styles.sectionTitle}>Your requests</Text>
          {requests.length === 0 ? (
            <Text style={styles.helper}>You haven't contacted support yet.</Text>
          ) : (
            requests.map((r, i) => (
              <Reveal key={r.id} index={i} style={{ marginBottom: 10 }}>
                <Card style={styles.row}>
                  <View style={styles.iconWrap}>
                    <Ionicons name="help-buoy" size={18} color={colors.primary} />
                  </View>
                  <View style={styles.rowMain}>
                    <Text style={styles.rowTitle}>{r.subject}</Text>
                    <Text style={styles.rowSub}>{new Date(r.created_at).toLocaleDateString()}</Text>
                  </View>
                  <Badge label={r.status} tone={r.status === 'open' ? 'warning' : 'success'} />
                </Card>
              </Reveal>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 40 },
  body: { paddingHorizontal: spacing.lg, marginTop: -18 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.ink, marginBottom: 12 },
  helper: { fontSize: 13, color: colors.inkFaint, marginBottom: 12, fontWeight: '500' },
  label: { fontSize: 12.5, fontWeight: '700', color: colors.inkSoft, marginBottom: 8, marginTop: 10 },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14.5,
    backgroundColor: colors.surfaceAlt,
    color: colors.ink,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowMain: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: '700', color: colors.ink },
  rowSub: { fontSize: 12, color: colors.inkFaint, marginTop: 2, fontWeight: '500' },
});
