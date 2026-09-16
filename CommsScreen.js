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
import {
  ScreenHeader,
  Chip,
  Card,
  Badge,
  Tappable,
  Reveal,
  GradientButton,
  GhostButton,
  EmptyState,
  colors,
  gradients,
  radius,
  spacing,
  shadow,
} from '../theme/UI';

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
      <ScreenHeader eyebrow="Communication" title="Comms" subtitle="Announcements, meetings & parent chats" gradient={gradients.sky} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow} contentContainerStyle={{ paddingRight: 16 }}>
        {TABS.map((t) => (
          <Chip key={t.id} label={t.label} active={tab === t.id} activeGradient={gradients.sky} onPress={() => setTab(t.id)} />
        ))}
      </ScrollView>

      {tab === 'messages' && (
        <>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Messages</Text>
            <Tappable style={styles.addBtn} onPress={() => openMessageModal(null)}>
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.addBtnText}>Post</Text>
            </Tappable>
          </View>
          <FlatList
            data={messages}
            keyExtractor={(i) => i.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyState icon="megaphone-outline" title="No messages sent yet" />}
            renderItem={({ item, index }) => (
              <Reveal index={index} style={{ marginBottom: 10 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.row, shadow.soft]}
                  onPress={() => openMessageModal(item)}
                  onLongPress={() => deleteMessage(item)}
                >
                  <View style={[styles.iconWrap, { backgroundColor: `${colors.amber}18` }]}>
                    <Ionicons name="megaphone" size={18} color={colors.amber} />
                  </View>
                  <View style={styles.rowMain}>
                    <Text style={styles.rowTitle}>{item.title}</Text>
                    <Text style={styles.rowSub}>
                      {MESSAGE_TYPES.find((t) => t[0] === item.type)?.[1] || item.type} · {item.audience} · {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Reveal>
            )}
          />
        </>
      )}

      {tab === 'meeting' && (
        <>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Meetings</Text>
            <Tappable style={styles.addBtn} onPress={() => openMeetingModal(null)}>
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.addBtnText}>Schedule</Text>
            </Tappable>
          </View>
          <FlatList
            data={meetings}
            keyExtractor={(i) => i.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyState icon="calendar-outline" title="No meetings scheduled yet" />}
            renderItem={({ item, index }) => (
              <Reveal index={index} style={{ marginBottom: 10 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.row, shadow.soft]}
                  onPress={() => openMeetingModal(item)}
                  onLongPress={() => deleteMeeting(item)}
                >
                  <View style={[styles.iconWrap, { backgroundColor: `${colors.primary}18` }]}>
                    <Ionicons name="calendar" size={18} color={colors.primary} />
                  </View>
                  <View style={styles.rowMain}>
                    <Text style={styles.rowTitle}>{item.title}</Text>
                    <Text style={styles.rowSub}>
                      {item.meeting_date} · {item.location || 'No location set'} · {item.audience}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Reveal>
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
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyState icon="chatbubbles-outline" title="No parent chats yet" subtitle="Start one from a student profile." />}
            renderItem={({ item, index }) => (
              <Reveal index={index} style={{ marginBottom: 10 }}>
                <Card style={styles.row}>
                  <View style={[styles.iconWrap, { backgroundColor: `${colors.sky}18` }]}>
                    <Ionicons name="chatbubble-ellipses" size={18} color={colors.sky} />
                  </View>
                  <View style={styles.rowMain}>
                    <Text style={styles.rowTitle}>
                      {item.parent_name} {item.student_name ? <Text style={styles.rowSub}>— {item.student_name}</Text> : null}
                    </Text>
                    <Text style={styles.rowSub} numberOfLines={1}>
                      {item.last_message} · {new Date(item.date).toLocaleDateString()}
                    </Text>
                  </View>
                  {item.unread > 0 && <Badge label={`${item.unread} new`} tone="danger" />}
                </Card>
              </Reveal>
            )}
          />
        </>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                {modalKind === 'message' ? (editing ? 'Edit message' : 'Post a message') : editing ? 'Edit meeting' : 'Schedule a meeting'}
              </Text>

              {modalKind === 'message' && (
                <>
                  <Text style={styles.label}>Type</Text>
                  <View style={styles.chipRow}>
                    {MESSAGE_TYPES.map(([id, label]) => (
                      <Chip key={id} label={label} active={fType === id} activeGradient={gradients.sky} onPress={() => setFType(id)} />
                    ))}
                  </View>
                </>
              )}

              <Text style={styles.label}>Title</Text>
              <TextInput style={styles.input} value={fTitle} onChangeText={setFTitle} placeholder="Title" placeholderTextColor={colors.placeholder} />

              {modalKind === 'meeting' && (
                <>
                  <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
                  <TextInput style={styles.input} value={fDate} onChangeText={setFDate} placeholder="2026-10-01" placeholderTextColor={colors.placeholder} />
                  <Text style={styles.label}>Location</Text>
                  <TextInput style={styles.input} value={fLocation} onChangeText={setFLocation} placeholder="e.g. School Hall" placeholderTextColor={colors.placeholder} />
                </>
              )}

              <Text style={styles.label}>Audience</Text>
              <View style={styles.chipRow}>
                {AUDIENCES.map((a) => (
                  <Chip key={a} label={a} active={fAudience === a} activeGradient={gradients.sky} onPress={() => setFAudience(a)} />
                ))}
              </View>

              {modalKind === 'message' && (
                <>
                  <Text style={styles.label}>Message</Text>
                  <TextInput style={[styles.input, styles.textArea]} value={fMessage} onChangeText={setFMessage} placeholder="Message" placeholderTextColor={colors.placeholder} multiline />
                </>
              )}

              <View style={styles.modalButtons}>
                <GhostButton label="Cancel" onPress={() => setModalVisible(false)} style={{ flex: 1 }} />
                <GradientButton
                  label={editing ? 'Save changes' : modalKind === 'message' ? 'Post' : 'Schedule'}
                  icon="checkmark"
                  gradient={gradients.sky}
                  onPress={modalKind === 'message' ? saveMessage : saveMeeting}
                  style={{ flex: 1 }}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  pillRow: { paddingHorizontal: spacing.lg, marginTop: -16, maxHeight: 52 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, paddingBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.ink },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.sky, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill, gap: 4 },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 15,
  },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowMain: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: '700', color: colors.ink },
  rowSub: { fontSize: 12, color: colors.inkFaint, marginTop: 2, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(17,24,39,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.xl, maxHeight: '85%' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.ink, marginBottom: 16 },
  label: { fontSize: 12.5, fontWeight: '700', color: colors.inkSoft, marginBottom: 8, marginTop: 12 },
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
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 4 },
});
