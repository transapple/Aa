import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contact TransApple support</Text>
          <Text style={styles.helper}>Having an issue or a question about the app? Send us a message and our team will get back to you.</Text>
          <Text style={styles.label}>Subject</Text>
          <TextInput style={styles.input} value={subject} onChangeText={setSubject} placeholder="e.g. Cannot generate report card" />
          <Text style={styles.label}>Message</Text>
          <TextInput style={[styles.input, styles.textArea]} value={message} onChangeText={setMessage} placeholder="Describe the issue..." multiline />
          <TouchableOpacity style={styles.primaryButton} onPress={submit}>
            <Text style={styles.primaryButtonText}>Send to support</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Your requests</Text>
        {requests.length === 0 ? (
          <Text style={styles.helper}>You haven't contacted support yet.</Text>
        ) : (
          requests.map((r) => (
            <View key={r.id} style={styles.row}>
              <View style={styles.iconWrap}>
                <Ionicons name="help-buoy" size={18} color="#16274A" />
              </View>
              <View style={styles.rowMain}>
                <Text style={styles.rowTitle}>{r.subject}</Text>
                <Text style={styles.rowSub}>{new Date(r.created_at).toLocaleDateString()}</Text>
              </View>
              <View style={[styles.badge, r.status === 'open' ? styles.badgeAmber : styles.badgeGreen]}>
                <Text style={styles.badgeText}>{r.status}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEF2F9' },
  content: { padding: 16, paddingBottom: 32 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#16274A', marginBottom: 8 },
  helper: { fontSize: 13, color: '#6B7280', marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: '#FAFBFD', borderRadius: 10, padding: 12, fontSize: 14, borderWidth: 1, borderColor: '#E5E9F2' },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  primaryButton: { marginTop: 16, backgroundColor: '#16274A', borderRadius: 12, padding: 14, alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EEF2F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowMain: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: '700', color: '#16274A' },
  rowSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeAmber: { backgroundColor: '#FDF1DE' },
  badgeGreen: { backgroundColor: '#E4F5EE' },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#16274A', textTransform: 'capitalize' },
});
