import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ScreenHeader,
  Chip,
  Card,
  Avatar,
  Badge,
  FAB,
  Reveal,
  Tappable,
  GradientButton,
  GhostButton,
  EmptyState,
  colors,
  gradients,
  radius,
  spacing,
  shadow,
} from '../theme/UI';

const CLASSES = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
const STATUSES = ['active', 'inactive', 'graduated', 'transferred'];
const GENDERS = ['Male', 'Female'];

const SEED_STUDENTS = [
  {
    id: '1',
    admission_no: 'S0001',
    full_name: 'Amina Yusuf',
    date_of_birth: '2011-04-12',
    gender: 'Female',
    class_name: 'Grade 9',
    guardian_name: 'Fatima Yusuf',
    guardian_relation: 'Mother',
    guardian_contact: '0700 123 456',
    medical_info: 'No known allergies',
    village: 'Kireka',
    sub_county: 'Nakawa',
    district: 'Kampala',
    emergency_name: 'Musa Yusuf',
    emergency_relation: 'Uncle',
    emergency_contact: '0701 654 321',
    status: 'active',
  },
  {
    id: '2',
    admission_no: 'S0002',
    full_name: 'John Mensah',
    date_of_birth: '2010-09-03',
    gender: 'Male',
    class_name: 'Grade 10',
    guardian_name: 'Grace Mensah',
    guardian_relation: 'Mother',
    guardian_contact: '0702 987 654',
    medical_info: 'Asthma - carries inhaler',
    village: 'Ntinda',
    sub_county: 'Nakawa',
    district: 'Kampala',
    emergency_name: 'Peter Mensah',
    emergency_relation: 'Father',
    emergency_contact: '0703 111 222',
    status: 'active',
  },
];

function emptyStudent(nextAdmNo) {
  return {
    id: null,
    admission_no: nextAdmNo,
    full_name: '',
    date_of_birth: '',
    gender: 'Male',
    class_name: '',
    guardian_name: '',
    guardian_relation: '',
    guardian_contact: '',
    medical_info: '',
    village: '',
    sub_county: '',
    district: '',
    emergency_name: '',
    emergency_relation: '',
    emergency_contact: '',
    status: 'active',
  };
}

function Field({ label, value, onChangeText, placeholder, keyboardType, required }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label} {required ? <Text style={styles.required}>*</Text> : null}
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        keyboardType={keyboardType}
      />
    </View>
  );
}

function ChipRow({ options, value, onSelect }) {
  return (
    <View style={styles.chipRow}>
      {options.map((opt) => (
        <Chip key={opt} label={opt} active={value === opt} onPress={() => onSelect(opt)} />
      ))}
    </View>
  );
}

function statusTone(status) {
  switch (status) {
    case 'active': return 'success';
    case 'inactive': return 'neutral';
    case 'graduated': return 'info';
    case 'transferred': return 'warning';
    default: return 'neutral';
  }
}

