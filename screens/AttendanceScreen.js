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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ScreenHeader,
  Card,
  Avatar,
  Reveal,
  Tappable,
  GradientButton,
  GhostButton,
  colors,
  gradients,
  radius,
  spacing,
  shadow,
} from '../theme/UI';

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

  const takenCount = CLASSES.filter((c) => !!records[keyFor(c.id)]).length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        eyebrow={`${takenCount}/${CLASSES.length} classes taken`}
        title="Attendance"
        subtitle="Tap a class to take or review the register"
        gradient={gradients.teal}
      />

      <View style={styles.dateWrap}>
        <Ionicons name="calendar-outline" size={17} color={colors.inkFaint} style={{ marginRight: 8 }} />
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
        contentContainerStyle={{ padding: spacing.lg, paddingTop: 6 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
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
          const pct = taken && roster.length ? presentCount / roster.length : 0;
          return (
            <Reveal index={index} style={{ marginBottom: 10 }}>
              <Card onPress={() => openClass(item)}>
                <View style={styles.classRow}>
                  <Avatar name={item.name} color={colors.teal} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.classTitle}>{item.name}</Text>
                    <Text style={styles.classSub}>
                      {roster.length} student{roster.length === 1 ? '' : 's'}
                      {taken ? ` · ${presentCount} present, ${absentCount} absent` : ''}
                    </Text>
                  </View>
                  {taken ? (
                    <View style={styles.takenBadge}>
                      <Ionicons name="checkmark-circle" size={14} color="#0F7A50" />
                      <Text style={styles.takenBadgeText}>Taken</Text>
                    </View>
                  ) : (
                    <View style={styles.takeButton}>
                      <Text style={styles.takeButtonText}>Take</Text>
                    </View>
                  )}
                </View>
                {taken && roster.length > 0 && (
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
                  </View>
                )}
              </Card>
            </Reveal>
          );
        }}
      />

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <ScreenHeader
            eyebrow={date}
            title={activeClass?.name || ''}
            gradient={gradients.teal}
            right={
              <Tappable onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#fff" />
              </Tappable>
            }
          />
          <ScrollView contentContainerStyle={styles.modalBody}>
            {(ROSTER[activeClass?.id] || []).map((student, i) => {
              const mark = draftMarks[student.id];
              return (
                <Reveal index={i} key={student.id} style={styles.studentCard}>
                  <View style={styles.studentTopRow}>
                    <Avatar name={student.name} size={38} />
                    <Text style={styles.studentName}>{student.name}</Text>
                  </View>
                  <View style={styles.markButtons}>
                    <Tappable
                      style={[styles.markBtn, mark === 'present' && styles.markPresentOn]}
                      onPress={() => setMark(student.id, 'present')}
                    >
                      <Ionicons name="checkmark" size={15} color={mark === 'present' ? '#0F7A50' : colors.inkFaint} />
                      <Text style={[styles.markBtnText, mark === 'present' && { color: '#0F7A50' }]}>
                        Present
                      </Text>
                    </Tappable>
                    <Tappable
                      style={[styles.markBtn, mark === 'absent' && styles.markAbsentOn]}
                      onPress={() => setMark(student.id, 'absent')}
                    >
                      <Ionicons name="close" size={15} color={mark === 'absent' ? '#B91C1C' : colors.inkFaint} />
                      <Text style={[styles.markBtnText, mark === 'absent' && { color: '#B91C1C' }]}>
                        Absent
                      </Text>
                    </Tappable>
                  </View>
                </Reveal>
              );
            })}

            <View style={styles.modalActions}>
              <GhostButton label="Close" onPress={() => setModalVisible(false)} style={{ flex: 1 }} />
              {readOnly ? (
                <GradientButton label="Edit" icon="pencil" gradient={gradients.teal} onPress={() => setReadOnly(false)} style={{ flex: 1 }} />
              ) : (
                <GradientButton label="Save" icon="checkmark" gradient={gradients.teal} onPress={saveAttendance} style={{ flex: 1 }} />
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  dateWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: -22,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...shadow.card,
  },
  dateInput: { flex: 1, fontSize: 14.5, color: colors.ink, fontWeight: '600' },
  classRow: { flexDirection: 'row', alignItems: 'center' },
  classTitle: { fontSize: 15, fontWeight: '700', color: colors.ink },
  classSub: { fontSize: 12.5, color: colors.inkFaint, marginTop: 2, fontWeight: '500' },
  takenBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.successBg, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill },
  takenBadgeText: { color: '#0F7A50', fontWeight: '800', fontSize: 11.5 },
  takeButton: { backgroundColor: colors.teal, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill },
  takeButtonText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  progressTrack: { height: 5, borderRadius: 3, backgroundColor: colors.border, marginTop: 12, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.teal, borderRadius: 3 },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalBody: { padding: spacing.lg, paddingBottom: 30 },
  studentCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 14, marginBottom: 10, ...shadow.soft },
  studentTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  studentName: { fontSize: 15, fontWeight: '700', color: colors.ink },
  markButtons: { flexDirection: 'row', gap: 10 },
  markBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 11,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  markPresentOn: { backgroundColor: colors.successBg, borderColor: colors.success },
  markAbsentOn: { backgroundColor: colors.dangerBg, borderColor: colors.danger },
  markBtnText: { fontWeight: '700', color: colors.inkFaint, fontSize: 13 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 10, marginBottom: 20 },
});
