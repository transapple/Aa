import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ScreenHeader,
  StatCard,
  SectionTitle,
  Tappable,
  Reveal,
  colors,
  gradients,
  radius,
  spacing,
  shadow,
} from '../theme/UI';

// Placeholder summary numbers — wire these up to real data sources
// (StudentsScreen, AttendanceScreen, FeesScreen, etc.) once a shared
// data layer / API is in place.
const SUMMARY = {
  totalStudents: 2,
  presentToday: 0,
  feesCollectedThisTerm: 0,
  feesOutstanding: 0,
};

const QUICK_LINKS = [
  { key: 'Students', label: 'Students', icon: 'people', gradient: gradients.primary },
  { key: 'Attendance', label: 'Attendance', icon: 'checkmark-done', gradient: gradients.teal },
  { key: 'Fees', label: 'Fees', icon: 'cash', gradient: gradients.amber },
  { key: 'Exams', label: 'Exams', icon: 'document-text', gradient: gradients.plum, stack: 'More' },
  { key: 'Teachers', label: 'Staff', icon: 'person-circle', gradient: gradients.rose, stack: 'More' },
  { key: 'AcademicSetup', label: 'Setup', icon: 'options', gradient: gradients.teal, stack: 'More' },
  { key: 'Inventory', label: 'Inventory', icon: 'cube', gradient: gradients.amber, stack: 'More' },
  { key: 'Library', label: 'Library', icon: 'library', gradient: gradients.emerald, stack: 'More' },
  { key: 'SchoolHealth', label: 'School Health', icon: 'pulse', gradient: gradients.danger, stack: 'More' },
  { key: 'Comms', label: 'Comms', icon: 'megaphone', gradient: gradients.sky, stack: 'More' },
  { key: 'AioAi', label: 'AiO ai', icon: 'sparkles', gradient: gradients.plum, stack: 'More' },
  { key: 'Settings', label: 'Settings', icon: 'settings', gradient: gradients.ink, stack: 'More' },
];

export default function HomeScreen({ navigation }) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow="Dashboard"
          title="Welcome back 👋"
          subtitle={today}
          right={
            <View style={styles.headerBell}>
              <Ionicons name="notifications-outline" size={20} color="#fff" />
            </View>
          }
        />

        <View style={styles.body}>
          <View style={styles.statsGrid}>
            <StatCard index={0} label="Total students" value={SUMMARY.totalStudents} icon="people" gradient={gradients.primary} />
            <StatCard index={1} label="Present today" value={SUMMARY.presentToday} icon="checkmark-done" gradient={gradients.teal} />
            <StatCard index={2} label="Fees collected" value={`UGX ${SUMMARY.feesCollectedThisTerm}`} icon="cash" gradient={gradients.amber} />
            <StatCard index={3} label="Fees outstanding" value={`UGX ${SUMMARY.feesOutstanding}`} icon="alert-circle" gradient={gradients.danger} />
          </View>

          <SectionTitle>Quick links</SectionTitle>
          <View style={styles.linksGrid}>
            {QUICK_LINKS.map((link, i) => (
              <Reveal key={link.key} index={i} delay={120} style={styles.linkCardWrap}>
                <Tappable
                  style={[styles.linkCard, shadow.soft]}
                  onPress={() => {
                    if (link.stack === 'More') {
                      navigation.navigate('More', { screen: link.key });
                    } else {
                      navigation.navigate(link.key);
                    }
                  }}
                >
                  <View style={[styles.linkIconWrap, { backgroundColor: `${link.gradient[0]}18` }]}>
                    <Ionicons name={link.icon} size={21} color={link.gradient[0]} />
                  </View>
                  <Text style={styles.linkLabel}>{link.label}</Text>
                </Tappable>
              </Reveal>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 40 },
  headerBell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { paddingHorizontal: spacing.lg, marginTop: -18 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 4,
  },
  linksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  linkCardWrap: { width: '31%', marginBottom: 12 },
  linkCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
  },
  linkIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },
  linkLabel: { fontSize: 12, fontWeight: '700', color: colors.ink, textAlign: 'center' },
});
