import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getPokemonDetails } from "../../services/pokemonService";

const Detail = ({ route }) => {
  const navigation = useNavigation();
  const { pokemonUrl } = route.params;
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        const pokemonId = pokemonUrl.split("/").filter(Boolean).pop();
        const details = await getPokemonDetails(pokemonId);
        setPokemon(details);
        setError(null);
      } catch (err) {
        setError("No se pudieron cargar los detalles del Pokémon");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [pokemonUrl]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E63F34" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!pokemon) {
    return null;
  }

  const types = pokemon.types.map((type) => type.type.name).join(", ");
  const abilities = pokemon.abilities
    .map((ability) => ability.ability.name)
    .join(", ");

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.name}>{pokemon.name.toUpperCase()}</Text>
        <Text style={styles.id}>#{pokemon.id}</Text>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Altura:</Text>
            <Text style={styles.value}>{pokemon.height / 10}m</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Peso:</Text>
            <Text style={styles.value}>{pokemon.weight / 10}kg</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Tipos:</Text>
            <Text style={styles.value}>{types}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Habilidades:</Text>
            <Text style={styles.value}>{abilities}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
  id: {
    fontSize: 20,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  infoSection: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#666",
    textTransform: "capitalize",
  },
  button: {
    backgroundColor: "#E63F34",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#E63F34",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default Detail;
