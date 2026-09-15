import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TABS = [
  { id: 'messages', label: 'Messages' },
  { id: 'meeting', label: 'Meetings' },
  { id: 'chats', label: 'Chat History' },
];

const MESSAGE_TYPES = [
  ['announcement', 'Announcement'],
  ['event', 'Event'],
  ['emergency', 'Emergency'],
  ['reminder', 'Reminder'],
];

const AUDIENCES = ['Everyone', 'All parents', 'All staff', 'All students', 'Specific class'];

const SEED_MESSAGES = [
  {
    id: 'm1',
    type: 'announcement',
    title: 'Mid-term break dates',
    audience: 'Everyone',
    message: 'Mid-term break runs from the 20th to the 24th. School resumes on the 25th.',
    created_by: 'Admin',
    created_at: new Date().toISOString(),
  },
];

const SEED_MEETINGS = [
  {
    id: 'meet1',
    title: 'PTA General Meeting',
    meeting_date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    location: 'School Hall',
    audience: 'All parents',
  },
];

const SEED_CHAT_THREADS = [
  {
    id: 'c1',
    parent_name: 'Fatima Yusuf',
    student_name: 'Amina Yusuf',
    last_message: 'Thank you, I will send the fees tomorrow.',
    unread: 0,
    date: new Date().toISOString(),
  },
];

function emptyState(text) {
  return (
    <View style={{ padding: 24, alignItems: 'center' }}>
      <Text style={{ color: '#9AA3B5', fontSize: 13 }}>{text}</Text>
    </View>
  );
}

