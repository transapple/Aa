import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ScreenHeader,
  Card,
  Badge,
  Avatar,
  Tappable,
  Reveal,
  GhostButton,
  colors,
  gradients,
  radius,
  spacing,
} from '../theme/UI';

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

function MenuRow({ icon, color, label, badge, onPress, index = 0 }) {
  return (
    <Reveal index={index}>
      <Card onPress={onPress} style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: `${color}1A` }]}>
          <Ionicons name={icon} size={18} color={color} />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
        {badge > 0 && <Badge label={String(badge)} tone="warning" style={{ marginRight: 8 }} />}
        <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
      </Card>
    </Reveal>
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

  const backRow = (
    <Tappable onPress={() => setSection(null)} style={styles.backRow}>
      <Ionicons name="chevron-back" size={18} color={colors.primary} />
      <Text style={styles.backText}>Account</Text>
    </Tappable>
  );

  if (section === 'manage') {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {backRow}
          <Text style={styles.sectionTitle}>Manage accounts</Text>
          {staff.map((s, i) => (
            <Reveal key={s.id} index={i} style={{ marginBottom: 10 }}>
              <Card style={styles.row}>
                <View style={[styles.iconWrap, { backgroundColor: `${colors.primary}18` }]}>
                  <Ionicons name="person" size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{s.full_name}</Text>
                  <Text style={styles.rowSub}>{s.department} · {s.role}</Text>
                </View>
              </Card>
            </Reveal>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (section === 'pendingregs') {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {backRow}
          <Text style={styles.sectionTitle}>Pending registrations</Text>
          {pendingRegs.length === 0 ? (
            <Text style={styles.helper}>No pending registrations.</Text>
          ) : (
            pendingRegs.map((p, i) => (
              <Reveal key={p.id} index={i} style={{ marginBottom: 10 }}>
                <Card style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowTitle}>{p.full_name}</Text>
                    <Text style={styles.rowSub}>{p.department}</Text>
                  </View>
                  <Tappable style={styles.smallApprove} onPress={() => approveReg(p)}>
                    <Text style={styles.smallApproveText}>Approve</Text>
                  </Tappable>
                  <Tappable style={styles.smallReject} onPress={() => rejectReg(p)}>
                    <Text style={styles.smallRejectText}>Reject</Text>
                  </Tappable>
                </Card>
              </Reveal>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (section === 'pendingreqs') {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {backRow}
          <Text style={styles.sectionTitle}>Pending detail-change requests</Text>
          {pendingReqs.length === 0 ? (
            <Text style={styles.helper}>No pending requests.</Text>
          ) : (
            pendingReqs.map((r, i) => (
              <Reveal key={r.id} index={i} style={{ marginBottom: 10 }}>
                <Card style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowTitle}>{r.full_name}</Text>
                    <Text style={styles.rowSub}>{r.message}</Text>
                  </View>
                  <Tappable style={styles.smallApprove} onPress={() => dismissRequest(r)}>
                    <Text style={styles.smallApproveText}>Dismiss</Text>
                  </Tappable>
                </Card>
              </Reveal>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="You" title="Account" subtitle="Profile, staff & permissions" gradient={gradients.primary} />

        <View style={styles.body}>
          <Card style={styles.meCard}>
            <View style={styles.meRow}>
              <Avatar name={ME.full_name} size={52} color={colors.primary} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.meName}>
                  {ME.full_name} {ME.is_owner ? <Text style={styles.ownerBadge}>Owner</Text> : null}
                </Text>
                <Text style={styles.meSub}>{ME.phone} · @{ME.username}</Text>
                <Text style={styles.meSub}>{ME.department} · {ME.position}</Text>
              </View>
            </View>
            <GhostButton label="Log out" onPress={logout} style={{ marginTop: 4 }} />
          </Card>

          <MenuRow index={0} icon="notifications" color={colors.amber} label="Pending Registrations" badge={pendingRegs.length} onPress={() => setSection('pendingregs')} />
          <MenuRow index={1} icon="people" color={colors.primary} label="Manage Accounts" onPress={() => setSection('manage')} />
          <MenuRow index={2} icon="cube" color={colors.emerald} label="Departments" onPress={() => setSection('departments')} />
          <MenuRow index={3} icon="create" color={colors.plum} label="Pending Requests" badge={pendingReqs.length} onPress={() => setSection('pendingreqs')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 40 },
  body: { paddingHorizontal: spacing.lg, marginTop: -18, gap: 10 },
  meCard: { marginBottom: 4 },
  meRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  meName: { fontSize: 15, fontWeight: '800', color: colors.ink },
  ownerBadge: { fontSize: 10, fontWeight: '700', color: '#0F7A50', backgroundColor: colors.successBg, paddingHorizontal: 6, borderRadius: 8, overflow: 'hidden' },
  meSub: { fontSize: 12, color: colors.inkFaint, marginTop: 2, fontWeight: '500' },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.ink },
  rowTitle: { fontSize: 14, fontWeight: '700', color: colors.ink },
  rowSub: { fontSize: 12, color: colors.inkFaint, marginTop: 2, fontWeight: '500' },
  backRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.lg, marginTop: 16, marginBottom: 12 },
  backText: { color: colors.primary, fontWeight: '700', marginLeft: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.ink, marginHorizontal: spacing.lg, marginBottom: 12 },
  helper: { fontSize: 13, color: colors.inkFaint, marginHorizontal: spacing.lg },
  smallApprove: { backgroundColor: colors.successBg, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.sm, marginLeft: 6 },
  smallApproveText: { fontSize: 11, fontWeight: '700', color: '#0F7A50' },
  smallReject: { backgroundColor: colors.dangerBg, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.sm, marginLeft: 6 },
  smallRejectText: { fontSize: 11, fontWeight: '700', color: colors.danger },
});
