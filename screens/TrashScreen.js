import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ScreenHeader,
  Card,
  Tappable,
  Reveal,
  EmptyState,
  colors,
  gradients,
  radius,
  spacing,
} from '../theme/UI';

// Mirrors TRASH_TABLES on the web: any soft-deleted record from any module
// shows up here until restored or permanently deleted. Wire each module's
// delete action to move items here instead of removing them outright.
const SEED_TRASH = [
  { id: 't1', label: 'Student', name: 'Michael Okot', deleted_at: new Date(Date.now() - 2 * 86400000).toISOString(), icon: 'person' },
  { id: 't2', label: 'Book', name: 'Introduction to Biology (Copy 3)', deleted_at: new Date(Date.now() - 5 * 86400000).toISOString(), icon: 'book' },
];

export default function TrashScreen() {
  const [items, setItems] = useState(SEED_TRASH);

  function restore(item) {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    Alert.alert('Restored', `${item.name} has been restored.`);
  }

  function deleteForever(item) {
    Alert.alert('Permanently delete?', `"${item.name}" cannot be recovered after this.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete permanently', style: 'destructive', onPress: () => setItems((prev) => prev.filter((i) => i.id !== item.id)) },
    ]);
  }

  function emptyTrash() {
    if (!items.length) return;
    Alert.alert('Empty trash?', `Permanently delete all ${items.length} item(s)? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete all', style: 'destructive', onPress: () => setItems([]) },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        eyebrow="Cleanup"
        title="Trash"
        subtitle="Items stay here until restored or permanently deleted"
        gradient={gradients.ink}
        right={
          items.length > 0 ? (
            <Tappable onPress={emptyTrash} style={styles.emptyBtn}>
              <Ionicons name="trash" size={14} color="#fff" />
              <Text style={styles.emptyBtnText}>Empty trash</Text>
            </Tappable>
          ) : null
        }
      />
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 24, marginTop: -8 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState icon="trash-outline" title="Trash is empty" />}
        renderItem={({ item, index }) => (
          <Reveal index={index} style={{ marginBottom: 10 }}>
            <Card
              style={styles.row}
              onPress={() =>
                Alert.alert(item.name, undefined, [
                  { text: 'Restore', onPress: () => restore(item) },
                  { text: 'Delete permanently', style: 'destructive', onPress: () => deleteForever(item) },
                  { text: 'Cancel', style: 'cancel' },
                ])
              }
            >
              <View style={styles.iconWrap}>
                <Ionicons name={item.icon} size={18} color={colors.inkFaint} />
              </View>
              <View style={styles.rowMain}>
                <Text style={styles.rowTitle}>{item.name}</Text>
                <Text style={styles.rowSub}>
                  {item.label} · deleted {new Date(item.deleted_at).toLocaleDateString()}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
            </Card>
          </Reveal>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  emptyBtnText: { fontSize: 12, fontWeight: '700', color: '#fff', marginLeft: 4 },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowMain: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: '700', color: colors.ink },
  rowSub: { fontSize: 12, color: colors.inkFaint, marginTop: 2, fontWeight: '500' },
});
