import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Card, Text, Switch, Surface, useTheme as usePaperTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeExample() {
  const insets = useSafeAreaInsets();
  const { isDarkMode, toggleTheme } = useTheme();
  const paperTheme = usePaperTheme();

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
      >
        <Text variant="headlineMedium" style={[styles.mainTitle, { color: paperTheme.colors.onBackground }]}>
          Tema {isDarkMode ? "Oscuro" : "Claro"}
        </Text>

        {/* Control de Tema */}
        <Surface style={styles.surface} elevation={2}>
          <View style={styles.switchContainer}>
            <Text variant="titleMedium" style={{ color: paperTheme.colors.onSurface }}>
              {isDarkMode ? "🌙 Modo Oscuro" : "☀️ Modo Claro"}
            </Text>
            <Switch value={isDarkMode} onValueChange={toggleTheme} />
          </View>
          <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 8 }}>
            Cambia entre tema claro y oscuro
          </Text>
        </Surface>


        {/* Card con Tema */}
        <Card style={styles.card}>
          <Card.Title
            title="Card Temática"
            subtitle="Se adapta al tema actual"
          />
          <Card.Content>
            <Text variant="bodyMedium">
              Este card y todos los componentes de Paper se adaptan automáticamente al tema seleccionado.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button>Cancelar</Button>
            <Button mode="contained">Aceptar</Button>
          </Card.Actions>
        </Card>

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
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    marginTop: 8,
  },
  card: {
    marginBottom: 16,
  },
  colorBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
