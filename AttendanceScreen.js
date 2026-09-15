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
} from 'react-native';

const CLASSES = [
  { id: 'c1', name: 'Grade 8' },
  { id: 'c2', name: 'Grade 9' },
  { id: 'c3', name: 'Grade 10' },
  { id: 'c4', name: 'Grade 11' },
  { id: 'c5', name: 'Grade 12' },
];

const ROSTER = {
  c1: [{ id: 's1', name: 'Grace Okello' }, { id: 's2', name: 'Brian Ouma' }],
  c2: [{ id: 's3', name: 'Amina Yusuf' }, { id: 's4', name: 'David Kato' }],
  c3: [{ id: 's5', name: 'John Mensah' }, { id: 's6', name: 'Sarah Nabirye' }],
  c4: [{ id: 's7', name: 'Ivan Ssekandi' }],
  c5: [{ id: 's8', name: 'Ruth Achieng' }, { id: 's9', name: 'Michael Otieno' }],
};

function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function AttendanceScreen() {
  const [date, setDate] = useState(todayStr());
  // records: { "classId|date": { studentId: 'present' | 'absent' } }
  const [records, setRecords] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [activeClass, setActiveClass] = useState(null);
  const [draftMarks, setDraftMarks] = useState({});
  const [readOnly, setReadOnly] = useState(false);

  const keyFor = (classId) => `${classId}|${date}`;

  const openClass = (cls) => {
    const key = keyFor(cls.id);
    const existing = records[key];
    setActiveClass(cls);
    setDraftMarks(existing ? { ...existing } : {});
    setReadOnly(!!existing);
    setModalVisible(true);
  };

  const setMark = (studentId, status) => {
    if (readOnly) return;
    setDraftMarks((prev) => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = () => {
    const key = keyFor(activeClass.id);
    setRecords((prev) => ({ ...prev, [key]: draftMarks }));
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.dateInput}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />
      </View>

      <FlatList
        data={CLASSES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const roster = ROSTER[item.id] || [];
          const key = keyFor(item.id);
          const taken = !!records[key];
          let presentCount = 0;
          let absentCount = 0;
          if (taken) {
            roster.forEach((s) => {
              if (records[key][s.id] === 'present') presentCount++;
              if (records[key][s.id] === 'absent') absentCount++;
            });
          }
          return (
            <TouchableOpacity style={styles.classCard} onPress={() => openClass(item)}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name.charAt(item.name.length - 2)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.classTitle}>{item.name}</Text>
                <Text style={styles.classSub}>
                  {roster.length} student{roster.length === 1 ? '' : 's'}
                  {taken ? ` · ${presentCount} present, ${absentCount} absent` : ''}
                </Text>
              </View>
              {taken ? (
                <View style={styles.takenBadge}>
                  <Text style={styles.takenBadgeText}>Taken ✓</Text>
                </View>
              ) : (
                <View style={styles.takeButton}>
                  <Text style={styles.takeButtonText}>Take</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{activeClass?.name}</Text>
            <Text style={styles.modalSubtitle}>{date}</Text>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            {(ROSTER[activeClass?.id] || []).map((student) => {
              const mark = draftMarks[student.id];
              return (
                <View key={student.id} style={styles.studentRow}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <View style={styles.markButtons}>
                    <TouchableOpacity
                      style={[styles.markBtn, mark === 'present' && styles.markPresentOn]}
                      onPress={() => setMark(student.id, 'present')}
                    >
                      <Text style={[styles.markBtnText, mark === 'present' && styles.markBtnTextOn]}>
                        Present
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.markBtn, mark === 'absent' && styles.markAbsentOn]}
                      onPress={() => setMark(student.id, 'absent')}
                    >
                      <Text style={[styles.markBtnText, mark === 'absent' && styles.markBtnTextOn]}>
                        Absent
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.ghostButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.ghostButtonText}>Close</Text>
              </TouchableOpacity>
              {readOnly ? (
                <TouchableOpacity style={styles.primaryButton} onPress={() => setReadOnly(false)}>
                  <Text style={styles.primaryButtonText}>Edit</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.primaryButton} onPress={saveAttendance}>
                  <Text style={styles.primaryButtonText}>Save</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEF2F9' },
  topBar: { padding: 16, backgroundColor: '#fff' },
  label: { fontSize: 12.5, fontWeight: '600', color: '#5B647A', marginBottom: 6 },
  dateInput: {
    borderWidth: 1.5,
    borderColor: '#E4E8EF',
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 14.5,
    backgroundColor: '#FAFBFD',
  },
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FDF1DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontWeight: '800', color: '#A06A13', fontSize: 15 },
  classTitle: { fontSize: 15, fontWeight: '700', color: '#1D2433' },
  classSub: { fontSize: 12.5, color: '#5B647A', marginTop: 2 },
  takenBadge: { backgroundColor: '#E4F5EE', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  takenBadgeText: { color: '#227A61', fontWeight: '700', fontSize: 11.5 },
  takeButton: { backgroundColor: '#16274A', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  takeButtonText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  modalHeader: { padding: 20, paddingBottom: 8, backgroundColor: '#fff' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#16274A' },
  modalSubtitle: { fontSize: 13, color: '#5B647A', marginTop: 4 },
  studentRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  studentName: { fontSize: 15, fontWeight: '700', color: '#1D2433', marginBottom: 10 },
  markButtons: { flexDirection: 'row', gap: 10 },
  markBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E4E8EF',
  },
  markPresentOn: { backgroundColor: '#E4F5EE', borderColor: '#2E9E7C' },
  markAbsentOn: { backgroundColor: '#FDECEC', borderColor: '#D6564F' },
  markBtnText: { fontWeight: '700', color: '#5B647A', fontSize: 13 },
  markBtnTextOn: { color: '#1D2433' },
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
