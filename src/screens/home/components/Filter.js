import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function Filtros({
  onApply,
  branches = [],
  disciplines = [],
  dates = [],
}) {
  const [branch, setBranch] = useState(null);
  const [discipline, setDiscipline] = useState(null);
  const [date, setDate] = useState(null);

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>⚙️ Filtros</Text>

      {/* SEDE */}
      <Text style={styles.label}>🏢 Sede</Text>
      <View style={styles.row}>
        {branches.length === 0 ? (
          <Text style={styles.empty}>No hay sedes disponibles</Text>
        ) : (
          branches.map((b) => (
            <TouchableOpacity
              key={b}
              style={[styles.chip, branch === b && styles.chipActive]}
              onPress={() => setBranch(b)}
            >
              <Text
                style={[
                  styles.chipText,
                  branch === b && styles.chipTextActive,
                ]}
              >
                {b}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* DISCIPLINA */}
      <Text style={styles.label}>🏋️ Disciplina</Text>
      <View style={styles.row}>
        {disciplines.length === 0 ? (
          <Text style={styles.empty}>No hay disciplinas disponibles</Text>
        ) : (
          disciplines.map((d) => (
            <TouchableOpacity
              key={d}
              style={[
                styles.chip,
                discipline === d && styles.chipActive,
              ]}
              onPress={() => setDiscipline(d)}
            >
              <Text
                style={[
                  styles.chipText,
                  discipline === d && styles.chipTextActive,
                ]}
              >
                {d}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* FECHA */}
      <Text style={styles.label}>📅 Fecha</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {dates.length === 0 ? (
          <Text style={styles.empty}>No hay fechas disponibles</Text>
        ) : (
          dates.map((dt) => (
            <TouchableOpacity
              key={dt}
              style={[styles.chip, date === dt && styles.chipActive]}
              onPress={() => setDate(dt)}
            >
              <Text
                style={[
                  styles.chipText,
                  date === dt && styles.chipTextActive,
                ]}
              >
                {dt}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.apply}
        onPress={() => onApply({ branch, discipline, date })}
      >
        <Text style={styles.applyText}>Aplicar filtros</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 15 },
  label: { fontSize: 15, fontWeight: "600", marginTop: 10 },
  empty: { color: "#999", marginVertical: 10 },
  row: { flexDirection: "row", flexWrap: "wrap", marginVertical: 5 },

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: "#667eea" },

  chipText: { fontWeight: "600", color: "#333" },
  chipTextActive: { color: "white" },

  apply: {
    marginTop: 15,
    backgroundColor: "#667eea",
    padding: 12,
    borderRadius: 8,
  },
  applyText: { color: "white", textAlign: "center", fontWeight: "700" },
});
