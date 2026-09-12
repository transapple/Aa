import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";

export default function ExamsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Text style={styles.emoji}>📝</Text>
        <Text style={styles.title}>Exams</Text>
        <Text style={styles.subtitle}>This module is coming soon.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#EEF2F9" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emoji: { fontSize: 44, marginBottom: 14 },
  title: { fontSize: 19, fontWeight: "800", color: "#16274A", marginBottom: 6 },
  subtitle: { fontSize: 13, color: "#5B647A" },
});
