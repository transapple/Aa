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
        placeholderTextColor="#9AA3B5"
        keyboardType={keyboardType}
      />
    </View>
  );
}

function ChipRow({ options, value, onSelect }) {
  return (
    <View style={styles.chipRow}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.chip, value === opt && styles.chipActive]}
          onPress={() => onSelect(opt)}
        >
          <Text style={[styles.chipText, value === opt && styles.chipTextActive]}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function statusColor(status) {
  switch (status) {
    case 'active': return { bg: '#E4F5EE', fg: '#227A61' };
    case 'inactive': return { bg: '#F1F2F5', fg: '#5B647A' };
    case 'graduated': return { bg: '#E7F1FC', fg: '#2A6BB0' };
    case 'transferred': return { bg: '#FDF1DE', fg: '#A06A13' };
    default: return { bg: '#F1F2F5', fg: '#5B647A' };
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
      {/* Search + filter */}
      <View style={styles.topBar}>
        <TextInput
          style={styles.search}
          placeholder="Search by name or admission no."
          placeholderTextColor="#9AA3B5"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
        {['All', ...CLASSES].map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.filterChip, classFilter === c && styles.filterChipActive]}
            onPress={() => setClassFilter(c)}
          >
            <Text style={[styles.filterChipText, classFilter === c && styles.filterChipTextActive]}>
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No students match your search.</Text>
        }
        renderItem={({ item }) => {
          const sc = statusColor(item.status);
          return (
            <TouchableOpacity style={styles.card} onPress={() => openView(item)}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.full_name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.full_name}</Text>
                <Text style={styles.cardSub}>
                  {item.admission_no} · {item.class_name || 'No class'}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: sc.bg }]}>
                <Text style={[styles.badgeText, { color: sc.fg }]}>{item.status}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={openAdd}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* View modal */}
      <Modal visible={viewVisible} animationType="slide" onRequestClose={() => setViewVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.modalTitle}>{viewing?.full_name}</Text>
            <Text style={styles.modalSubtitle}>
              {viewing?.admission_no} · {viewing?.class_name}
            </Text>

            <ViewRow label="Gender" value={viewing?.gender} />
            <ViewRow label="Date of birth" value={viewing?.date_of_birth} />
            <ViewRow label="Status" value={viewing?.status} />

            <Text style={styles.sectionLabel}>Parent / Guardian</Text>
            <ViewRow label="Name" value={viewing?.guardian_name} />
            <ViewRow label="Relationship" value={viewing?.guardian_relation} />
            <ViewRow label="Phone" value={viewing?.guardian_contact} />

            <Text style={styles.sectionLabel}>Medical</Text>
            <ViewRow label="Info" value={viewing?.medical_info} />

            <Text style={styles.sectionLabel}>Location</Text>
            <ViewRow label="Village" value={viewing?.village} />
            <ViewRow label="Subcounty" value={viewing?.sub_county} />
            <ViewRow label="District" value={viewing?.district} />

            <Text style={styles.sectionLabel}>Emergency contact</Text>
            <ViewRow label="Name" value={viewing?.emergency_name} />
            <ViewRow label="Relationship" value={viewing?.emergency_relation} />
            <ViewRow label="Phone" value={viewing?.emergency_contact} />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.ghostButton} onPress={() => setViewVisible(false)}>
                <Text style={styles.ghostButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={() => openEdit(viewing)}>
                <Text style={styles.primaryButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.dangerLink} onPress={() => deleteStudent(viewing)}>
              <Text style={styles.dangerLinkText}>Move to trash</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Add / Edit modal */}
      <Modal visible={formVisible} animationType="slide" onRequestClose={() => setFormVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.modalTitle}>{editing ? 'Edit student' : 'Register student'}</Text>

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
              <TouchableOpacity style={styles.ghostButton} onPress={() => setFormVisible(false)}>
                <Text style={styles.ghostButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={saveStudent}>
                <Text style={styles.primaryButtonText}>{editing ? 'Save changes' : 'Register'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function ViewRow({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.viewRow}>
      <Text style={styles.viewLabel}>{label}</Text>
      <Text style={styles.viewValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEF2F9' },
  topBar: { padding: 16, paddingBottom: 8, backgroundColor: '#EEF2F9' },
  search: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#E4E8EF',
    fontSize: 14,
  },
  filterBar: { paddingHorizontal: 16, marginBottom: 4, maxHeight: 44 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E4E8EF',
  },
  filterChipActive: { backgroundColor: '#16274A', borderColor: '#16274A' },
  filterChipText: { fontSize: 12.5, color: '#5B647A', fontWeight: '600' },
  filterChipTextActive: { color: '#fff' },
  emptyText: { textAlign: 'center', color: '#9AA3B5', marginTop: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E7F1FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontWeight: '800', color: '#2A6BB0', fontSize: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1D2433' },
  cardSub: { fontSize: 12.5, color: '#5B647A', marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#16274A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#16274A' },
  modalSubtitle: { fontSize: 13, color: '#5B647A', marginTop: 4, marginBottom: 16 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#16274A',
    marginTop: 20,
    marginBottom: 8,
  },
  field: { marginBottom: 14 },
  label: { fontSize: 12.5, fontWeight: '600', color: '#5B647A', marginBottom: 6, marginTop: 4 },
  required: { color: '#D6564F' },
  input: {
    borderWidth: 1.5,
    borderColor: '#E4E8EF',
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 14.5,
    backgroundColor: '#FAFBFD',
    color: '#1D2433',
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E4E8EF',
    backgroundColor: '#FAFBFD',
  },
  chipActive: { backgroundColor: '#16274A', borderColor: '#16274A' },
  chipText: { fontSize: 12.5, fontWeight: '600', color: '#5B647A' },
  chipTextActive: { color: '#fff' },
  viewRow: { marginBottom: 12 },
  viewLabel: { fontSize: 11.5, color: '#9AA3B5', fontWeight: '600', textTransform: 'uppercase' },
  viewValue: { fontSize: 15, color: '#1D2433', marginTop: 3 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 28 },
  ghostButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E4E8EF',
  },
  ghostButtonText: { fontWeight: '700', color: '#5B647A' },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#16274A',
  },
  primaryButtonText: { fontWeight: '700', color: '#fff' },
  dangerLink: { alignItems: 'center', marginTop: 18, marginBottom: 30 },
  dangerLinkText: { color: '#D6564F', fontWeight: '700', fontSize: 13 },
});
