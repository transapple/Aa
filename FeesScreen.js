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
const METHODS = ['Cash', 'Mobile Money', 'Bank Transfer'];

const SEED_STUDENTS = [
  { id: 's1', full_name: 'Amina Yusuf', admission_no: 'S0001', class_name: 'Grade 9' },
  { id: 's2', full_name: 'John Mensah', admission_no: 'S0002', class_name: 'Grade 10' },
  { id: 's3', full_name: 'Grace Okello', admission_no: 'S0003', class_name: 'Grade 8' },
];

const SEED_STRUCTURE = {
  'Grade 8': 500000,
  'Grade 9': 550000,
  'Grade 10': 600000,
  'Grade 11': 650000,
  'Grade 12': 700000,
};

const SEED_PAYMENTS = [
  { id: 'p1', student_id: 's1', amount: 300000, date: '2026-01-15', method: 'Mobile Money' },
  { id: 'p2', student_id: 's2', amount: 600000, date: '2026-01-20', method: 'Cash' },
];

function currency(n) {
  return `$${Number(n || 0).toLocaleString()}`;
}

export default function FeesScreen() {
  const [tab, setTab] = useState('payments'); // payments | structure
  const [payments, setPayments] = useState(SEED_PAYMENTS);
  const [structure, setStructure] = useState(SEED_STRUCTURE);
  const [search, setSearch] = useState('');

  const [payModalVisible, setPayModalVisible] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Cash');

  const totalPaidFor = (studentId) =>
    payments.filter((p) => p.student_id === studentId).reduce((a, p) => a + p.amount, 0);

  const balanceFor = (student) => {
    const owed = structure[student.class_name] || 0;
    return owed - totalPaidFor(student.id);
  };

  const filteredStudents = SEED_STUDENTS.filter((s) =>
    s.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const openPayment = (student) => {
    setActiveStudent(student);
    setPayAmount('');
    setPayMethod('Cash');
    setPayModalVisible(true);
  };

  const recordPayment = () => {
    const amt = Number(payAmount);
    if (!amt || amt <= 0) {
      Alert.alert('Invalid amount', 'Enter a valid payment amount.');
      return;
    }
    setPayments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        student_id: activeStudent.id,
        amount: amt,
        date: new Date().toISOString().slice(0, 10),
        method: payMethod,
      },
    ]);
    setPayModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
        {[
          ['payments', 'Payments'],
          ['structure', 'Fee Structure'],
        ].map(([id, label]) => (
          <TouchableOpacity
            key={id}
            style={[styles.pill, tab === id && styles.pillActive]}
            onPress={() => setTab(id)}
          >
            <Text style={[styles.pillText, tab === id && styles.pillTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {tab === 'payments' && (
        <>
          <View style={styles.topBar}>
            <TextInput
              style={styles.search}
              placeholder="Search student"
              placeholderTextColor="#9AA3B5"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <FlatList
            data={filteredStudents}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            renderItem={({ item }) => {
              const balance = balanceFor(item);
              return (
                <TouchableOpacity style={styles.card} onPress={() => openPayment(item)}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.full_name.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{item.full_name}</Text>
                    <Text style={styles.cardSub}>
                      {item.class_name} · Paid {currency(totalPaidFor(item.id))}
                    </Text>
                  </View>
                  <Text style={[styles.balance, { color: balance > 0 ? '#D6564F' : '#227A61' }]}>
                    {balance > 0 ? currency(balance) : 'Paid up'}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </>
      )}

      {tab === 'structure' && (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={styles.sectionTitle}>Fee per class (per term)</Text>
          {CLASSES.map((c) => (
            <View key={c} style={styles.structureRow}>
              <Text style={styles.structureLabel}>{c}</Text>
              <TextInput
                style={styles.structureInput}
                keyboardType="numeric"
                value={String(structure[c])}
                onChangeText={(v) => setStructure({ ...structure, [c]: Number(v) || 0 })}
              />
            </View>
          ))}
        </ScrollView>
      )}

      {/* Payment modal */}
      <Modal visible={payModalVisible} animationType="slide" onRequestClose={() => setPayModalVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.modalTitle}>{activeStudent?.full_name}</Text>
            <Text style={styles.modalSubtitle}>
              {activeStudent?.class_name} · Balance{' '}
              {activeStudent ? currency(balanceFor(activeStudent)) : ''}
            </Text>

            <Text style={styles.sectionLabel}>Payment history</Text>
            {payments
              .filter((p) => p.student_id === activeStudent?.id)
              .map((p) => (
                <View key={p.id} style={styles.historyRow}>
                  <Text style={styles.historyAmount}>{currency(p.amount)}</Text>
                  <Text style={styles.historySub}>
                    {p.date} · {p.method}
                  </Text>
                </View>
              ))}
            {payments.filter((p) => p.student_id === activeStudent?.id).length === 0 && (
              <Text style={styles.emptyText}>No payments recorded yet.</Text>
            )}

            <Text style={styles.sectionLabel}>Record a payment</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={payAmount}
                onChangeText={setPayAmount}
                placeholder="e.g. 200000"
                placeholderTextColor="#9AA3B5"
              />
            </View>
            <Text style={styles.label}>Method</Text>
            <View style={styles.chipRow}>
              {METHODS.map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.chip, payMethod === m && styles.chipActive]}
                  onPress={() => setPayMethod(m)}
                >
                  <Text style={[styles.chipText, payMethod === m && styles.chipTextActive]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.ghostButton} onPress={() => setPayModalVisible(false)}>
                <Text style={styles.ghostButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={recordPayment}>
                <Text style={styles.primaryButtonText}>Record payment</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEF2F9' },
  pillRow: { paddingHorizontal: 16, paddingTop: 16, maxHeight: 52 },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E4E8EF',
  },
  pillActive: { backgroundColor: '#16274A', borderColor: '#16274A' },
  pillText: { fontSize: 13, fontWeight: '700', color: '#5B647A' },
  pillTextActive: { color: '#fff' },
  topBar: { padding: 16, paddingBottom: 8 },
  search: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#E4E8EF',
    fontSize: 14,
  },
  emptyText: { textAlign: 'center', color: '#9AA3B5', marginTop: 20, marginBottom: 10 },
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
    backgroundColor: '#FDECEC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontWeight: '800', color: '#B23F39', fontSize: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1D2433' },
  cardSub: { fontSize: 12.5, color: '#5B647A', marginTop: 2 },
  balance: { fontSize: 13, fontWeight: '800' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#16274A', marginBottom: 14 },
  structureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  structureLabel: { fontSize: 14.5, fontWeight: '700', color: '#1D2433' },
  structureInput: {
    borderWidth: 1.5,
    borderColor: '#E4E8EF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    width: 130,
    textAlign: 'right',
    backgroundColor: '#FAFBFD',
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#16274A' },
  modalSubtitle: { fontSize: 13, color: '#5B647A', marginTop: 4, marginBottom: 10 },
  sectionLabel: { fontSize: 13, fontWeight: '800', color: '#16274A', marginTop: 20, marginBottom: 10 },
  historyRow: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  historyAmount: { fontSize: 15, fontWeight: '800', color: '#227A61' },
  historySub: { fontSize: 12, color: '#5B647A', marginTop: 2 },
  field: { marginBottom: 14 },
  label: { fontSize: 12.5, fontWeight: '600', color: '#5B647A', marginBottom: 6 },
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
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 30 },
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
});
