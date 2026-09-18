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
  Tappable,
  Reveal,
  FAB,
  GradientButton,
  GhostButton,
  EmptyState,
  colors,
  gradients,
  radius,
  spacing,
} from '../theme/UI';

const MODULES = {
  property: { label: 'Property Register', categoryLabel: 'Category (Furniture, Building, Vehicle, Land)', locationLabel: 'Location' },
  classroom: { label: 'Classroom Equipment', categoryLabel: 'Category (Desks, Projector, Whiteboard)', locationLabel: 'Classroom' },
  lab: { label: 'Laboratory Equipment', categoryLabel: 'Lab (Physics, Chemistry, Biology, Computer)', locationLabel: 'Location / bench' },
  stationery: { label: 'Stationery Store', categoryLabel: 'Category (Paper, Pens, Printing)', locationLabel: 'Store location' },
};

const SEED = {
  property: [
    { id: 'p1', name: 'Admin Block', category: 'Building', location: 'Main Campus', quantity: 1 },
  ],
  classroom: [
    { id: 'c1', name: 'Student Desks', category: 'Desks', location: 'Grade 9', quantity: 40 },
  ],
  lab: [
    { id: 'l1', name: 'Microscopes', category: 'Biology', location: 'Science Lab', quantity: 12 },
  ],
  stationery: [
    { id: 's1', name: 'A4 Paper Reams', category: 'Paper', location: 'Store Room', quantity: 50 },
  ],
};

function emptyItem() {
  return { name: '', category: '', location: '', quantity: '' };
}

export default function InventoryScreen() {
  const [tab, setTab] = useState('property');
  const [data, setData] = useState(SEED);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyItem());

  const def = MODULES[tab];
  const items = data[tab];

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyItem());
    setFormVisible(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm(item);
    setFormVisible(true);
  };

  const save = () => {
    if (!form.name.trim()) {
      Alert.alert('Missing info', 'Item name is required.');
      return;
    }
    if (editingId) {
      setData((prev) => ({
        ...prev,
        [tab]: prev[tab].map((i) => (i.id === editingId ? { ...i, ...form } : i)),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [tab]: [...prev[tab], { ...form, id: Date.now().toString() }],
      }));
    }
    setFormVisible(false);
  };

  const remove = (item) => {
    Alert.alert('Move to trash?', `Move "${item.name}" to trash?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Move to trash',
        style: 'destructive',
        onPress: () =>
          setData((prev) => ({ ...prev, [tab]: prev[tab].filter((i) => i.id !== item.id) })),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader eyebrow="Assets & stock" title="Inventory" subtitle={def.label} gradient={gradients.amber} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow} contentContainerStyle={{ paddingRight: 16 }}>
        {Object.entries(MODULES).map(([id, m]) => (
          <Chip key={id} label={m.label} active={tab === id} activeGradient={gradients.amber} onPress={() => setTab(id)} />
        ))}
      </ScrollView>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState icon="cube-outline" title="No items yet" />}
        renderItem={({ item, index }) => (
          <Reveal index={index} style={{ marginBottom: 10 }}>
            <Card onPress={() => openEdit(item)} style={styles.itemCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemSub}>
                  {item.category} · {item.location} · Qty {item.quantity}
                </Text>
              </View>
              <Tappable onPress={() => remove(item)} style={styles.dangerLinkWrap}>
                <Text style={styles.dangerLinkText}>Delete</Text>
              </Tappable>
            </Card>
          </Reveal>
        )}
      />

      <FAB onPress={openAdd} gradient={gradients.amber} />

      <Modal visible={formVisible} animationType="slide" onRequestClose={() => setFormVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <ScreenHeader
            eyebrow={def.label}
            title={editingId ? 'Edit item' : 'Add item'}
            gradient={gradients.amber}
            right={
              <Tappable onPress={() => setFormVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#fff" />
              </Tappable>
            }
          />
          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.field}>
              <Text style={styles.label}>Item name</Text>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(v) => setForm({ ...form, name: v })}
                placeholderTextColor={colors.placeholder}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>{def.categoryLabel}</Text>
              <TextInput
                style={styles.input}
                value={form.category}
                onChangeText={(v) => setForm({ ...form, category: v })}
                placeholderTextColor={colors.placeholder}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>{def.locationLabel}</Text>
              <TextInput
                style={styles.input}
                value={form.location}
                onChangeText={(v) => setForm({ ...form, location: v })}
                placeholderTextColor={colors.placeholder}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                value={String(form.quantity)}
                onChangeText={(v) => setForm({ ...form, quantity: v })}
                keyboardType="numeric"
                placeholderTextColor={colors.placeholder}
              />
            </View>

            <View style={styles.modalActions}>
              <GhostButton label="Cancel" onPress={() => setFormVisible(false)} style={{ flex: 1 }} />
              <GradientButton label={editingId ? 'Save changes' : 'Add item'} icon="checkmark" gradient={gradients.amber} onPress={save} style={{ flex: 1 }} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  pillRow: { paddingHorizontal: spacing.lg, marginTop: -16, maxHeight: 52 },
  itemCard: { flexDirection: 'row', alignItems: 'center' },
  itemTitle: { fontSize: 15, fontWeight: '700', color: colors.ink },
  itemSub: { fontSize: 12.5, color: colors.inkFaint, marginTop: 3, fontWeight: '500' },
  dangerLinkWrap: { paddingHorizontal: 6, paddingVertical: 6 },
  dangerLinkText: { color: colors.danger, fontWeight: '700', fontSize: 12.5 },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalBody: { padding: spacing.lg, paddingBottom: 40 },
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
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
});
