import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
      <View style={styles.header}>
        <Text style={styles.helper}>Items stay here until restored or permanently deleted.</Text>
        {items.length > 0 && (
          <TouchableOpacity style={styles.emptyBtn} onPress={emptyTrash}>
            <Ionicons name="trash" size={14} color="#D6564F" />
            <Text style={styles.emptyBtnText}>Empty trash</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={{ padding: 32, alignItems: 'center' }}>
            <Ionicons name="trash-outline" size={28} color="#9AA3B5" />
            <Text style={styles.emptyText}>Trash is empty.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
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
              <Ionicons name={item.icon} size={18} color="#6B7280" />
            </View>
            <View style={styles.rowMain}>
              <Text style={styles.rowTitle}>{item.name}</Text>
              <Text style={styles.rowSub}>
                {item.label} · deleted {new Date(item.deleted_at).toLocaleDateString()}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9AA3B5" />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEF2F9' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 8 },
  helper: { fontSize: 12, color: '#6B7280', flex: 1 },
  emptyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, backgroundColor: '#FDECEC' },
  emptyBtnText: { fontSize: 12, fontWeight: '700', color: '#D6564F', marginLeft: 4 },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  emptyText: { color: '#9AA3B5', fontSize: 13, marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EEF2F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowMain: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: '700', color: '#16274A' },
  rowSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
});
