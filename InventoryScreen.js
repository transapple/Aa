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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
        {Object.entries(MODULES).map(([id, m]) => (
          <TouchableOpacity
            key={id}
            style={[styles.pill, tab === id && styles.pillActive]}
            onPress={() => setTab(id)}
          >
            <Text style={[styles.pillText, tab === id && styles.pillTextActive]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No items yet.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemCard} onPress={() => openEdit(item)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemSub}>
                {item.category} · {item.location} · Qty {item.quantity}
              </Text>
            </View>
            <TouchableOpacity onPress={() => remove(item)}>
              <Text style={styles.dangerLinkText}>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={openAdd}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={formVisible} animationType="slide" onRequestClose={() => setFormVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit item' : `Add ${def.label.toLowerCase()} item`}</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Item name</Text>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(v) => setForm({ ...form, name: v })}
                placeholderTextColor="#9AA3B5"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>{def.categoryLabel}</Text>
              <TextInput
                style={styles.input}
                value={form.category}
                onChangeText={(v) => setForm({ ...form, category: v })}
                placeholderTextColor="#9AA3B5"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>{def.locationLabel}</Text>
              <TextInput
                style={styles.input}
                value={form.location}
                onChangeText={(v) => setForm({ ...form, location: v })}
                placeholderTextColor="#9AA3B5"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                value={String(form.quantity)}
                onChangeText={(v) => setForm({ ...form, quantity: v })}
                keyboardType="numeric"
                placeholderTextColor="#9AA3B5"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.ghostButton} onPress={() => setFormVisible(false)}>
                <Text style={styles.ghostButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={save}>
                <Text style={styles.primaryButtonText}>{editingId ? 'Save changes' : 'Add item'}</Text>
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
  emptyText: { textAlign: 'center', color: '#9AA3B5', marginTop: 40 },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    marginTop: 6,
  },
  itemTitle: { fontSize: 15, fontWeight: '700', color: '#1D2433' },
  itemSub: { fontSize: 12.5, color: '#5B647A', marginTop: 3 },
  dangerLinkText: { color: '#D6564F', fontWeight: '700', fontSize: 12.5 },
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
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#16274A', marginBottom: 16 },
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
