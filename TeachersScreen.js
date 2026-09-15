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
          <Text style={[styles.chipText, value === opt && styles.chipTextActive]}>{opt}</Text>
        </TouchableOpacity>
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
      <View style={styles.topBar}>
        <TextInput
          style={styles.search}
          placeholder="Search by name or subject"
          placeholderTextColor="#9AA3B5"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No staff match your search.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openView(item)}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.full_name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.full_name}</Text>
              <Text style={styles.cardSub}>
                {item.staff_no} · {item.specialty || 'No subject'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={openAdd}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* View modal */}
      <Modal visible={viewVisible} animationType="slide" onRequestClose={() => setViewVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.modalTitle}>{viewing?.full_name}</Text>
            <Text style={styles.modalSubtitle}>{viewing?.staff_no}</Text>

            <ViewRow label="Gender" value={viewing?.gender} />
            <ViewRow label="Phone" value={viewing?.phone} />
            <ViewRow label="Email" value={viewing?.email} />
            <ViewRow label="Grade / Position" value={viewing?.grade} />
            <ViewRow label="Specialty / Subject" value={viewing?.specialty} />
            <ViewRow label="Qualification" value={viewing?.qualification} />

            <Text style={styles.sectionLabel}>Location</Text>
            <ViewRow label="Village" value={viewing?.village} />
            <ViewRow label="Subcounty" value={viewing?.subcounty} />
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
            <TouchableOpacity style={styles.dangerLink} onPress={() => deleteTeacher(viewing)}>
              <Text style={styles.dangerLinkText}>Move to trash</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Add / Edit modal */}
      <Modal visible={formVisible} animationType="slide" onRequestClose={() => setFormVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.modalTitle}>{editing ? 'Edit staff' : 'Add staff'}</Text>

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
              <TouchableOpacity style={styles.ghostButton} onPress={() => setFormVisible(false)}>
                <Text style={styles.ghostButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={saveTeacher}>
                <Text style={styles.primaryButtonText}>{editing ? 'Save changes' : 'Add staff'}</Text>
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
  topBar: { padding: 16, backgroundColor: '#EEF2F9' },
  search: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#E4E8EF',
    fontSize: 14,
  },
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
    backgroundColor: '#EFEDFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontWeight: '800', color: '#5B4FC4', fontSize: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1D2433' },
  cardSub: { fontSize: 12.5, color: '#5B647A', marginTop: 2 },
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
  sectionLabel: { fontSize: 13, fontWeight: '800', color: '#16274A', marginTop: 20, marginBottom: 8 },
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