export default function StudentsScreen() {
  const [students, setStudents] = useState(SEED_STUDENTS);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All');

  const [formVisible, setFormVisible] = useState(false);
  const [viewVisible, setViewVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState(emptyStudent('S0003'));

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.admission_no.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === 'All' || s.class_name === classFilter;
    return matchesSearch && matchesClass;
  });

  const nextAdmissionNo = () => {
    const n = students.length + 1;
    return `S${String(n).padStart(4, '0')}`;
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyStudent(nextAdmissionNo()));
    setFormVisible(true);
  };

  const openEdit = (student) => {
    setEditing(student);
    setForm(student);
    setViewVisible(false);
    setFormVisible(true);
  };

  const openView = (student) => {
    setViewing(student);
    setViewVisible(true);
  };

  const saveStudent = () => {
    if (!form.full_name.trim()) {
      Alert.alert('Missing info', 'Full name is required.');
      return;
    }
    if (!form.class_name) {
      Alert.alert('Missing info', 'Please select a class.');
      return;
    }
    if (!form.guardian_name.trim() || !form.guardian_contact.trim()) {
      Alert.alert('Missing info', 'Guardian name and phone are required.');
      return;
    }
    if (editing) {
      setStudents((prev) => prev.map((s) => (s.id === editing.id ? form : s)));
    } else {
      setStudents((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    }
    setFormVisible(false);
  };

  const deleteStudent = (student) => {
    Alert.alert(
      'Move to trash?',
      `Move ${student.full_name} to trash?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Move to trash',
          style: 'destructive',
          onPress: () => {
            setStudents((prev) => prev.filter((s) => s.id !== student.id));
            setViewVisible(false);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        eyebrow={`${students.length} registered`}
        title="Students"
        subtitle="Search, filter and manage every learner"
        gradient={gradients.primary}
      />

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={17} color={colors.inkFaint} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.search}
          placeholder="Search by name or admission no."
          placeholderTextColor={colors.placeholder}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={{ paddingHorizontal: spacing.lg }}>
        {['All', ...CLASSES].map((c) => (
          <Chip key={c} label={c} active={classFilter === c} onPress={() => setClassFilter(c)} />
        ))}
      </ScrollView>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState icon="people-outline" title="No students match your search" subtitle="Try a different name, admission number, or class filter." />
        }
        renderItem={({ item, index }) => (
          <Reveal index={index} style={{ marginBottom: 10 }}>
            <Card onPress={() => openView(item)} style={styles.rowCard}>
              <Avatar name={item.full_name} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.cardTitle}>{item.full_name}</Text>
                <Text style={styles.cardSub}>
                  {item.admission_no} · {item.class_name || 'No class'}
                </Text>
              </View>
              <Badge label={item.status} tone={statusTone(item.status)} />
            </Card>
          </Reveal>
        )}
      />

      <FAB onPress={openAdd} />

      {/* View modal */}
      <Modal visible={viewVisible} animationType="slide" onRequestClose={() => setViewVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <ScreenHeader
            eyebrow={viewing?.admission_no}
            title={viewing?.full_name || ''}
            subtitle={viewing?.class_name}
            gradient={gradients.primary}
            right={
              <Tappable onPress={() => setViewVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#fff" />
              </Tappable>
            }
          />
          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.detailCard}>
              <ViewRow label="Gender" value={viewing?.gender} />
              <ViewRow label="Date of birth" value={viewing?.date_of_birth} />
              <ViewRow label="Status" value={viewing?.status} last />
            </View>

            <Text style={styles.sectionLabel}>Parent / Guardian</Text>
            <View style={styles.detailCard}>
              <ViewRow label="Name" value={viewing?.guardian_name} />
              <ViewRow label="Relationship" value={viewing?.guardian_relation} />
              <ViewRow label="Phone" value={viewing?.guardian_contact} last />
            </View>

            <Text style={styles.sectionLabel}>Medical</Text>
            <View style={styles.detailCard}>
              <ViewRow label="Info" value={viewing?.medical_info} last />
            </View>

            <Text style={styles.sectionLabel}>Location</Text>
            <View style={styles.detailCard}>
              <ViewRow label="Village" value={viewing?.village} />
              <ViewRow label="Subcounty" value={viewing?.sub_county} />
              <ViewRow label="District" value={viewing?.district} last />
            </View>

            <Text style={styles.sectionLabel}>Emergency contact</Text>
            <View style={styles.detailCard}>
              <ViewRow label="Name" value={viewing?.emergency_name} />
              <ViewRow label="Relationship" value={viewing?.emergency_relation} />
              <ViewRow label="Phone" value={viewing?.emergency_contact} last />
            </View>

            <View style={styles.modalActions}>
              <GhostButton label="Close" onPress={() => setViewVisible(false)} style={{ flex: 1 }} />
              <GradientButton label="Edit" icon="pencil" onPress={() => openEdit(viewing)} style={{ flex: 1 }} />
            </View>
            <Tappable onPress={() => deleteStudent(viewing)} style={styles.dangerLink}>
              <Text style={styles.dangerLinkText}>Move to trash</Text>
            </Tappable>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Add / Edit modal */}
      <Modal visible={formVisible} animationType="slide" onRequestClose={() => setFormVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <ScreenHeader
            eyebrow={editing ? 'Edit record' : 'New admission'}
            title={editing ? 'Edit student' : 'Register student'}
            gradient={gradients.primary}
            right={
              <Tappable onPress={() => setFormVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#fff" />
              </Tappable>
            }
          />
          <ScrollView contentContainerStyle={styles.modalBody}>
            <Field label="Admission no." value={form.admission_no} onChangeText={() => {}} />
            <Field
              label="Full name"
              required
              value={form.full_name}
              onChangeText={(v) => setForm({ ...form, full_name: v })}
              placeholder="e.g. Amina Yusuf"
            />
            <Field
              label="Date of birth"
              required
              value={form.date_of_birth}
              onChangeText={(v) => setForm({ ...form, date_of_birth: v })}
              placeholder="YYYY-MM-DD"
            />

            <Text style={styles.label}>Gender</Text>
            <ChipRow options={GENDERS} value={form.gender} onSelect={(v) => setForm({ ...form, gender: v })} />

            <Text style={styles.label}>Class</Text>
            <ChipRow options={CLASSES} value={form.class_name} onSelect={(v) => setForm({ ...form, class_name: v })} />

            <Text style={styles.sectionLabel}>Parent / guardian</Text>
            <Field required label="Name" value={form.guardian_name} onChangeText={(v) => setForm({ ...form, guardian_name: v })} />
            <Field required label="Relationship" value={form.guardian_relation} onChangeText={(v) => setForm({ ...form, guardian_relation: v })} />
            <Field required label="Phone number" value={form.guardian_contact} onChangeText={(v) => setForm({ ...form, guardian_contact: v })} keyboardType="phone-pad" />

            <Text style={styles.sectionLabel}>Medical information</Text>
            <Field label="Allergies, conditions, medication, etc." value={form.medical_info} onChangeText={(v) => setForm({ ...form, medical_info: v })} />

            <Text style={styles.sectionLabel}>Location</Text>
            <Field required label="Village" value={form.village} onChangeText={(v) => setForm({ ...form, village: v })} />
            <Field required label="Subcounty" value={form.sub_county} onChangeText={(v) => setForm({ ...form, sub_county: v })} />
            <Field required label="District" value={form.district} onChangeText={(v) => setForm({ ...form, district: v })} />

            <Text style={styles.sectionLabel}>Emergency contact</Text>
            <Field label="Name" value={form.emergency_name} onChangeText={(v) => setForm({ ...form, emergency_name: v })} />
            <Field label="Relationship" value={form.emergency_relation} onChangeText={(v) => setForm({ ...form, emergency_relation: v })} />
            <Field label="Phone number" value={form.emergency_contact} onChangeText={(v) => setForm({ ...form, emergency_contact: v })} keyboardType="phone-pad" />

            <Text style={styles.label}>Status</Text>
            <ChipRow options={STATUSES} value={form.status} onSelect={(v) => setForm({ ...form, status: v })} />

            <View style={styles.modalActions}>
              <GhostButton label="Cancel" onPress={() => setFormVisible(false)} style={{ flex: 1 }} />
              <GradientButton label={editing ? 'Save changes' : 'Register'} icon="checkmark" onPress={saveStudent} style={{ flex: 1 }} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function ViewRow({ label, value, last }) {
  if (!value) return null;
  return (
    <View style={[styles.viewRow, last && { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }]}>
      <Text style={styles.viewLabel}>{label}</Text>
      <Text style={styles.viewValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: -22,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...shadow.card,
  },
  search: { flex: 1, fontSize: 14, color: colors.ink },
  filterBar: { marginTop: 14, marginBottom: 2, maxHeight: 44 },
  rowCard: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.ink },
  cardSub: { fontSize: 12.5, color: colors.inkFaint, marginTop: 2, fontWeight: '500' },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalBody: { padding: spacing.lg, paddingBottom: 40 },
  detailCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, ...shadow.soft },
  sectionLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 22,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  field: { marginBottom: 14 },
  label: { fontSize: 12.5, fontWeight: '700', color: colors.inkSoft, marginBottom: 8, marginTop: 4 },
  required: { color: colors.danger },
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
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  viewRow: { marginBottom: 14, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  viewLabel: { fontSize: 11, color: colors.inkFaint, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  viewValue: { fontSize: 15, color: colors.ink, marginTop: 4, fontWeight: '600' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 26 },
  dangerLink: { alignItems: 'center', marginTop: 18, marginBottom: 10, paddingVertical: 10 },
  dangerLinkText: { color: colors.danger, fontWeight: '800', fontSize: 13 },
});
