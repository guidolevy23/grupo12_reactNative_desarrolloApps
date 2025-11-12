import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import  { useProfile } from "../../services/profileService";
// Si querés persistir, descomentá y corré: npx expo install @react-native-async-storage/async-storage
// import AsyncStorage from "@react-native-async-storage/async-storage";


export default function ProfileScreen() {
  const [user, setUser] = useState();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState();
  const [clases, setClases] = useState();
  const { getUserDetail } = useProfile();
  const {postChangesUser} = useProfile();

useEffect(() => {
  let alive = true;
  (async () => {
    try {
      const usuario = await getUserDetail(); // ✅ ya viene autenticada
      if (alive && usuario){
        setUser(usuario);
      }
    } catch (e) {
      console.log('Error getUserDetail:', e);
    }
  })();
  return () => { alive = false };
}, [getUserDetail]);

// useEffect(() => {
//   setClases((user.reservas ?? []).join(', '));
// }, [user.reservas]);

  const { logout } = useContext(AuthContext); 

  const toggleEdit = () => {
    setDraft(user);
    setEditing((e) => !e);
    getUserDetail()
  };

  const save = async () => {
    try {
      setUser(draft);
      // Persistencia opcional:
      // await AsyncStorage.setItem("@user_profile", JSON.stringify(draft));
      postChangesUser(draft)
      setEditing(false);
      Alert.alert("Perfil", "Cambios guardados");
    } catch (e) {
      Alert.alert("Error", "No se pudo guardar");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil de usuario</Text>

      {/* Avatar + datos */}
      <View style={styles.header}>
        {/* <Image source={{ uri: (editing ? draft : user).avatar }} style={styles.avatar} /> */}

        {editing ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={draft.name}
              onChangeText={(t) => setDraft({ ...draft, name: t })}
            />
            {/* <TextInput
              style={styles.input}
              placeholder="URL de avatar (opcional)"
              value={draft.avatar}
              onChangeText={(t) => setDraft({ ...draft, avatar: t })}
            /> */}
            <TextInput
              style={styles.input}
              placeholder="Telefono"
              value={draft.telefono}
              onChangeText={(t) => setDraft({ ...draft, telefono: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Direccion"
              value={draft.direccion}
              onChangeText={(t) => setDraft({ ...draft, direccion: t })}
            />
          </>
        ) : (
          <>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{user?.telefono ? user.telefono : "-"}</Text>
              <Text style={styles.statLabel}>Telefono</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{user?.direccion ? user.direccion : "-"}</Text>
              <Text style={styles.statLabel}>Direccion</Text>
            </View>
      </View>
          </>
        )}
      </View>

      {/* Stats */}
      
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{clases ? clases : "-"}</Text>
          <Text style={styles.statLabel}>Reservas</Text>
        </View>

      </View>

      {/* Acciones */}
      <View style={styles.actions}>
        {editing ? (
          <>
            <TouchableOpacity style={[styles.btn, styles.primary]} onPress={save}>
              <Text style={styles.btnTextPrimary}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.outline]} onPress={toggleEdit}>
              <Text style={styles.btnTextOutline}>Cancelar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={[styles.btn, styles.primary]} onPress={toggleEdit}>
              <Text style={styles.btnTextPrimary}>Editar perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.danger]} onPress={logout}>
              <Text style={styles.btnTextDanger}>Cerrar sesión</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 16 },
  title: { fontSize: 18, fontWeight: "600" },
  header: { alignItems: "center", gap: 8, marginTop: 12 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  name: { fontSize: 22, fontWeight: "600" },
  email: { color: "#666" },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    alignItems: "center",
  },
  statNumber: { fontSize: 18, fontWeight: "700" },
  statLabel: { color: "#777", marginTop: 4 },

  actions: { marginTop: "auto", gap: 10 },
  btn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  primary: { backgroundColor: "#111", borderColor: "#111" },
  outline: { backgroundColor: "#fff", borderColor: "#ccc" },
  danger: { backgroundColor: "#fff", borderColor: "#f33" },

  btnTextPrimary: { color: "#fff", fontWeight: "600" },
  btnTextOutline: { color: "#111", fontWeight: "600" },
  btnTextDanger: { color: "#f33", fontWeight: "700" },
});
