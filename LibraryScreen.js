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
  Badge,
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

const SEED_BOOKS = [
  { id: 'b1', title: 'Introduction to Biology', author: 'J. Smith', total_copies: 10, available_copies: 7, condition: 'Good' },
  { id: 'b2', title: 'Algebra Basics', author: 'M. Otieno', total_copies: 6, available_copies: 0, condition: 'Fair' },
];

const CONDITIONS = ['New', 'Good', 'Fair', 'Poor'];

function emptyBook() {
  return { title: '', author: '', total_copies: '', available_copies: '', condition: 'Good' };
}

function conditionTone(cond) {
  if (cond === 'New' || cond === 'Good') return 'success';
  if (cond === 'Fair') return 'warning';
  return 'danger';
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
      <ScreenHeader eyebrow="Library" title="Library" subtitle={`${books.length} titles in the catalog`} gradient={gradients.emerald} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow} contentContainerStyle={{ paddingRight: 16 }}>
        {[
          ['catalog', 'Book Catalog'],
          ['borrowing', 'Borrowing & Returns'],
        ].map(([id, label]) => (
          <Chip key={id} label={label} active={tab === id} activeGradient={gradients.emerald} onPress={() => setTab(id)} />
        ))}
      </ScrollView>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={17} color={colors.inkFaint} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.search}
          placeholder="Search by title"
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
        ListEmptyComponent={<EmptyState icon="book-outline" title="No books yet" />}
        renderItem={({ item, index }) => {
          const outOfStock = item.available_copies <= 0;
          return (
            <Reveal index={index} style={{ marginBottom: 10 }}>
              <Card style={styles.card}>
                <Tappable style={{ flex: 1 }} onPress={() => openEdit(item)}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSub}>{item.author}</Text>
                  <View style={styles.cardMeta}>
                    <Badge label={item.condition} tone={conditionTone(item.condition)} />
                    <Text style={[styles.copiesText, outOfStock && { color: colors.danger }]}>
                      {item.available_copies}/{item.total_copies} available
                    </Text>
                  </View>
                </Tappable>
                {tab === 'borrowing' && (
                  <View style={{ gap: 8 }}>
                    <Tappable
                      style={[styles.smallBtn, outOfStock && styles.smallBtnDisabled]}
                      onPress={outOfStock ? undefined : () => lendCopy(item)}
                    >
                      <Text style={styles.smallBtnText}>Lend</Text>
                    </Tappable>
                    <Tappable style={styles.smallBtnGhost} onPress={() => returnCopy(item)}>
                      <Text style={styles.smallBtnGhostText}>Return</Text>
                    </Tappable>
                  </View>
                )}
              </Card>
            </Reveal>
          );
        }}
      />

      {tab === 'catalog' && <FAB onPress={openAdd} gradient={gradients.emerald} />}

      <Modal visible={formVisible} animationType="slide" onRequestClose={() => setFormVisible(false)}>
        <SafeAreaView style={styles.safe}>
          <ScreenHeader
            eyebrow="Library"
            title={editingId ? 'Edit book' : 'Add book'}
            gradient={gradients.emerald}
            right={
              <Tappable onPress={() => setFormVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#fff" />
              </Tappable>
            }
          />
          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.field}>
              <Text style={styles.label}>Title</Text>
              <TextInput style={styles.input} value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} placeholderTextColor={colors.placeholder} />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Author</Text>
              <TextInput style={styles.input} value={form.author} onChangeText={(v) => setForm({ ...form, author: v })} placeholderTextColor={colors.placeholder} />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Total copies</Text>
              <TextInput
                style={styles.input}
                value={String(form.total_copies)}
                onChangeText={(v) => setForm({ ...form, total_copies: v })}
                keyboardType="numeric"
                placeholderTextColor={colors.placeholder}
              />
            </View>
            <Text style={styles.label}>Condition</Text>
            <View style={styles.chipRow}>
              {CONDITIONS.map((c) => (
                <Chip key={c} label={c} active={form.condition === c} activeGradient={gradients.emerald} onPress={() => setForm({ ...form, condition: c })} />
              ))}
            </View>

            <View style={styles.modalActions}>
              <GhostButton label="Cancel" onPress={() => setFormVisible(false)} style={{ flex: 1 }} />
              <GradientButton label={editingId ? 'Save changes' : 'Add book'} icon="checkmark" gradient={gradients.emerald} onPress={save} style={{ flex: 1 }} />
            </View>
            {editingId && (
              <Tappable
                style={styles.dangerLink}
                onPress={() => {
                  setFormVisible(false);
                  remove(form);
                }}
              >
                <Text style={styles.dangerLinkText}>Move to trash</Text>
              </Tappable>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  pillRow: { paddingHorizontal: spacing.lg, marginTop: -16, maxHeight: 52 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  search: { flex: 1, fontSize: 14, color: colors.ink },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.ink },
  cardSub: { fontSize: 12.5, color: colors.inkFaint, marginTop: 2, fontWeight: '500' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  copiesText: { fontSize: 12, color: colors.inkSoft, fontWeight: '600' },
  smallBtn: { backgroundColor: colors.emerald, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.sm },
  smallBtnDisabled: { backgroundColor: colors.borderStrong },
  smallBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  smallBtnGhost: { borderWidth: 1.5, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.sm },
  smallBtnGhostText: { color: colors.inkSoft, fontWeight: '700', fontSize: 12 },
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
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  dangerLink: { alignItems: 'center', marginTop: 18, marginBottom: 10, paddingVertical: 10 },
  dangerLinkText: { color: colors.danger, fontWeight: '800', fontSize: 13 },
});
