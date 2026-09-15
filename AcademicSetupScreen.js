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

const SECTIONS = [
  { id: 'terms', label: 'Terms', emoji: '📅' },
  { id: 'classes', label: 'Classes', emoji: '🎓' },
  { id: 'subjects', label: 'Subjects', emoji: '📖' },
  { id: 'grades', label: 'Grades', emoji: '✅' },
];

const SEED = {
  terms: [
    { id: 't1', name: 'Term 1', start_date: '2026-02-01', end_date: '2026-04-30' },
    { id: 't2', name: 'Term 2', start_date: '2026-05-15', end_date: '2026-08-15' },
  ],
  classes: [
    { id: 'c1', name: 'Grade 9', section: 'A' },
    { id: 'c2', name: 'Grade 10', section: 'B' },
  ],
  subjects: [
    { id: 's1', name: 'Mathematics' },
    { id: 's2', name: 'English' },
  ],
  grades: [
    { id: 'g1', grade: 'A', min_score: 80, max_score: 100, remark: 'Excellent' },
    { id: 'g2', grade: 'B', min_score: 65, max_score: 79, remark: 'Very Good' },
  ],
};

function emptyItem(section) {
  switch (section) {
    case 'terms': return { name: '', start_date: '', end_date: '' };
    case 'classes': return { name: '', section: '' };
    case 'subjects': return { name: '' };
    case 'grades': return { grade: '', min_score: '', max_score: '', remark: '' };
    default: return {};
  }
}

export default function AcademicSetupScreen() {
  const [activeSection, setActiveSection] = useState(null);
  const [data, setData] = useState(SEED);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyItem(activeSection));
    setFormVisible(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm(item);
    setFormVisible(true);
  };

  const save = () => {
    if (editingId) {
      setData((prev) => ({
        ...prev,
        [activeSection]: prev[activeSection].map((i) => (i.id === editingId ? { ...i, ...form } : i)),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [activeSection]: [...prev[activeSection], { ...form, id: Date.now().toString() }],
      }));
    }
    setFormVisible(false);
  };

  const remove = (item) => {
    Alert.alert('Move to trash?', 'This item will be moved to trash.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Move to trash',
        style: 'destructive',
        onPress: () =>
          setData((prev) => ({
            ...prev,
            [activeSection]: prev[activeSection].filter((i) => i.id !== item.id),
          })),
      },
    ]);
  };

  // ---------- Top-level menu ----------
  if (!activeSection) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ padding: 16 }}>
          <Text style={styles.introTitle}>Academic Settings</Text>
          <Text style={styles.introSub}>
            Terms, classes, subjects and grading for the school.
          </Text>
        </View>
        <FlatList
          data={SECTIONS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.menuRow} onPress={() => setActiveSection(item.id)}>
              <Text style={styles.menuEmoji}>{item.emoji}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    );
  }

  const sectionLabel = SECTIONS.find((s) => s.id === activeSection).label;
  const items = data[activeSection];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={() => setActiveSection(null)}>
          <Text style={styles.backLink}>‹ Academic Settings</Text>
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>{sectionLabel}</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={<Text style={styles.emptyText}>Nothing here yet.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemCard} onPress={() => openEdit(item)}>
            <View style={{ flex: 1 }}>
              {activeSection === 'terms' && (
                <>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemSub}>{item.start_date} → {item.end_date}</Text>
                </>
              )}
              {activeSection === 'classes' && (
                <>
                  <Text style={styles.itemTitle}>{item.name} {item.section}</Text>
                </>
              )}
              {activeSection === 'subjects' && <Text style={styles.itemTitle}>{item.name}</Text>}
              {activeSection === 'grades' && (
                <>
                  <Text style={styles.itemTitle}>{item.grade}</Text>
                  <Text style={styles.itemSub}>
                    {item.min_score}–{item.max_score}% · {item.remark}
                  </Text>
                </>
              )}
            </View>
            <TouchableOpacity onPress={() => remove(item)}>
              <Text style={styles.dangerLinkText}>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={openAdd}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={formVisible} animationType="slide" onRequestClose={() => setFormVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.modalTitle}>
              {editingId ? 'Edit' : 'Add'} {sectionLabel.slice(0, -1) || sectionLabel}
            </Text>

            {activeSection === 'terms' && (
              <>
                <LabeledInput label="Term name" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} />
                <LabeledInput label="Start date" value={form.start_date} onChangeText={(v) => setForm({ ...form, start_date: v })} placeholder="YYYY-MM-DD" />
                <LabeledInput label="End date" value={form.end_date} onChangeText={(v) => setForm({ ...form, end_date: v })} placeholder="YYYY-MM-DD" />
              </>
            )}
            {activeSection === 'classes' && (
              <>
                <LabeledInput label="Class name" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} placeholder="e.g. Grade 9" />
                <LabeledInput label="Section" value={form.section} onChangeText={(v) => setForm({ ...form, section: v })} placeholder="e.g. A" />
              </>
            )}
            {activeSection === 'subjects' && (
              <LabeledInput label="Subject name" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} placeholder="e.g. Mathematics" />
            )}
            {activeSection === 'grades' && (
              <>
                <LabeledInput label="Grade" value={form.grade} onChangeText={(v) => setForm({ ...form, grade: v })} placeholder="e.g. A+" />
                <LabeledInput label="Min score" value={String(form.min_score ?? '')} onChangeText={(v) => setForm({ ...form, min_score: v })} keyboardType="numeric" />
                <LabeledInput label="Max score" value={String(form.max_score ?? '')} onChangeText={(v) => setForm({ ...form, max_score: v })} keyboardType="numeric" />
                <LabeledInput label="Remark" value={form.remark} onChangeText={(v) => setForm({ ...form, remark: v })} placeholder="e.g. Excellent" />
              </>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.ghostButton} onPress={() => setFormVisible(false)}>
                <Text style={styles.ghostButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={save}>
                <Text style={styles.primaryButtonText}>{editingId ? 'Save changes' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function LabeledInput({ label, value, onChangeText, placeholder, keyboardType }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9AA3B5"
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEF2F9' },
  introTitle: { fontSize: 20, fontWeight: '800', color: '#227A61' },
  introSub: { fontSize: 13, color: '#5B647A', marginTop: 6 },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    gap: 12,
  },
  menuEmoji: { fontSize: 20 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: '#1D2433' },
  chevron: { fontSize: 20, color: '#9AA3B5' },
  subHeader: { padding: 16, backgroundColor: '#fff' },
  backLink: { color: '#3E8EDE', fontWeight: '600', fontSize: 13, marginBottom: 8 },
  subHeaderTitle: { fontSize: 20, fontWeight: '800', color: '#16274A' },
  emptyText: { textAlign: 'center', color: '#9AA3B5', marginTop: 40 },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  itemTitle: { fontSize: 15, fontWeight: '700', color: '#1D2433' },
  itemSub: { fontSize: 12.5, color: '#5B647A', marginTop: 3 },
  dangerLinkText: { color: '#D6564F', fontWeight: '700', fontSize: 12.5 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#16274A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#16274A', marginBottom: 16 },
  field: { marginBottom: 14 },
  label: { fontSize: 12.5, fontWeight: '600', color: '#5B647A', marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: '#E4E8EF',
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 14.5,
    backgroundColor: '#FAFBFD',
    color: '#1D2433',
  },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 30 },
  ghostButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E4E8EF',
  },
  ghostButtonText: { fontWeight: '700', color: '#5B647A' },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#16274A',
  },
  primaryButtonText: { fontWeight: '700', color: '#fff' },
});
