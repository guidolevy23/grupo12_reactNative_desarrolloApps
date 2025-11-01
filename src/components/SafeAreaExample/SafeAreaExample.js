import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets, useSafeAreaFrame } from "react-native-safe-area-context";

export default function SafeAreaExample() {
  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerText}>Safe Area Example</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.title}>useSafeAreaInsets</Text>
          <Text style={styles.text}>Top: {insets.top}</Text>
          <Text style={styles.text}>Bottom: {insets.bottom}</Text>
          <Text style={styles.text}>Left: {insets.left}</Text>
          <Text style={styles.text}>Right: {insets.right}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>useSafeAreaFrame</Text>
          <Text style={styles.text}>Width: {frame.width.toFixed(2)}</Text>
          <Text style={styles.text}>Height: {frame.height.toFixed(2)}</Text>
          <Text style={styles.text}>X: {frame.x}</Text>
          <Text style={styles.text}>Y: {frame.y}</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <Text style={styles.footerText}>Footer con padding bottom</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#6200ee",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: "#666",
  },
  footer: {
    backgroundColor: "#03dac6",
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});
