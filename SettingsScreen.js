import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ScreenHeader,
  Card,
  Tappable,
  Reveal,
  GradientButton,
  colors,
  gradients,
  radius,
  spacing,
} from '../theme/UI';

const MENU_ITEMS = [
  { id: 'AcademicSetup', label: 'Academic Settings', desc: 'Terms, classes, subjects, exam types, grades, ID format', icon: 'options', color: colors.teal },
  { id: 'schoolProfile', label: 'School settings', desc: 'Branding, mission, contact, stamps, receipts, preferences', icon: 'settings', color: colors.plum },
  { id: 'Account', label: 'Account', desc: 'Your profile, password, staff & roles', icon: 'people', color: colors.primary },
  { id: 'Trash', label: 'Trash', desc: 'Restore or permanently delete items', icon: 'trash', color: colors.inkFaint },
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
        <ScreenHeader
          eyebrow="Settings"
          title="School settings"
          gradient={gradients.ink}
          right={
            <Tappable onPress={() => setEditingProfile(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#fff" />
            </Tappable>
          }
        />
        <ScrollView contentContainerStyle={[styles.content, { paddingHorizontal: spacing.lg }]} showsVerticalScrollIndicator={false}>
          <Card style={{ marginTop: -18 }}>
            <Field label="School name" value={name} onChangeText={setName} />
            <Field label="Motto" value={motto} onChangeText={setMotto} />
            <Field label="Currency symbol" value={currencySymbol} onChangeText={setCurrencySymbol} />
            <Field label="Village" value={village} onChangeText={setVillage} />
            <Field label="District" value={district} onChangeText={setDistrict} />
            <GradientButton label="Save changes" icon="checkmark" gradient={gradients.ink} onPress={save} style={{ marginTop: 4 }} />
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="Preferences" title="Settings" subtitle="Academic setup, branding, accounts & trash" gradient={gradients.ink} />

        <View style={[styles.body, { paddingHorizontal: spacing.lg }]}>
          {MENU_ITEMS.map((item, i) => (
            <Reveal key={item.id} index={i} style={{ marginBottom: 10 }}>
              <Card
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
                <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
              </Card>
            </Reveal>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, value, onChangeText }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChangeText} placeholderTextColor={colors.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 40 },
  body: { marginTop: -18 },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowTitle: { fontSize: 14, fontWeight: '700', color: colors.ink },
  rowSub: { fontSize: 12, color: colors.inkFaint, marginTop: 2, fontWeight: '500' },
  field: { marginBottom: 14 },
  label: { fontSize: 12.5, fontWeight: '700', color: colors.inkSoft, marginBottom: 8, marginTop: 4 },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14.5,
    backgroundColor: colors.surfaceAlt,
    color: colors.ink,
  },
});
