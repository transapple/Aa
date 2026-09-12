import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const STATS = [
  { label: 'Students', value: '1,248' },
  { label: 'Teachers', value: '86' },
  { label: 'Attendance Today', value: '94%' },
  { label: 'Fees Collected', value: '$42,300' },
];

const MODULES = [
  { key: 'AcademicSetup', label: 'Academic Setup', emoji: '🏫' },
  { key: 'Students', label: 'Students', emoji: '🎓' },
  { key: 'Teachers', label: 'Teachers', emoji: '🧑‍🏫' },
  { key: 'Attendance', label: 'Attendance', emoji: '✅' },
  { key: 'Fees', label: 'Fees', emoji: '💳' },
  { key: 'Exams', label: 'Exams', emoji: '📝' },
  { key: 'Library', label: 'Library', emoji: '📚' },
  { key: 'Inventory', label: 'Inventory', emoji: '📦' },
  { key: 'Comms', label: 'Comms', emoji: '💬' },
  { key: 'ReportCards', label: 'Report Cards', emoji: '📊' },
  { key: 'ParentPortal', label: 'Parent Portal', emoji: '👪' },
  { key: 'AIAssistant', label: 'AI Assistant', emoji: '🤖' },
];

export default function DashboardScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.schoolName}>AiO Academy</Text>
          </View>
          <TouchableOpacity style={styles.bellButton}>
            <Text style={{ fontSize: 18 }}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsRow}
        >
          {STATS.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Modules grid */}
        <Text style={styles.sectionTitle}>Manage School</Text>
        <View style={styles.grid}>
          {MODULES.map((mod) => (
            <TouchableOpacity
              key={mod.key}
              style={styles.moduleCard}
              onPress={() => navigation.navigate(mod.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.moduleEmoji}>{mod.emoji}</Text>
              <Text style={styles.moduleLabel}>{mod.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEF2F9' },
  scrollContent: { padding: 18, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: { fontSize: 13, color: '#5B647A' },
  schoolName: { fontSize: 22, fontWeight: '800', color: '#16274A', marginTop: 2 },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statsRow: { gap: 12, paddingBottom: 8, paddingRight: 8 },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    minWidth: 130,
    marginRight: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statValue: { fontSize: 20, fontWeight: '800', color: '#16274A' },
  statLabel: { fontSize: 12, color: '#5B647A', marginTop: 4 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D2433',
    marginTop: 26,
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moduleCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  moduleEmoji: { fontSize: 26, marginBottom: 8 },
  moduleLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#1D2433',
    textAlign: 'center',
  },
});
