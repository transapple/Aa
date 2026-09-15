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
        <TouchableOpacity
          key={opt}
          style={[styles.chip, value === opt && styles.chipActive]}
          onPress={() => onSelect(opt)}
        >
          <Text style={[styles.chipText, value === opt && styles.chipTextActive]}>{opt}</Text>
        </TouchableOpacity>
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
        {[
          ['exams', 'Exams'],
          ['results', 'Results'],
        ].map(([id, label]) => (
          <TouchableOpacity
            key={id}
            style={[styles.pill, tab === id && styles.pillActive]}
            onPress={() => setTab(id)}
          >
            <Text style={[styles.pillText, tab === id && styles.pillTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {tab === 'exams' && (
        <>
          <FlatList
            data={exams}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            ListEmptyComponent={<Text style={styles.emptyText}>No exams created yet.</Text>}
            renderItem={({ item }) => (
              <View style={styles.examCard}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>📝</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardSub}>
                    {item.class_name} · {item.term} · {item.date}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => openEnterResults(item)}>
                  <Text style={styles.linkText}>Enter results</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteExam(item)} style={{ marginLeft: 12 }}>
                  <Text style={styles.dangerLinkText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <TouchableOpacity style={styles.fab} onPress={openAddExam}>
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        </>
      )}

      {tab === 'results' && (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {exams.map((exam) => {
            const examScores = scores[exam.id] || {};
            const roster = ROSTER[exam.class_name] || [];
            const entered = Object.keys(examScores).length;
            return (
              <TouchableOpacity
                key={exam.id}
                style={styles.resultSummaryCard}
                onPress={() => openEnterResults(exam)}
              >
                <Text style={styles.cardTitle}>{exam.name}</Text>
                <Text style={styles.cardSub}>
                  {exam.class_name} · {entered}/{roster.length} scores entered
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Add exam modal */}
      <Modal visible={formVisible} animationType="slide" onRequestClose={() => setFormVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.modalTitle}>Add exam</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Exam name</Text>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(v) => setForm({ ...form, name: v })}
                placeholder="e.g. Midterm Exam"
                placeholderTextColor="#9AA3B5"
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
                placeholderTextColor="#9AA3B5"
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
              <TouchableOpacity style={styles.ghostButton} onPress={() => setFormVisible(false)}>
                <Text style={styles.ghostButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={saveExam}>
                <Text style={styles.primaryButtonText}>Add exam</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Enter results modal */}
      <Modal visible={resultsModalVisible} animationType="slide" onRequestClose={() => setResultsModalVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{resultsExam?.name}</Text>
            <Text style={styles.modalSubtitle}>
              {resultsExam?.class_name} · Max score {resultsExam?.max_score}
            </Text>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            {(ROSTER[resultsExam?.class_name] || []).map((student) => (
              <View key={student.id} style={styles.scoreRow}>
                <Text style={styles.studentName}>{student.name}</Text>
                <TextInput
                  style={styles.scoreInput}
                  keyboardType="numeric"
                  placeholder="—"
                  placeholderTextColor="#9AA3B5"
                  value={draftScores[student.id] !== undefined ? String(draftScores[student.id]) : ''}
                  onChangeText={(v) =>
                    setDraftScores((prev) => ({ ...prev, [student.id]: v }))
                  }
                />
              </View>
            ))}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.ghostButton} onPress={() => setResultsModalVisible(false)}>
                <Text style={styles.ghostButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={saveResults}>
                <Text style={styles.primaryButtonText}>Save results</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEF2F9' },
  pillRow: { paddingHorizontal: 16, paddingTop: 16, maxHeight: 52 },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E4E8EF',
  },
  pillActive: { backgroundColor: '#16274A', borderColor: '#16274A' },
  pillText: { fontSize: 13, fontWeight: '700', color: '#5B647A' },
  pillTextActive: { color: '#fff' },
  emptyText: { textAlign: 'center', color: '#9AA3B5', marginTop: 40 },
  examCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    marginHorizontal: 0,
    gap: 10,
  },
  resultSummaryCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECEDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1D2433' },
  cardSub: { fontSize: 12.5, color: '#5B647A', marginTop: 2 },
  linkText: { color: '#3E8EDE', fontWeight: '700', fontSize: 12.5 },
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
  modalHeader: { padding: 20, paddingBottom: 8, backgroundColor: '#fff' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#16274A' },
  modalSubtitle: { fontSize: 13, color: '#5B647A', marginTop: 4 },
  field: { marginBottom: 14 },
  label: { fontSize: 12.5, fontWeight: '600', color: '#5B647A', marginBottom: 6, marginTop: 4 },
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
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E4E8EF',
    backgroundColor: '#FAFBFD',
  },
  chipActive: { backgroundColor: '#16274A', borderColor: '#16274A' },
  chipText: { fontSize: 12.5, fontWeight: '600', color: '#5B647A' },
  chipTextActive: { color: '#fff' },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  studentName: { fontSize: 14.5, fontWeight: '700', color: '#1D2433' },
  scoreInput: {
    borderWidth: 1.5,
    borderColor: '#E4E8EF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    width: 70,
    textAlign: 'center',
    backgroundColor: '#FAFBFD',
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
