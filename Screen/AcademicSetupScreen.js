import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ScreenHeader,
  Card,
  Tappable,
  Reveal,
  FAB,
  GradientButton,
  GhostButton,
  EmptyState,
  colors,
  gradients,
  radius,
  spacing,
} from '../theme/UI';

const SECTIONS = [
  { id: 'terms', label: 'Terms', icon: 'calendar' },
  { id: 'classes', label: 'Classes', icon: 'school' },
  { id: 'subjects', label: 'Subjects', icon: 'book' },
  { id: 'grades', label: 'Grades', icon: 'checkmark-done' },
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
        <ScreenHeader eyebrow="Setup" title="Academic Settings" subtitle="Terms, classes, subjects and grading" gradient={gradients.teal} />
        <FlatList
          data={SECTIONS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.lg, marginTop: -18 }}
          renderItem={({ item, index }) => (
            <Reveal index={index} style={{ marginBottom: 10 }}>
              <Card onPress={() => setActiveSection(item.id)} style={styles.menuRow}>
                <View style={[styles.menuIconWrap, { backgroundColor: `${colors.teal}18` }]}>
                  <Ionicons name={item.icon} size={19} color={colors.teal} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
              </Card>
            </Reveal>
          )}
        />
      </SafeAreaView>
    );
  }

  const sectionLabel = SECTIONS.find((s) => s.id === activeSection).label;
  const items = data[activeSection];

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        eyebrow="Academic Settings"
        title={sectionLabel}
        gradient={gradients.teal}
        right={
          <Tappable onPress={() => setActiveSection(null)} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color="#fff" />
          </Tappable>
        }
      />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 110, marginTop: -8 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState icon="file-tray-outline" title="Nothing here yet" />}
        renderItem={({ item, index }) => (
          <Reveal index={index} style={{ marginBottom: 10 }}>
            <Card onPress={() => openEdit(item)} style={styles.itemCard}>
              <View style={{ flex: 1 }}>
                {activeSection === 'terms' && (
                  <>
                    <Text style={styles.itemTitle}>{item.name}</Text>
                    <Text style={styles.itemSub}>{item.start_date} → {item.end_date}</Text>
                  </>
                )}
                {activeSection === 'classes' && (
                  <Text style={styles.itemTitle}>{item.name} {item.section}</Text>
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
              <Tappable onPress={() => remove(item)} style={styles.dangerLinkWrap}>
                <Text style={styles.dangerLinkText}>Delete</Text>
              </Tappable>
            </Card>
          </Reveal>
        )}
      />

      <FAB onPress={openAdd} gradient={gradients.teal} />

      <Modal visible={formVisible} animationType="slide" onRequestClose={() => setFormVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <ScreenHeader
            eyebrow={sectionLabel}
            title={`${editingId ? 'Edit' : 'Add'} ${sectionLabel.slice(0, -1) || sectionLabel}`}
            gradient={gradients.teal}
            right={
              <Tappable onPress={() => setFormVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#fff" />
              </Tappable>
            }
          />
          <ScrollView contentContainerStyle={styles.modalBody}>
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
              <GhostButton label="Cancel" onPress={() => setFormVisible(false)} style={{ flex: 1 }} />
              <GradientButton label={editingId ? 'Save changes' : 'Add'} icon="checkmark" gradient={gradients.teal} onPress={save} style={{ flex: 1 }} />
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
        placeholderTextColor={colors.placeholder}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  menuRow: { flexDirection: 'row', alignItems: 'center' },
  menuIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.ink },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  itemCard: { flexDirection: 'row', alignItems: 'center' },
  itemTitle: { fontSize: 15, fontWeight: '700', color: colors.ink },
  itemSub: { fontSize: 12.5, color: colors.inkFaint, marginTop: 3, fontWeight: '500' },
  dangerLinkWrap: { paddingHorizontal: 6, paddingVertical: 6 },
  dangerLinkText: { color: colors.danger, fontWeight: '700', fontSize: 12.5 },
  modalBody: { padding: spacing.lg, paddingBottom: 40 },
  field: { marginBottom: 14 },
  label: { fontSize: 12.5, fontWeight: '700', color: colors.inkSoft, marginBottom: 8, marginTop: 4 },
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
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
});
