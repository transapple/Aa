import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader, Card, Tappable, Reveal, colors, gradients, radius, spacing, shadow } from '../theme/UI';

// Mirrors the web app's NAV list minus the four bottom-tab items
// (Home, Students, Attendance, Fees) which live on the tab bar instead.
const MENU_ITEMS = [
  { key: 'AioAi', label: 'AiO ai', description: 'Ask questions about your school data', icon: 'sparkles', gradient: gradients.plum },
  { key: 'Exams', label: 'Exams', description: 'Schedules, marks & results', icon: 'document-text', gradient: gradients.plum },
  { key: 'Teachers', label: 'Staff', description: 'Teacher & staff records', icon: 'person-circle', gradient: gradients.rose },
  { key: 'AcademicSetup', label: 'Setup', description: 'Classes, terms & subjects', icon: 'options', gradient: gradients.teal },
  { key: 'Inventory', label: 'Inventory & Assets', description: 'School property & supplies', icon: 'cube', gradient: gradients.amber },
  { key: 'Library', label: 'Library', description: 'Books & borrowing records', icon: 'library', gradient: gradients.emerald },
  { key: 'SchoolHealth', label: 'School Health', description: 'Fees, attendance & performance rollup', icon: 'pulse', gradient: gradients.danger },
  { key: 'Comms', label: 'Comms', description: 'Messages, meetings & chat history', icon: 'megaphone', gradient: gradients.sky },
  { key: 'Account', label: 'Account', description: 'Your profile, staff & roles', icon: 'people', gradient: gradients.primary },
  { key: 'Contact', label: 'Contact TransApple', description: 'Get help from support', icon: 'help-buoy', gradient: gradients.teal },
  { key: 'Settings', label: 'Settings', description: 'School branding & preferences', icon: 'settings', gradient: gradients.ink },
  { key: 'Trash', label: 'Trash', description: 'Restore or permanently delete items', icon: 'trash', gradient: ['#6B7280', '#9CA3AF'] },
];

export default function MoreScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader eyebrow="Everything else" title="More" subtitle="Every module in one place" gradient={gradients.hero} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Reveal index={0} delay={50}>
          <Card style={styles.snapshotCard}>
            <View style={styles.snapshotTop}>
              <View>
                <Text style={styles.snapshotTitle}>School at a glance</Text>
                <Text style={styles.snapshotSub}>Everything you need is one tap away.</Text>
              </View>
              <View style={styles.liveDot}><View style={styles.liveDotInner} /></View>
            </View>
            <View style={styles.snapshotGrid}>
              <View style={styles.snapshotStat}><Text style={styles.snapshotValue}>248</Text><Text style={styles.snapshotLabel}>Students</Text></View>
              <View style={styles.snapshotStat}><Text style={styles.snapshotValue}>18</Text><Text style={styles.snapshotLabel}>Teachers</Text></View>
              <View style={styles.snapshotStat}><Text style={styles.snapshotValue}>12</Text><Text style={styles.snapshotLabel}>Classes</Text></View>
              <View style={styles.snapshotStat}><Text style={styles.snapshotValue}>22</Text><Text style={styles.snapshotLabel}>Subjects</Text></View>
            </View>
          </Card>
        </Reveal>
        <Text style={styles.sectionLabel}>School modules</Text>
        {MENU_ITEMS.map((item, i) => (
          <Reveal key={item.key} index={i} delay={100} style={{ marginBottom: 10 }}>
            <Tappable style={[styles.row, shadow.soft]} onPress={() => navigation.navigate(item.key)}>
              <View style={[styles.iconWrap, { backgroundColor: `${item.gradient[0]}18` }]}>
                <Ionicons name={item.icon} size={20} color={item.gradient[0]} />
              </View>
              <View style={styles.textWrap}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={19} color={colors.inkFaint} />
            </Tappable>
          </Reveal>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, marginTop: -14, paddingBottom: 30 },
  snapshotCard: { marginBottom: 16, padding: 16 },
  snapshotTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  snapshotTitle: { fontSize: 16, fontWeight: '800', color: colors.ink },
  snapshotSub: { fontSize: 12, color: colors.inkFaint, marginTop: 3, fontWeight: '500' },
  liveDot: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.successBg, alignItems: 'center', justifyContent: 'center' },
  liveDotInner: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.success },
  snapshotGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  snapshotStat: { flex: 1 },
  snapshotValue: { fontSize: 20, fontWeight: '800', color: colors.primary },
  snapshotLabel: { fontSize: 11, color: colors.inkFaint, marginTop: 2, fontWeight: '600' },
  sectionLabel: { fontSize: 12, fontWeight: '800', color: colors.inkFaint, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textWrap: { flex: 1 },
  label: { fontSize: 15, fontWeight: '700', color: colors.ink },
  description: { fontSize: 12, color: colors.inkFaint, marginTop: 2, fontWeight: '500' },
});
