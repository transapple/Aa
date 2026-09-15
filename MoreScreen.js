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

// Mirrors the web app's NAV list minus the four bottom-tab items
// (Home, Students, Attendance, Fees) which live on the tab bar instead.
const MENU_ITEMS = [
  { key: 'AioAi', label: 'AiO ai', description: 'Ask questions about your school data', icon: 'sparkles', color: '#0e9488' },
  { key: 'Exams', label: 'Exams', description: 'Schedules, marks & results', icon: 'document-text', color: '#5B5FC7' },
  { key: 'Teachers', label: 'Staff', description: 'Teacher & staff records', icon: 'person-circle', color: '#D6564F' },
  { key: 'AcademicSetup', label: 'Setup', description: 'Classes, terms & subjects', icon: 'options', color: '#0e9488' },
  { key: 'Inventory', label: 'Inventory & Assets', description: 'School property & supplies', icon: 'cube', color: '#8a5a2b' },
  { key: 'Library', label: 'Library', description: 'Books & borrowing records', icon: 'library', color: '#166534' },
  { key: 'SchoolHealth', label: 'School Health', description: 'Fees, attendance & performance rollup', icon: 'pulse', color: '#e11d48' },
  { key: 'Comms', label: 'Comms', description: 'Messages, meetings & chat history', icon: 'megaphone', color: '#c2410c' },
  { key: 'Account', label: 'Account', description: 'Your profile, staff & roles', icon: 'people', color: '#16274A' },
  { key: 'Contact', label: 'Contact TransApple', description: 'Get help from support', icon: 'help-buoy', color: '#0e9488' },
  { key: 'Settings', label: 'Settings', description: 'School branding & preferences', icon: 'settings', color: '#7a4fc4' },
  { key: 'Trash', label: 'Trash', description: 'Restore or permanently delete items', icon: 'trash', color: '#6B7280' },
];

export default function MoreScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.row}
            onPress={() => navigation.navigate(item.key)}
          >
            <View style={[styles.iconWrap, { backgroundColor: `${item.color}1A` }]}>
              <Ionicons name={item.icon} size={20} color={item.color} />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9AA3B5" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEF2F9' },
  content: { padding: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textWrap: { flex: 1 },
  label: { fontSize: 15, fontWeight: '700', color: '#16274A' },
  description: { fontSize: 12, color: '#6B7280', marginTop: 2 },
});
