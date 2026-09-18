import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader, Tappable, Reveal, colors, gradients, radius, spacing, shadow } from '../theme/UI';

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
