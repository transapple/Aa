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
  Badge,
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

  const totalOutstanding = SEED_STUDENTS.reduce((a, s) => a + Math.max(balanceFor(s), 0), 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        eyebrow="Finance"
        title="Fees"
        subtitle={`${currency(totalOutstanding)} outstanding across the school`}
        gradient={gradients.amber}
      />

      <View style={styles.pillRowWrap}>
        <Chip label="Payments" active={tab === 'payments'} activeGradient={gradients.amber} onPress={() => setTab('payments')} />
        <Chip label="Fee Structure" active={tab === 'structure'} activeGradient={gradients.amber} onPress={() => setTab('structure')} />
      </View>

      {tab === 'payments' && (
        <>
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={17} color={colors.inkFaint} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.search}
              placeholder="Search student"
              placeholderTextColor={colors.placeholder}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <FlatList
            data={filteredStudents}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyState icon="cash-outline" title="No students match your search" />}
            renderItem={({ item, index }) => {
              const balance = balanceFor(item);
              return (
                <Reveal index={index} style={{ marginBottom: 10 }}>
                  <Card onPress={() => openPayment(item)} style={styles.rowCard}>
                    <Avatar name={item.full_name} color={colors.amber} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.cardTitle}>{item.full_name}</Text>
                      <Text style={styles.cardSub}>
                        {item.class_name} · Paid {currency(totalPaidFor(item.id))}
                      </Text>
                    </View>
                    <Badge
                      label={balance > 0 ? currency(balance) : 'Paid up'}
                      tone={balance > 0 ? 'danger' : 'success'}
                    />
                  </Card>
                </Reveal>
              );
            }}
          />
        </>
      )}

      {tab === 'structure' && (
        <ScrollView contentContainerStyle={{ padding: spacing.lg }} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Fee per class (per term)</Text>
          {CLASSES.map((c, i) => (
            <Reveal index={i} key={c} style={{ marginBottom: 10 }}>
              <View style={[styles.structureRow, shadow.soft]}>
                <Text style={styles.structureLabel}>{c}</Text>
                <TextInput
                  style={styles.structureInput}
                  keyboardType="numeric"
                  value={String(structure[c])}
                  onChangeText={(v) => setStructure({ ...structure, [c]: Number(v) || 0 })}
                />
              </View>
            </Reveal>
          ))}
        </ScrollView>
      )}

      {/* Payment modal */}
      <Modal visible={payModalVisible} animationType="slide" onRequestClose={() => setPayModalVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <ScreenHeader
            eyebrow={activeStudent?.class_name}
            title={activeStudent?.full_name || ''}
            subtitle={activeStudent ? `Balance ${currency(balanceFor(activeStudent))}` : ''}
            gradient={gradients.amber}
            right={
              <Tappable onPress={() => setPayModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#fff" />
              </Tappable>
            }
          />
          <ScrollView contentContainerStyle={styles.modalBody}>
            <Text style={styles.sectionLabel}>Payment history</Text>
            {payments
              .filter((p) => p.student_id === activeStudent?.id)
              .map((p) => (
                <View key={p.id} style={[styles.historyRow, shadow.soft]}>
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
                placeholderTextColor={colors.placeholder}
              />
            </View>
            <Text style={styles.label}>Method</Text>
            <View style={styles.chipRow}>
              {METHODS.map((m) => (
                <Chip key={m} label={m} active={payMethod === m} activeGradient={gradients.amber} onPress={() => setPayMethod(m)} />
              ))}
            </View>

            <View style={styles.modalActions}>
              <GhostButton label="Close" onPress={() => setPayModalVisible(false)} style={{ flex: 1 }} />
              <GradientButton label="Record payment" icon="checkmark" gradient={gradients.amber} onPress={recordPayment} style={{ flex: 1 }} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  pillRowWrap: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginTop: -20, marginBottom: 6 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: 8,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...shadow.soft,
  },
  search: { flex: 1, fontSize: 14, color: colors.ink },
  rowCard: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.ink },
  cardSub: { fontSize: 12.5, color: colors.inkFaint, marginTop: 2, fontWeight: '500' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.ink, marginBottom: 14, marginTop: 6 },
  structureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 14,
    justifyContent: 'space-between',
  },
  structureLabel: { fontSize: 14.5, fontWeight: '700', color: colors.ink },
  structureInput: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    width: 130,
    textAlign: 'right',
    backgroundColor: colors.surfaceAlt,
    fontWeight: '700',
    color: colors.ink,
  },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalBody: { padding: spacing.lg, paddingBottom: 30 },
  sectionLabel: { fontSize: 12.5, fontWeight: '800', color: colors.amber, marginTop: 8, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.4 },
  emptyText: { textAlign: 'center', color: colors.inkFaint, marginTop: 10, marginBottom: 10 },
  historyRow: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 13,
    marginBottom: 8,
  },
  historyAmount: { fontSize: 15, fontWeight: '800', color: '#0F7A50' },
  historySub: { fontSize: 12, color: colors.inkFaint, marginTop: 2, fontWeight: '500' },
  field: { marginBottom: 14 },
  label: { fontSize: 12.5, fontWeight: '700', color: colors.inkSoft, marginBottom: 8 },
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
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 20 },
});
