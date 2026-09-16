import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
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

const GENDERS = ['Male', 'Female'];

const SEED_TEACHERS = [
  {
    id: '1',
    staff_no: 'T0001',
    full_name: 'Mrs. Adjei',
    phone: '0700 555 111',
    email: 'adjei@school.com',
    gender: 'Female',
    grade: 'Senior Teacher',
    specialty: 'Mathematics',
    qualification: 'BSc. Education',
    village: 'Kireka',
    subcounty: 'Nakawa',
    district: 'Kampala',
    emergency_name: 'Kojo Adjei',
    emergency_relation: 'Spouse',
    emergency_contact: '0701 222 333',
  },
];

function emptyTeacher(nextStaffNo) {
  return {
    id: null,
    staff_no: nextStaffNo,
    full_name: '',
    phone: '',
    email: '',
    gender: 'Male',
    grade: '',
    specialty: '',
    qualification: '',
    village: '',
    subcounty: '',
    district: '',
    emergency_name: '',
    emergency_relation: '',
    emergency_contact: '',
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
        <Chip key={opt} label={opt} active={value === opt} activeGradient={gradients.rose} onPress={() => onSelect(opt)} />
      ))}
    </View>
  );
}

export default function TeachersScreen() {
  const [teachers, setTeachers] = useState(SEED_TEACHERS);
  const [search, setSearch] = useState('');

  const [formVisible, setFormVisible] = useState(false);
  const [viewVisible, setViewVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState(emptyTeacher('T0002'));

  const filtered = teachers.filter(
    (t) =>
      t.full_name.toLowerCase().includes(search.toLowerCase()) ||
      t.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const nextStaffNo = () => `T${String(teachers.length + 1).padStart(4, '0')}`;

  const openAdd = () => {
    setEditing(null);
    setForm(emptyTeacher(nextStaffNo()));
    setFormVisible(true);
  };

  const openEdit = (teacher) => {
    setEditing(teacher);
    setForm(teacher);
    setViewVisible(false);
    setFormVisible(true);
  };

  const openView = (teacher) => {
    setViewing(teacher);
    setViewVisible(true);
  };

  const saveTeacher = () => {
    if (!form.full_name.trim() || !form.phone.trim()) {
      Alert.alert('Missing info', 'Full name and phone are required.');
      return;
    }
    if (!form.specialty.trim() || !form.qualification.trim()) {
      Alert.alert('Missing info', 'Specialty and qualification are required.');
      return;
    }
    if (editing) {
      setTeachers((prev) => prev.map((t) => (t.id === editing.id ? form : t)));
    } else {
      setTeachers((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    }
    setFormVisible(false);
  };

  const deleteTeacher = (teacher) => {
    Alert.alert('Move to trash?', `Move ${teacher.full_name} to trash?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Move to trash',
        style: 'destructive',
        onPress: () => {
          setTeachers((prev) => prev.filter((t) => t.id !== teacher.id));
          setViewVisible(false);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader eyebrow={`${teachers.length} on staff`} title="Staff" subtitle="Teacher & staff records" gradient={gradients.rose} />

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={17} color={colors.inkFaint} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.search}
          placeholder="Search by name or subject"
          placeholderTextColor={colors.placeholder}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState icon="person-outline" title="No staff match your search" />}
        renderItem={({ item, index }) => (
          <Reveal index={index} style={{ marginBottom: 10 }}>
            <Card onPress={() => openView(item)} style={styles.rowCard}>
              <Avatar name={item.full_name} color={colors.rose} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.cardTitle}>{item.full_name}</Text>
                <Text style={styles.cardSub}>
                  {item.staff_no} · {item.specialty || 'No subject'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
            </Card>
          </Reveal>
        )}
      />

      <FAB onPress={openAdd} gradient={gradients.rose} />

      {/* View modal */}
      <Modal visible={viewVisible} animationType="slide" onRequestClose={() => setViewVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <ScreenHeader
            eyebrow={viewing?.staff_no}
            title={viewing?.full_name || ''}
            subtitle={viewing?.specialty}
            gradient={gradients.rose}
            right={
              <Tappable onPress={() => setViewVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#fff" />
              </Tappable>
            }
          />
          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.detailCard}>
              <ViewRow label="Gender" value={viewing?.gender} />
              <ViewRow label="Phone" value={viewing?.phone} />
              <ViewRow label="Email" value={viewing?.email} />
              <ViewRow label="Grade / Position" value={viewing?.grade} />
              <ViewRow label="Specialty / Subject" value={viewing?.specialty} />
              <ViewRow label="Qualification" value={viewing?.qualification} last />
            </View>

            <Text style={styles.sectionLabel}>Location</Text>
            <View style={styles.detailCard}>
              <ViewRow label="Village" value={viewing?.village} />
              <ViewRow label="Subcounty" value={viewing?.subcounty} />
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
              <GradientButton label="Edit" icon="pencil" gradient={gradients.rose} onPress={() => openEdit(viewing)} style={{ flex: 1 }} />
            </View>
            <Tappable onPress={() => deleteTeacher(viewing)} style={styles.dangerLink}>
              <Text style={styles.dangerLinkText}>Move to trash</Text>
            </Tappable>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Add / Edit modal */}
      <Modal visible={formVisible} animationType="slide" onRequestClose={() => setFormVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <ScreenHeader
            eyebrow={editing ? 'Edit record' : 'New hire'}
            title={editing ? 'Edit staff' : 'Add staff'}
            gradient={gradients.rose}
            right={
              <Tappable onPress={() => setFormVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#fff" />
              </Tappable>
            }
          />
          <ScrollView contentContainerStyle={styles.modalBody}>
            <Field label="Staff no." value={form.staff_no} onChangeText={() => {}} />
            <Field
              required
              label="Full name"
              value={form.full_name}
              onChangeText={(v) => setForm({ ...form, full_name: v })}
            />
            <Field
              required
              label="Phone"
              value={form.phone}
              onChangeText={(v) => setForm({ ...form, phone: v })}
              keyboardType="phone-pad"
            />
            <Field
              label="Email"
              value={form.email}
              onChangeText={(v) => setForm({ ...form, email: v })}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Gender</Text>
            <ChipRow options={GENDERS} value={form.gender} onSelect={(v) => setForm({ ...form, gender: v })} />

            <Field label="Grade / Position" value={form.grade} onChangeText={(v) => setForm({ ...form, grade: v })} placeholder="e.g. Senior Teacher" />
            <Field required label="Specialty / Subject" value={form.specialty} onChangeText={(v) => setForm({ ...form, specialty: v })} />
            <Field required label="Qualification" value={form.qualification} onChangeText={(v) => setForm({ ...form, qualification: v })} />

            <Text style={styles.sectionLabel}>Location</Text>
            <Field label="Village" value={form.village} onChangeText={(v) => setForm({ ...form, village: v })} />
            <Field label="Subcounty" value={form.subcounty} onChangeText={(v) => setForm({ ...form, subcounty: v })} />
            <Field label="District" value={form.district} onChangeText={(v) => setForm({ ...form, district: v })} />

            <Text style={styles.sectionLabel}>Emergency contact</Text>
            <Field label="Name" value={form.emergency_name} onChangeText={(v) => setForm({ ...form, emergency_name: v })} />
            <Field label="Relationship" value={form.emergency_relation} onChangeText={(v) => setForm({ ...form, emergency_relation: v })} />
            <Field label="Phone" value={form.emergency_contact} onChangeText={(v) => setForm({ ...form, emergency_contact: v })} keyboardType="phone-pad" />

            <View style={styles.modalActions}>
              <GhostButton label="Cancel" onPress={() => setFormVisible(false)} style={{ flex: 1 }} />
              <GradientButton label={editing ? 'Save changes' : 'Add staff'} icon="checkmark" gradient={gradients.rose} onPress={saveTeacher} style={{ flex: 1 }} />
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
    color: colors.rose,
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
