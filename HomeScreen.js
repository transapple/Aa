import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  { key: 'Students', label: 'Students', icon: 'people', color: '#16274A' },
  { key: 'Attendance', label: 'Attendance', icon: 'checkmark-done', color: '#2E9E7C' },
  { key: 'Fees', label: 'Fees', icon: 'cash', color: '#C08A2E' },
  { key: 'Exams', label: 'Exams', icon: 'document-text', color: '#5B5FC7', stack: 'More' },
  { key: 'Teachers', label: 'Staff', icon: 'person-circle', color: '#D6564F', stack: 'More' },
  { key: 'AcademicSetup', label: 'Setup', icon: 'options', color: '#0e9488', stack: 'More' },
  { key: 'Inventory', label: 'Inventory', icon: 'cube', color: '#8a5a2b', stack: 'More' },
  { key: 'Library', label: 'Library', icon: 'library', color: '#166534', stack: 'More' },
  { key: 'SchoolHealth', label: 'School Health', icon: 'pulse', color: '#e11d48', stack: 'More' },
  { key: 'Comms', label: 'Comms', icon: 'megaphone', color: '#c2410c', stack: 'More' },
  { key: 'AioAi', label: 'AiO ai', icon: 'sparkles', color: '#0e9488', stack: 'More' },
  { key: 'Settings', label: 'Settings', icon: 'settings', color: '#7a4fc4', stack: 'More' },
];

function StatCard({ label, value, icon, color }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconWrap, { backgroundColor: `${color}1A` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.date}>{today}</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard label="Total students" value={SUMMARY.totalStudents} icon="people" color="#16274A" />
          <StatCard label="Present today" value={SUMMARY.presentToday} icon="checkmark-done" color="#2E9E7C" />
          <StatCard label="Fees collected" value={`UGX ${SUMMARY.feesCollectedThisTerm}`} icon="cash" color="#C08A2E" />
          <StatCard label="Fees outstanding" value={`UGX ${SUMMARY.feesOutstanding}`} icon="alert-circle" color="#D6564F" />
        </View>

        <Text style={styles.sectionTitle}>Quick links</Text>
        <View style={styles.linksGrid}>
          {QUICK_LINKS.map((link) => (
            <TouchableOpacity
              key={link.key}
              style={styles.linkCard}
              onPress={() => {
                if (link.stack === 'More') {
                  navigation.navigate('More', { screen: link.key });
                } else {
                  navigation.navigate(link.key);
                }
              }}
            >
              <View style={[styles.linkIconWrap, { backgroundColor: `${link.color}1A` }]}>
                <Ionicons name={link.icon} size={22} color={link.color} />
              </View>
              <Text style={styles.linkLabel}>{link.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEF2F9' },
  content: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: '800', color: '#16274A' },
  date: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#16274A', marginBottom: 12, marginTop: 4 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: { fontSize: 18, fontWeight: '800', color: '#16274A' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  linksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  linkCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  linkIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  linkLabel: { fontSize: 12, fontWeight: '600', color: '#16274A', textAlign: 'center' },
});
