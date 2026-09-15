import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mirrors the web app's "School Health" dashboard: a computed rollup across
// fees, attendance, and exam performance. This screen uses local mock
// numbers — once a shared data layer exists, replace MOCK with real
// aggregates the same way renderSchoolHealth() does on the web.
const MOCK = {
  totalCollected: 4250000,
  outstanding: 860000,
  currency: 'UGX ',
  topClassName: 'Grade 10',
  topClassPct: 78.4,
  totalStudents: 2,
  totalTeachers: 0,
  lowAttendanceStudents: [],
  teachersPresentToday: 0,
  teachersAbsentToday: 0,
  overallTeacherAttendanceRate: null,
};

function StatBox({ label, value, color }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, color ? { color } : null]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function SchoolHealthScreen() {
  const d = MOCK;
  const lowCount = d.lowAttendanceStudents.length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>School health overview</Text>
        <View style={styles.grid}>
          <StatBox label="Total fees collected" value={`${d.currency}${d.totalCollected.toLocaleString()}`} />
          <StatBox
            label="Outstanding fee balances"
            value={`${d.currency}${d.outstanding.toLocaleString()}`}
            color={d.outstanding > 0 ? '#D6564F' : '#2E9E7C'}
          />
          <StatBox label="Top performing class" value={`${d.topClassName} · ${d.topClassPct.toFixed(1)}%`} />
          <StatBox label="Total students" value={d.totalStudents} />
          <StatBox
            label="Students with low attendance"
            value={lowCount}
            color={lowCount ? '#D6564F' : '#2E9E7C'}
          />
          <StatBox label="Total teachers" value={d.totalTeachers} />
          <StatBox label="Teachers present today" value={d.teachersPresentToday} color="#2E9E7C" />
          <StatBox
            label="Teachers absent today"
            value={d.teachersAbsentToday}
            color={d.teachersAbsentToday ? '#D6564F' : '#16274A'}
          />
        </View>

        <Text style={styles.sectionTitle}>Teacher attendance performance</Text>
        <View style={styles.card}>
          {d.overallTeacherAttendanceRate === null ? (
            <Text style={styles.emptyText}>No staff attendance recorded in the last 30 days.</Text>
          ) : (
            <Text style={styles.emptyText}>
              Overall rate: {d.overallTeacherAttendanceRate.toFixed(1)}%
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.lowAttCard} disabled={!lowCount}>
          <Ionicons name="alert-circle-outline" size={18} color={lowCount ? '#D6564F' : '#9AA3B5'} />
          <Text style={[styles.lowAttText, { color: lowCount ? '#D6564F' : '#9AA3B5' }]}>
            {lowCount ? `${lowCount} student(s) with low attendance — tap to view` : 'No students currently below the attendance threshold'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEF2F9' },
  content: { padding: 16, paddingBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#16274A', marginBottom: 12, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statBox: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  statValue: { fontSize: 17, fontWeight: '800', color: '#16274A' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12 },
  emptyText: { fontSize: 13, color: '#6B7280' },
  lowAttCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  lowAttText: { fontSize: 13, fontWeight: '600', marginLeft: 8, flex: 1 },
});
