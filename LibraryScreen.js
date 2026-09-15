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

const SEED_BOOKS = [
  { id: 'b1', title: 'Introduction to Biology', author: 'J. Smith', total_copies: 10, available_copies: 7, condition: 'Good' },
  { id: 'b2', title: 'Algebra Basics', author: 'M. Otieno', total_copies: 6, available_copies: 0, condition: 'Fair' },
];

const CONDITIONS = ['New', 'Good', 'Fair', 'Poor'];

function emptyBook() {
  return { title: '', author: '', total_copies: '', available_copies: '', condition: 'Good' };
}

function conditionColor(cond) {
  if (cond === 'New' || cond === 'Good') return { bg: '#E4F5EE', fg: '#227A61' };
  if (cond === 'Fair') return { bg: '#FDF1DE', fg: '#A06A13' };
  return { bg: '#FDECEC', fg: '#B23F39' };
}

export default function LibraryScreen() {
  const [tab, setTab] = useState('catalog'); // catalog | overdue | fines
  const [books, setBooks] = useState(SEED_BOOKS);
  const [search, setSearch] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyBook());

  const filtered = books.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyBook());
    setFormVisible(true);
  };

  const openEdit = (book) => {
    setEditingId(book.id);
    setForm(book);
    setFormVisible(true);
  };

  const save = () => {
    if (!form.title.trim()) {
      Alert.alert('Missing info', 'Book title is required.');
      return;
    }
    if (editingId) {
      setBooks((prev) => prev.map((b) => (b.id === editingId ? { ...b, ...form } : b)));
    } else {
      const total = Number(form.total_copies) || 0;
      setBooks((prev) => [
        ...prev,
        { ...form, id: Date.now().toString(), total_copies: total, available_copies: total },
      ]);
    }
    setFormVisible(false);
  };

  const remove = (book) => {
    Alert.alert('Move to trash?', `Move "${book.title}" to trash?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Move to trash',
        style: 'destructive',
        onPress: () => setBooks((prev) => prev.filter((b) => b.id !== book.id)),
      },
    ]);
  };

  const lendCopy = (book) => {
    if (book.available_copies <= 0) {
      Alert.alert('No copies available', 'All copies of this book are currently borrowed.');
      return;
    }
    setBooks((prev) =>
      prev.map((b) => (b.id === book.id ? { ...b, available_copies: b.available_copies - 1 } : b))
    );
  };

  const returnCopy = (book) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === book.id
          ? { ...b, available_copies: Math.min(b.available_copies + 1, b.total_copies) }
          : b
      )
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
        {[
          ['catalog', 'Book Catalog'],
          ['borrowing', 'Borrowing & Returns'],
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

      <View style={styles.topBar}>
        <TextInput
          style={styles.search}
          placeholder="Search by title"
          placeholderTextColor="#9AA3B5"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No books yet.</Text>}
        renderItem={({ item }) => {
          const cc = conditionColor(item.condition);
          const outOfStock = item.available_copies <= 0;
          return (
            <View style={styles.card}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => openEdit(item)}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSub}>{item.author}</Text>
                <View style={styles.cardMeta}>
                  <View style={[styles.badge, { backgroundColor: cc.bg }]}>
                    <Text style={[styles.badgeText, { color: cc.fg }]}>{item.condition}</Text>
                  </View>
                  <Text style={[styles.copiesText, outOfStock && { color: '#D6564F' }]}>
                    {item.available_copies}/{item.total_copies} available
                  </Text>
                </View>
              </TouchableOpacity>
              {tab === 'borrowing' && (
                <View style={{ gap: 8 }}>
                  <TouchableOpacity
                    style={[styles.smallBtn, outOfStock && styles.smallBtnDisabled]}
                    onPress={() => lendCopy(item)}
                    disabled={outOfStock}
                  >
                    <Text style={styles.smallBtnText}>Lend</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.smallBtnGhost} onPress={() => returnCopy(item)}>
                    <Text style={styles.smallBtnGhostText}>Return</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      />

      {tab === 'catalog' && (
        <TouchableOpacity style={styles.fab} onPress={openAdd}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      <Modal visible={formVisible} animationType="slide" onRequestClose={() => setFormVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit book' : 'Add book'}</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Title</Text>
              <TextInput style={styles.input} value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} placeholderTextColor="#9AA3B5" />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Author</Text>
              <TextInput style={styles.input} value={form.author} onChangeText={(v) => setForm({ ...form, author: v })} placeholderTextColor="#9AA3B5" />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Total copies</Text>
              <TextInput
                style={styles.input}
                value={String(form.total_copies)}
                onChangeText={(v) => setForm({ ...form, total_copies: v })}
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.label}>Condition</Text>
            <View style={styles.chipRow}>
              {CONDITIONS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.chip, form.condition === c && styles.chipActive]}
                  onPress={() => setForm({ ...form, condition: c })}
                >
                  <Text style={[styles.chipText, form.condition === c && styles.chipTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.ghostButton} onPress={() => setFormVisible(false)}>
                <Text style={styles.ghostButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={save}>
                <Text style={styles.primaryButtonText}>{editingId ? 'Save changes' : 'Add book'}</Text>
              </TouchableOpacity>
            </View>
            {editingId && (
              <TouchableOpacity
                style={styles.dangerLink}
                onPress={() => {
                  setFormVisible(false);
                  remove(form);
                }}
              >
                <Text style={styles.dangerLinkText}>Move to trash</Text>
              </TouchableOpacity>
            )}
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
  topBar: { paddingHorizontal: 16, paddingTop: 12 },
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
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    alignItems: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1D2433' },
  cardSub: { fontSize: 12.5, color: '#5B647A', marginTop: 2 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  copiesText: { fontSize: 12, color: '#5B647A', fontWeight: '600' },
  smallBtn: { backgroundColor: '#16274A', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  smallBtnDisabled: { backgroundColor: '#C7CDDA' },
  smallBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  smallBtnGhost: { borderWidth: 1.5, borderColor: '#E4E8EF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  smallBtnGhostText: { color: '#5B647A', fontWeight: '700', fontSize: 12 },
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
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 10 },
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
  dangerLink: { alignItems: 'center', marginTop: 8, marginBottom: 30 },
  dangerLinkText: { color: '#D6564F', fontWeight: '700', fontSize: 13 },
});
