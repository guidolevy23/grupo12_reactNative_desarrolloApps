import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Button, TextInput, Card, Surface, TouchableRipple, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PaperExample() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={[styles.mainTitle, { color: theme.colors.onBackground }]}>
          React Native Paper
        </Text>

        <Surface style={styles.surface} elevation={2}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Button
          </Text>
          <Button mode="contained" onPress={() => Alert.alert("Contained Button")}>
            Contained
          </Button>
          <Button mode="outlined" onPress={() => Alert.alert("Outlined Button")} style={styles.button}>
            Outlined
          </Button>
          <Button mode="text" onPress={() => Alert.alert("Text Button")} style={styles.button}>
            Text
          </Button>
          <Button mode="elevated" onPress={() => Alert.alert("Elevated Button")} style={styles.button}>
            Elevated
          </Button>
          <Button icon="camera" mode="contained" onPress={() => Alert.alert("Icon Button")} style={styles.button}>
            With Icon
          </Button>
        </Surface>

        <Surface style={styles.surface} elevation={2}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            TextInput
          </Text>
          <TextInput
            label="Flat Input"
            value={text}
            onChangeText={setText}
            mode="flat"
            style={styles.input}
          />
          <TextInput
            label="Outlined Input"
            value={text}
            onChangeText={setText}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            right={<TextInput.Icon icon="eye" />}
            mode="outlined"
            style={styles.input}
          />
        </Surface>

        <Card style={styles.card}>
          <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
          <Card.Title title="Card Title" subtitle="Card Subtitle" />
          <Card.Content>
            <Text variant="bodyMedium">
              Este es un ejemplo de Card con imagen, título, subtítulo y contenido.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => Alert.alert("Cancel")}>Cancel</Button>
            <Button onPress={() => Alert.alert("Ok")}>Ok</Button>
          </Card.Actions>
        </Card>

        <Surface style={styles.surface} elevation={4}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Surface
          </Text>
          <Text variant="bodyMedium">
            Surface con elevation 4. Se usa para crear contenedores con sombra.
          </Text>
        </Surface>

        <Surface style={styles.surface} elevation={2}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            TouchableRipple
          </Text>
          <TouchableRipple
            onPress={() => Alert.alert("TouchableRipple pressed")}
            rippleColor="rgba(98, 0, 238, .32)"
            style={styles.ripple}
          >
            <View style={styles.rippleContent}>
              <Text variant="bodyLarge">Presiona aquí</Text>
              <Text variant="bodySmall">Efecto ripple al tocar</Text>
            </View>
          </TouchableRipple>
        </Surface>

        <View style={{ height: insets.bottom + 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  mainTitle: {
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  surface: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: "600",
  },
  button: {
    marginTop: 8,
  },
  input: {
    marginBottom: 12,
  },
  card: {
    marginBottom: 16,
  },
  ripple: {
    borderRadius: 8,
    overflow: "hidden",
  },
  rippleContent: {
    padding: 16,
    backgroundColor: "#e8eaf6",
    borderRadius: 8,
  },
});
