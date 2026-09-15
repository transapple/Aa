import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MENU_ITEMS = [
  { id: 'AcademicSetup', label: 'Academic Settings', desc: 'Terms, classes, subjects, exam types, grades, ID format', icon: 'options', color: '#0e9488' },
  { id: 'schoolProfile', label: 'School settings', desc: 'Branding, mission, contact, stamps, receipts, preferences', icon: 'settings', color: '#7a4fc4' },
  { id: 'Account', label: 'Account', desc: 'Your profile, password, staff & roles', icon: 'people', color: '#16274A' },
  { id: 'Trash', label: 'Trash', desc: 'Restore or permanently delete items', icon: 'trash', color: '#6B7280' },
];

export default function SettingsScreen({ navigation }) {
  const [editingProfile, setEditingProfile] = useState(false);
  const [name, setName] = useState('AiO Demo School');
  const [motto, setMotto] = useState('Knowledge for life');
  const [currencySymbol, setCurrencySymbol] = useState('UGX ');
  const [village, setVillage] = useState('Kireka');
  const [district, setDistrict] = useState('Kampala');

  function save() {
    setEditingProfile(false);
    Alert.alert('Saved', 'School settings updated.');
  }

  if (editingProfile) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity onPress={() => setEditingProfile(false)} style={styles.backRow}>
            <Ionicons name="chevron-back" size={18} color="#16274A" />
            <Text style={styles.backText}>Settings</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>School settings</Text>
          <View style={styles.card}>
            <Text style={styles.label}>School name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
            <Text style={styles.label}>Motto</Text>
            <TextInput style={styles.input} value={motto} onChangeText={setMotto} />
            <Text style={styles.label}>Currency symbol</Text>
            <TextInput style={styles.input} value={currencySymbol} onChangeText={setCurrencySymbol} />
            <Text style={styles.label}>Village</Text>
            <TextInput style={styles.input} value={village} onChangeText={setVillage} />
            <Text style={styles.label}>District</Text>
            <TextInput style={styles.input} value={district} onChangeText={setDistrict} />
            <TouchableOpacity style={styles.primaryButton} onPress={save}>
              <Text style={styles.primaryButtonText}>Save changes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Settings</Text>
        <Text style={styles.pageSub}>Manage your school's academic setup, branding, accounts and trash.</Text>
        <View style={styles.card}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.row}
              onPress={() => {
                if (item.id === 'schoolProfile') {
                  setEditingProfile(true);
                } else {
                  navigation.navigate(item.id);
                }
              }}
            >
              <View style={[styles.iconWrap, { backgroundColor: `${item.color}1A` }]}>
                <Ionicons name={item.icon} size={18} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{item.label}</Text>
                <Text style={styles.rowSub}>{item.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9AA3B5" />
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
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#16274A' },
  pageSub: { fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 8 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12 },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowTitle: { fontSize: 14, fontWeight: '700', color: '#16274A' },
  rowSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backText: { color: '#16274A', fontWeight: '700', marginLeft: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#16274A', marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: '#FAFBFD', borderRadius: 10, padding: 12, fontSize: 14, borderWidth: 1, borderColor: '#E5E9F2' },
  primaryButton: { marginTop: 20, backgroundColor: '#16274A', borderRadius: 12, padding: 14, alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
});
