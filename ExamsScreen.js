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
  Chip,
  Card,
  FAB,
  Reveal,
  Tappable,
  GradientButton,
  GhostButton,
  EmptyState,
  colors,
  gradients,
  radius,
  spacing,
  shadow,
} from '../theme/UI';

const CLASSES = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
const TERMS = ['Term 1', 'Term 2', 'Term 3'];

const SEED_EXAMS = [
  { id: 'e1', name: 'Midterm Exam', class_name: 'Grade 9', term: 'Term 1', date: '2026-03-10', max_score: 100 },
  { id: 'e2', name: 'End of Term', class_name: 'Grade 10', term: 'Term 1', date: '2026-04-02', max_score: 100 },
];

const ROSTER = {
  'Grade 8': [{ id: 's1', name: 'Grace Okello' }],
  'Grade 9': [{ id: 's2', name: 'Amina Yusuf' }, { id: 's3', name: 'David Kato' }],
  'Grade 10': [{ id: 's4', name: 'John Mensah' }],
  'Grade 11': [{ id: 's5', name: 'Ivan Ssekandi' }],
  'Grade 12': [{ id: 's6', name: 'Ruth Achieng' }],
};

function emptyExam() {
  return { id: null, name: '', class_name: '', term: 'Term 1', date: '', max_score: '100' };
}

function ChipRow({ options, value, onSelect }) {
  return (
    <View style={styles.chipRow}>
      {options.map((opt) => (
        <Chip key={opt} label={opt} active={value === opt} activeGradient={gradients.plum} onPress={() => onSelect(opt)} />
      ))}
    </View>
  );
}

