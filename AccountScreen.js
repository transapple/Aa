import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ME = {
  full_name: 'Jane Admin',
  username: 'jadmin',
  phone: '0700 000 000',
  department: 'Administration',
  position: 'Head Teacher',
  is_owner: true,
};

const SEED_STAFF = [
  { id: 'p1', full_name: 'Jane Admin', department: 'Administration', role: 'admin', approval_status: 'approved' },
  { id: 'p2', full_name: 'Peter Okwir', department: 'Academic', role: 'staff', approval_status: 'approved' },
];

const SEED_PENDING_REGS = [
  { id: 'p3', full_name: 'Grace Nabirye', department: 'Finance' },
];

const SEED_PENDING_REQUESTS = [
  { id: 'r1', full_name: 'Peter Okwir', message: 'Please update my phone number to 0705 111 222', created_at: new Date().toISOString() },
];

function MenuRow({ icon, color, label, badge, onPress }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={[styles.iconWrap, { backgroundColor: `${color}1A` }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      {badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={18} color="#9AA3B5" />
    </TouchableOpacity>
  );
}

export default function AccountScreen() {
  const [section, setSection] = useState(null); // null | 'manage' | 'pendingregs' | 'pendingreqs' | 'departments'
  const [staff, setStaff] = useState(SEED_STAFF);
  const [pendingRegs, setPendingRegs] = useState(SEED_PENDING_REGS);
  const [pendingReqs, setPendingReqs] = useState(SEED_PENDING_REQUESTS);

  function approveReg(item) {
    setPendingRegs((prev) => prev.filter((p) => p.id !== item.id));
    setStaff((prev) => [...prev, { id: item.id, full_name: item.full_name, department: item.department, role: 'staff', approval_status: 'approved' }]);
    Alert.alert('Approved', `${item.full_name} can now sign in.`);
  }

  function rejectReg(item) {
    setPendingRegs((prev) => prev.filter((p) => p.id !== item.id));
  }

  function dismissRequest(item) {
    setPendingReqs((prev) => prev.filter((r) => r.id !== item.id));
  }

  function logout() {
    Alert.alert('Log out?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => {} },
    ]);
  }

  const MeCard = (
    <View style={styles.card}>
      <View style={styles.meRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{ME.full_name.charAt(0)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.meName}>
            {ME.full_name} {ME.is_owner ? <Text style={styles.ownerBadge}>Owner</Text> : null}
          </Text>
          <Text style={styles.meSub}>{ME.phone} · @{ME.username}</Text>
          <Text style={styles.meSub}>{ME.department} · {ME.position}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.ghostButton} onPress={logout}>
        <Ionicons name="log-out-outline" size={16} color="#16274A" />
        <Text style={styles.ghostButtonText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );

  if (section === 'manage') {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity onPress={() => setSection(null)} style={styles.backRow}>
            <Ionicons name="chevron-back" size={18} color="#16274A" />
            <Text style={styles.backText}>Account</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Manage accounts</Text>
          {staff.map((s) => (
            <View key={s.id} style={styles.row}>
              <View style={[styles.iconWrap, { backgroundColor: '#EEF2F9' }]}>
                <Ionicons name="person" size={18} color="#16274A" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{s.full_name}</Text>
                <Text style={styles.rowSub}>{s.department} · {s.role}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (section === 'pendingregs') {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity onPress={() => setSection(null)} style={styles.backRow}>
            <Ionicons name="chevron-back" size={18} color="#16274A" />
            <Text style={styles.backText}>Account</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Pending registrations</Text>
          {pendingRegs.length === 0 ? (
            <Text style={styles.helper}>No pending registrations.</Text>
          ) : (
            pendingRegs.map((p) => (
              <View key={p.id} style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{p.full_name}</Text>
                  <Text style={styles.rowSub}>{p.department}</Text>
                </View>
                <TouchableOpacity style={styles.smallApprove} onPress={() => approveReg(p)}>
                  <Text style={styles.smallApproveText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallReject} onPress={() => rejectReg(p)}>
                  <Text style={styles.smallRejectText}>Reject</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (section === 'pendingreqs') {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity onPress={() => setSection(null)} style={styles.backRow}>
            <Ionicons name="chevron-back" size={18} color="#16274A" />
            <Text style={styles.backText}>Account</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Pending detail-change requests</Text>
          {pendingReqs.length === 0 ? (
            <Text style={styles.helper}>No pending requests.</Text>
          ) : (
            pendingReqs.map((r) => (
              <View key={r.id} style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{r.full_name}</Text>
                  <Text style={styles.rowSub}>{r.message}</Text>
                </View>
                <TouchableOpacity style={styles.smallApprove} onPress={() => dismissRequest(r)}>
                  <Text style={styles.smallApproveText}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        {MeCard}
        <View style={styles.card}>
          <MenuRow icon="notifications" color="#C08A2E" label="Pending Registrations" badge={pendingRegs.length} onPress={() => setSection('pendingregs')} />
          <MenuRow icon="people" color="#16274A" label="Manage Accounts" onPress={() => setSection('manage')} />
          <MenuRow icon="cube" color="#2E9E7C" label="Departments" onPress={() => setSection('departments')} />
          <MenuRow icon="create" color="#5B5FC7" label="Pending Requests" badge={pendingReqs.length} onPress={() => setSection('pendingreqs')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEF2F9' },
  content: { padding: 16, paddingBottom: 32 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 8, marginBottom: 16 },
  meRow: { flexDirection: 'row', alignItems: 'center', padding: 8, marginBottom: 8 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#16274A', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  meName: { fontSize: 15, fontWeight: '800', color: '#16274A' },
  ownerBadge: { fontSize: 10, fontWeight: '700', color: '#2E9E7C', backgroundColor: '#E4F5EE', paddingHorizontal: 6, borderRadius: 8, overflow: 'hidden' },
  meSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  ghostButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 10, marginHorizontal: 8, marginBottom: 4, borderRadius: 10, backgroundColor: '#EEF2F9' },
  ghostButtonText: { color: '#16274A', fontWeight: '700', fontSize: 13, marginLeft: 6 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#16274A' },
  rowTitle: { fontSize: 14, fontWeight: '700', color: '#16274A' },
  rowSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  badge: { backgroundColor: '#FDF1DE', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#C08A2E' },
  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backText: { color: '#16274A', fontWeight: '700', marginLeft: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#16274A', marginBottom: 12 },
  helper: { fontSize: 13, color: '#6B7280' },
  smallApprove: { backgroundColor: '#E4F5EE', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, marginLeft: 6 },
  smallApproveText: { fontSize: 11, fontWeight: '700', color: '#2E9E7C' },
  smallReject: { backgroundColor: '#FDECEC', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, marginLeft: 6 },
  smallRejectText: { fontSize: 11, fontWeight: '700', color: '#D6564F' },
});
