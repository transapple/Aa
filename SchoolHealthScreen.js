import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ScreenHeader,
  StatCard,
  SectionTitle,
  Card,
  Tappable,
  colors,
  gradients,
  radius,
  spacing,
  shadow,
} from '../theme/UI';

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

export default function SchoolHealthScreen() {
  const d = MOCK;
  const lowCount = d.lowAttendanceStudents.length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="Overview" title="School Health" subtitle="Fees, attendance & performance at a glance" gradient={gradients.danger} />

        <View style={styles.body}>
          <SectionTitle>School health overview</SectionTitle>
          <View style={styles.grid}>
            <StatCard index={0} label="Total fees collected" value={`${d.currency}${d.totalCollected.toLocaleString()}`} icon="cash" gradient={gradients.amber} />
            <StatCard
              index={1}
              label="Outstanding fee balances"
              value={`${d.currency}${d.outstanding.toLocaleString()}`}
              icon="alert-circle"
              gradient={d.outstanding > 0 ? gradients.danger : gradients.emerald}
            />
            <StatCard index={2} label="Top performing class" value={`${d.topClassName} · ${d.topClassPct.toFixed(1)}%`} icon="trophy" gradient={gradients.plum} />
            <StatCard index={3} label="Total students" value={d.totalStudents} icon="people" gradient={gradients.primary} />
            <StatCard
              index={4}
              label="Students with low attendance"
              value={lowCount}
              icon="trending-down"
              gradient={lowCount ? gradients.danger : gradients.emerald}
            />
            <StatCard index={5} label="Total teachers" value={d.totalTeachers} icon="person" gradient={gradients.rose} />
            <StatCard index={6} label="Teachers present today" value={d.teachersPresentToday} icon="checkmark-done" gradient={gradients.emerald} />
            <StatCard
              index={7}
              label="Teachers absent today"
              value={d.teachersAbsentToday}
              icon="close-circle"
              gradient={d.teachersAbsentToday ? gradients.danger : gradients.ink}
            />
          </View>

          <SectionTitle>Teacher attendance performance</SectionTitle>
          <Card style={{ marginBottom: 16 }}>
            {d.overallTeacherAttendanceRate === null ? (
              <Text style={styles.emptyText}>No staff attendance recorded in the last 30 days.</Text>
            ) : (
              <Text style={styles.emptyText}>
                Overall rate: {d.overallTeacherAttendanceRate.toFixed(1)}%
              </Text>
            )}
          </Card>

          <Tappable disabled={!lowCount} style={[styles.lowAttCard, shadow.soft]}>
            <Ionicons name="alert-circle-outline" size={18} color={lowCount ? colors.danger : colors.inkFaint} />
            <Text style={[styles.lowAttText, { color: lowCount ? colors.danger : colors.inkFaint }]}>
              {lowCount ? `${lowCount} student(s) with low attendance — tap to view` : 'No students currently below the attendance threshold'}
            </Text>
          </Tappable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 40 },
  body: { paddingHorizontal: spacing.lg, marginTop: -18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 4 },
  emptyText: { fontSize: 13, color: colors.inkFaint, fontWeight: '500' },
  lowAttCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    gap: 8,
  },
  lowAttText: { fontSize: 13, fontWeight: '600', marginLeft: 8, flex: 1 },
});