export default function ExamsScreen() {
  const [tab, setTab] = useState('exams'); // exams | results
  const [exams, setExams] = useState(SEED_EXAMS);
  const [scores, setScores] = useState({}); // { examId: { studentId: score } }

  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState(emptyExam());

  const [resultsExam, setResultsExam] = useState(null);
  const [resultsModalVisible, setResultsModalVisible] = useState(false);
  const [draftScores, setDraftScores] = useState({});

  const openAddExam = () => {
    setForm(emptyExam());
    setFormVisible(true);
  };

  const saveExam = () => {
    if (!form.name.trim() || !form.class_name || !form.date.trim()) {
      Alert.alert('Missing info', 'Name, class, and date are required.');
      return;
    }
    setExams((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    setFormVisible(false);
  };

  const deleteExam = (exam) => {
    Alert.alert('Move to trash?', `Move "${exam.name}" to trash?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Move to trash',
        style: 'destructive',
        onPress: () => setExams((prev) => prev.filter((e) => e.id !== exam.id)),
      },
    ]);
  };

  const openEnterResults = (exam) => {
    setResultsExam(exam);
    setDraftScores(scores[exam.id] ? { ...scores[exam.id] } : {});
    setResultsModalVisible(true);
  };

  const saveResults = () => {
    setScores((prev) => ({ ...prev, [resultsExam.id]: draftScores }));
    setResultsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader eyebrow={`${exams.length} scheduled`} title="Exams" subtitle="Schedules, marks & results" gradient={gradients.plum} />

      <View style={styles.pillRowWrap}>
        <Chip label="Exams" active={tab === 'exams'} activeGradient={gradients.plum} onPress={() => setTab('exams')} />
        <Chip label="Results" active={tab === 'results'} activeGradient={gradients.plum} onPress={() => setTab('results')} />
      </View>

      {tab === 'exams' && (
        <>
          <FlatList
            data={exams}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyState icon="document-text-outline" title="No exams created yet" subtitle="Tap the + button to schedule your first exam." />}
            renderItem={({ item, index }) => (
              <Reveal index={index} style={{ marginBottom: 10 }}>
                <Card>
                  <View style={styles.examRow}>
                    <View style={styles.examIconWrap}>
                      <Ionicons name="document-text" size={19} color={colors.violet} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.cardSub}>
                        {item.class_name} · {item.term} · {item.date}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.examActions}>
                    <Tappable onPress={() => openEnterResults(item)} style={styles.linkBtn}>
                      <Ionicons name="create-outline" size={14} color={colors.sky} />
                      <Text style={styles.linkText}>Enter results</Text>
                    </Tappable>
                    <Tappable onPress={() => deleteExam(item)} style={styles.linkBtn}>
                      <Ionicons name="trash-outline" size={14} color={colors.danger} />
                      <Text style={styles.dangerLinkText}>Delete</Text>
                    </Tappable>
                  </View>
                </Card>
              </Reveal>
            )}
          />
          <FAB onPress={openAddExam} gradient={gradients.plum} />
        </>
      )}

      {tab === 'results' && (
        <ScrollView contentContainerStyle={{ padding: spacing.lg }} showsVerticalScrollIndicator={false}>
          {exams.map((exam, i) => {
            const examScores = scores[exam.id] || {};
            const roster = ROSTER[exam.class_name] || [];
            const entered = Object.keys(examScores).length;
            const pct = roster.length ? entered / roster.length : 0;
            return (
              <Reveal index={i} key={exam.id} style={{ marginBottom: 10 }}>
                <Card onPress={() => openEnterResults(exam)}>
                  <Text style={styles.cardTitle}>{exam.name}</Text>
                  <Text style={styles.cardSub}>
                    {exam.class_name} · {entered}/{roster.length} scores entered
                  </Text>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
                  </View>
                </Card>
              </Reveal>
            );
          })}
        </ScrollView>
      )}

      {/* Add exam modal */}
      <Modal visible={formVisible} animationType="slide" onRequestClose={() => setFormVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <ScreenHeader
            eyebrow="New exam"
            title="Add exam"
            gradient={gradients.plum}
            right={
              <Tappable onPress={() => setFormVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#fff" />
              </Tappable>
            }
          />
          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.field}>
              <Text style={styles.label}>Exam name</Text>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(v) => setForm({ ...form, name: v })}
                placeholder="e.g. Midterm Exam"
                placeholderTextColor={colors.placeholder}
              />
            </View>

            <Text style={styles.label}>Class</Text>
            <ChipRow options={CLASSES} value={form.class_name} onSelect={(v) => setForm({ ...form, class_name: v })} />

            <Text style={styles.label}>Term</Text>
            <ChipRow options={TERMS} value={form.term} onSelect={(v) => setForm({ ...form, term: v })} />

            <View style={styles.field}>
              <Text style={styles.label}>Date</Text>
              <TextInput
                style={styles.input}
                value={form.date}
                onChangeText={(v) => setForm({ ...form, date: v })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.placeholder}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Max score</Text>
              <TextInput
                style={styles.input}
                value={String(form.max_score)}
                onChangeText={(v) => setForm({ ...form, max_score: v })}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalActions}>
              <GhostButton label="Cancel" onPress={() => setFormVisible(false)} style={{ flex: 1 }} />
              <GradientButton label="Add exam" icon="checkmark" gradient={gradients.plum} onPress={saveExam} style={{ flex: 1 }} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Enter results modal */}
      <Modal visible={resultsModalVisible} animationType="slide" onRequestClose={() => setResultsModalVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <ScreenHeader
            eyebrow={`Max score ${resultsExam?.max_score ?? ''}`}
            title={resultsExam?.name || ''}
            subtitle={resultsExam?.class_name}
            gradient={gradients.plum}
            right={
              <Tappable onPress={() => setResultsModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#fff" />
              </Tappable>
            }
          />
          <ScrollView contentContainerStyle={styles.modalBody}>
            {(ROSTER[resultsExam?.class_name] || []).map((student, i) => (
              <Reveal index={i} key={student.id} style={[styles.scoreRow, shadow.soft]}>
                <Text style={styles.studentName}>{student.name}</Text>
                <TextInput
                  style={styles.scoreInput}
                  keyboardType="numeric"
                  placeholder="—"
                  placeholderTextColor={colors.placeholder}
                  value={draftScores[student.id] !== undefined ? String(draftScores[student.id]) : ''}
                  onChangeText={(v) =>
                    setDraftScores((prev) => ({ ...prev, [student.id]: v }))
                  }
                />
              </Reveal>
            ))}

            <View style={styles.modalActions}>
              <GhostButton label="Close" onPress={() => setResultsModalVisible(false)} style={{ flex: 1 }} />
              <GradientButton label="Save results" icon="checkmark" gradient={gradients.plum} onPress={saveResults} style={{ flex: 1 }} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  pillRowWrap: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginTop: -20, marginBottom: 10 },
  examRow: { flexDirection: 'row', alignItems: 'center' },
  examIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F1ECFE', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.ink },
  cardSub: { fontSize: 12.5, color: colors.inkFaint, marginTop: 2, fontWeight: '500' },
  examActions: { flexDirection: 'row', gap: 18, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  linkBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  linkText: { color: colors.sky, fontWeight: '700', fontSize: 12.5 },
  dangerLinkText: { color: colors.danger, fontWeight: '700', fontSize: 12.5 },
  progressTrack: { height: 5, borderRadius: 3, backgroundColor: colors.border, marginTop: 12, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.violet, borderRadius: 3 },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalBody: { padding: spacing.lg, paddingBottom: 30 },
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
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 10,
  },
  studentName: { fontSize: 14.5, fontWeight: '700', color: colors.ink },
  scoreInput: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    width: 70,
    textAlign: 'center',
    backgroundColor: colors.surfaceAlt,
    fontWeight: '700',
    color: colors.ink,
  },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 20 },
});
