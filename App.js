import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';

// ---------- Reusable list screen for Students / Teachers / Classes ----------
function ManagerScreen({ title, placeholder, extraPlaceholder, items, setItems }) {
  const [name, setName] = useState('');
  const [extra, setExtra] = useState('');

  const addItem = () => {
    if (!name.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      name: name.trim(),
      extra: extra.trim(),
    };
    setItems([newItem, ...items]);
    setName('');
    setExtra('');
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={name}
          onChangeText={setName}
        />
        {extraPlaceholder ? (
          <TextInput
            style={styles.input}
            placeholder={extraPlaceholder}
            value={extra}
            onChangeText={setExtra}
          />
        ) : null}
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No {title.toLowerCase()} yet.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              {item.extra ? <Text style={styles.cardSubtitle}>{item.extra}</Text> : null}
            </View>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

// ---------- Root App with simple tab switcher (no extra libraries needed) ----------
export default function App() {
  const [activeTab, setActiveTab] = useState('students');

  const [students, setStudents] = useState([
    { id: '1', name: 'Amina Yusuf', extra: 'Grade 9' },
    { id: '2', name: 'John Mensah', extra: 'Grade 10' },
  ]);
  const [teachers, setTeachers] = useState([
    { id: '1', name: 'Mrs. Adjei', extra: 'Mathematics' },
  ]);
  const [classes, setClasses] = useState([
    { id: '1', name: 'Grade 9 - A', extra: 'Homeroom: Mrs. Adjei' },
  ]);

  const tabs = [
    { key: 'students', label: 'Students' },
    { key: 'teachers', label: 'Teachers' },
    { key: 'classes', label: 'Classes' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>School Manager</Text>
      </View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.key && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'students' && (
        <ManagerScreen
          title="Students"
          placeholder="Student name"
          extraPlaceholder="Grade / Class"
          items={students}
          setItems={setStudents}
        />
      )}
      {activeTab === 'teachers' && (
        <ManagerScreen
          title="Teachers"
          placeholder="Teacher name"
          extraPlaceholder="Subject"
          items={teachers}
          setItems={setTeachers}
        />
      )}
      {activeTab === 'classes' && (
        <ManagerScreen
          title="Classes"
          placeholder="Class name"
          extraPlaceholder="Homeroom teacher"
          items={classes}
          setItems={setClasses}
        />
      )}
    </SafeAreaView>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  header: {
    backgroundColor: '#2F6690',
    paddingVertical: 18,
    alignItems: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tabItemActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#2F6690',
  },
  tabLabel: { color: '#888', fontWeight: '600' },
  tabLabelActive: { color: '#2F6690' },
  screen: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: '#222' },
  inputRow: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#2F6690',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: '700' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#222' },
  cardSubtitle: { fontSize: 13, color: '#777', marginTop: 2 },
  removeText: { color: '#C0392B', fontWeight: '600' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40 },
});