export default function CommsScreen() {
  const [tab, setTab] = useState('messages');
  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [meetings, setMeetings] = useState(SEED_MEETINGS);
  const [chats] = useState(SEED_CHAT_THREADS);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalKind, setModalKind] = useState('message'); // 'message' | 'meeting'
  const [editing, setEditing] = useState(null);

  const [fType, setFType] = useState('announcement');
  const [fTitle, setFTitle] = useState('');
  const [fAudience, setFAudience] = useState('Everyone');
  const [fMessage, setFMessage] = useState('');
  const [fDate, setFDate] = useState('');
  const [fLocation, setFLocation] = useState('');

  function openMessageModal(item) {
    setModalKind('message');
    setEditing(item);
    setFType(item?.type || 'announcement');
    setFTitle(item?.title || '');
    setFAudience(item?.audience || 'Everyone');
    setFMessage(item?.message || '');
    setModalVisible(true);
  }

  function openMeetingModal(item) {
    setModalKind('meeting');
    setEditing(item);
    setFTitle(item?.title || '');
    setFDate(item?.meeting_date || '');
    setFLocation(item?.location || '');
    setFAudience(item?.audience || 'All parents');
    setModalVisible(true);
  }

  function saveMessage() {
    if (!fTitle.trim() || !fMessage.trim()) {
      Alert.alert('Missing info', 'Title and message are required.');
      return;
    }
    if (editing) {
      setMessages((prev) => prev.map((m) => (m.id === editing.id ? { ...m, type: fType, title: fTitle, audience: fAudience, message: fMessage } : m)));
    } else {
      setMessages((prev) => [
        { id: Date.now().toString(), type: fType, title: fTitle, audience: fAudience, message: fMessage, created_by: 'You', created_at: new Date().toISOString() },
        ...prev,
      ]);
    }
    setModalVisible(false);
  }

  function saveMeeting() {
    if (!fTitle.trim() || !fDate.trim()) {
      Alert.alert('Missing info', 'Title and date are required.');
      return;
    }
    if (editing) {
      setMeetings((prev) => prev.map((m) => (m.id === editing.id ? { ...m, title: fTitle, meeting_date: fDate, location: fLocation, audience: fAudience } : m)));
    } else {
      setMeetings((prev) => [...prev, { id: Date.now().toString(), title: fTitle, meeting_date: fDate, location: fLocation, audience: fAudience }]);
    }
    setModalVisible(false);
  }

  function deleteMessage(item) {
    Alert.alert('Delete message?', item.title, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setMessages((prev) => prev.filter((m) => m.id !== item.id)) },
    ]);
  }

  function deleteMeeting(item) {
    Alert.alert('Delete meeting?', item.title, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setMeetings((prev) => prev.filter((m) => m.id !== item.id)) },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.pillRow}>
        {TABS.map((t) => (
          <TouchableOpacity key={t.id} onPress={() => setTab(t.id)} style={[styles.pill, tab === t.id && styles.pillActive]}>
            <Text style={[styles.pillText, tab === t.id && styles.pillTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'messages' && (
        <>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Messages</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => openMessageModal(null)}>
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.addBtnText}>Post</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={messages}
            keyExtractor={(i) => i.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={emptyState('No messages sent yet.')}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.row} onLongPress={() => deleteMessage(item)} onPress={() => openMessageModal(item)}>
                <View style={styles.iconWrap}>
                  <Ionicons name="megaphone" size={18} color="#c2410c" />
                </View>
                <View style={styles.rowMain}>
                  <Text style={styles.rowTitle}>{item.title}</Text>
                  <Text style={styles.rowSub}>
                    {MESSAGE_TYPES.find((t) => t[0] === item.type)?.[1] || item.type} · {item.audience} · {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {tab === 'meeting' && (
        <>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Meetings</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => openMeetingModal(null)}>
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.addBtnText}>Schedule</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={meetings}
            keyExtractor={(i) => i.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={emptyState('No meetings scheduled yet.')}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.row} onLongPress={() => deleteMeeting(item)} onPress={() => openMeetingModal(item)}>
                <View style={styles.iconWrap}>
                  <Ionicons name="calendar" size={18} color="#5B5FC7" />
                </View>
                <View style={styles.rowMain}>
                  <Text style={styles.rowTitle}>{item.title}</Text>
                  <Text style={styles.rowSub}>
                    {item.meeting_date} · {item.location || 'No location set'} · {item.audience}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {tab === 'chats' && (
        <>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Chat history</Text>
          </View>
          <FlatList
            data={chats}
            keyExtractor={(i) => i.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={emptyState('No parent chats yet — start one from a student profile.')}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <View style={styles.iconWrap}>
                  <Ionicons name="chatbubble-ellipses" size={18} color="#16274A" />
                </View>
                <View style={styles.rowMain}>
                  <Text style={styles.rowTitle}>
                    {item.parent_name} {item.student_name ? <Text style={styles.rowSub}>— {item.student_name}</Text> : null}
                  </Text>
                  <Text style={styles.rowSub} numberOfLines={1}>
                    {item.last_message} · {new Date(item.date).toLocaleDateString()}
                  </Text>
                </View>
                {item.unread > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.unread} new</Text>
                  </View>
                )}
              </View>
            )}
          />
        </>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView>
              <Text style={styles.modalTitle}>
                {modalKind === 'message' ? (editing ? 'Edit message' : 'Post a message') : editing ? 'Edit meeting' : 'Schedule a meeting'}
              </Text>

              {modalKind === 'message' && (
                <>
                  <Text style={styles.label}>Type</Text>
                  <View style={styles.chipRow}>
                    {MESSAGE_TYPES.map(([id, label]) => (
                      <TouchableOpacity key={id} style={[styles.chip, fType === id && styles.chipActive]} onPress={() => setFType(id)}>
                        <Text style={[styles.chipText, fType === id && styles.chipTextActive]}>{label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              <Text style={styles.label}>Title</Text>
              <TextInput style={styles.input} value={fTitle} onChangeText={setFTitle} placeholder="Title" />

              {modalKind === 'meeting' && (
                <>
                  <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
                  <TextInput style={styles.input} value={fDate} onChangeText={setFDate} placeholder="2026-10-01" />
                  <Text style={styles.label}>Location</Text>
                  <TextInput style={styles.input} value={fLocation} onChangeText={setFLocation} placeholder="e.g. School Hall" />
                </>
              )}

              <Text style={styles.label}>Audience</Text>
              <View style={styles.chipRow}>
                {AUDIENCES.map((a) => (
                  <TouchableOpacity key={a} style={[styles.chip, fAudience === a && styles.chipActive]} onPress={() => setFAudience(a)}>
                    <Text style={[styles.chipText, fAudience === a && styles.chipTextActive]}>{a}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {modalKind === 'message' && (
                <>
                  <Text style={styles.label}>Message</Text>
                  <TextInput style={[styles.input, styles.textArea]} value={fMessage} onChangeText={setFMessage} placeholder="Message" multiline />
                </>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryButton} onPress={modalKind === 'message' ? saveMessage : saveMeeting}>
                  <Text style={styles.primaryButtonText}>{editing ? 'Save changes' : modalKind === 'message' ? 'Post' : 'Schedule'}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEF2F9' },
  pillRow: { flexDirection: 'row', padding: 12, gap: 8, backgroundColor: '#fff' },
  pill: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#EEF2F9' },
  pillActive: { backgroundColor: '#16274A' },
  pillText: { fontSize: 13, fontWeight: '600', color: '#16274A' },
  pillTextActive: { color: '#fff' },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#16274A' },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16274A', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, gap: 4 },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEF2F9', marginRight: 12 },
  rowMain: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: '700', color: '#16274A' },
  rowSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  badge: { backgroundColor: '#FDECEC', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#D6564F' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '85%' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#16274A', marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#FAFBFD', borderRadius: 10, padding: 12, fontSize: 14, borderWidth: 1, borderColor: '#E5E9F2' },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, backgroundColor: '#FAFBFD', borderWidth: 1, borderColor: '#E5E9F2', marginBottom: 6 },
  chipActive: { backgroundColor: '#16274A', borderColor: '#16274A' },
  chipText: { fontSize: 12, fontWeight: '600', color: '#16274A' },
  chipTextActive: { color: '#fff' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 20 },
  cancelButton: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#EEF2F9', alignItems: 'center' },
  cancelButtonText: { fontWeight: '700', color: '#16274A' },
  primaryButton: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#16274A', alignItems: 'center' },
  primaryButtonText: { fontWeight: '700', color: '#fff' },
});
