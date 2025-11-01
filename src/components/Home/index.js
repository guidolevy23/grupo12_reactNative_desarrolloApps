import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getPokemonList } from "../../services/pokemonService";
import { getToken } from "../../utils/tokenStorage";
import { AuthContext } from "../../context/AuthContext";

const Home = ({ navigation }) => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useContext(AuthContext);

  const fetchPokemons = async () => {
    try {
      setLoading(true);
      const data = await getPokemonList();
      setPokemons(data.results);
      setError(null);
    } catch (err) {
      setError("Error fetching Pokémon data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showPokemonDetails = (pokemonUrl) => {
    navigation.navigate("Detail", { pokemonUrl });
  };

  const showStoredToken = async () => {
    const token = await getToken();
    Alert.alert(
      "Token Guardado",
      token ? `Token: ${token}` : "No hay token guardado",
      [{ text: "OK" }]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar Sesión", onPress: logout, style: "destructive" },
      ]
    );
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  const renderPokemonCard = ({ item }) => {
    const pokemonId = item.url.split("/").filter(Boolean).pop();
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => showPokemonDetails(item.url)}
      >
        <Text style={styles.pokemonName}>{item.name}</Text>
        <Text style={styles.pokemonId}>#{pokemonId}</Text>
      </TouchableOpacity>
    );
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPokemons}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pokémon List</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.tokenButton} onPress={showStoredToken}>
            <Text style={styles.tokenButtonText}>Ver Token</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      {pokemons.length > 0 ? (
        <FlatList
          data={pokemons}
          renderItem={renderPokemonCard}
          keyExtractor={(item) => item.name}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          onEndReachedThreshold={0.5}
        />
      ) : loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#E63F34" />
        </View>
      ) : (
        <Text style={styles.noDataText}>No Pokémon found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },
  tokenButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  tokenButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: "#E63F34",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    margin: 8,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "capitalize",
    marginTop: 10,
    color: "#333",
  },
  pokemonId: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#E63F34",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: "#E63F34",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});

export default Home;
