import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView
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
  const AVATARS = [
    'https://i.pravatar.cc/300?img=1',
    'https://i.pravatar.cc/300?img=2',
    'https://i.pravatar.cc/300?img=3',
    'https://i.pravatar.cc/300?img=4',
    'https://i.pravatar.cc/300?img=5',
    'https://i.pravatar.cc/300?img=6',
    'https://i.pravatar.cc/300?img=7',
    'https://i.pravatar.cc/300?img=8',
  ];


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
      {/* Avatar + datos */}
      <View style={styles.header}>
        <Image
          source={{ uri: (editing ? draft : user)?.photoUrl ?  (editing ? draft : user).photoUrl : "-"}}
          style={styles.avatar}
        />
        {editing ? (
          <>
          {/* Picker de Avatares */}
            <View style={{ width: '100%' }}>
              <Text style={styles.pickLabel}>Elegí tu avatar</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.avatarsRow}>
                {AVATARS.map((url) => {
                  const selected = draft.avatar === url;
                  return (
                    <TouchableOpacity
                      key={url}
                      onPress={() => setDraft({ ...draft, photoUrl: url })}
                      style={[styles.avatarOption, selected && styles.avatarSelected]}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: url }} style={styles.avatarThumb} />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={draft.name}
              onChangeText={(n) => setDraft({ ...draft, name: n })}
            />
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
              onChangeText={(d) => setDraft({ ...draft, direccion: d })}
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },

  header: {
    marginTop: 12,
    marginBottom: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
    gap: 8,
    // sombra estilo card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },

  name: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },

  email: {
    color: "#666",
    fontSize: 14,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "white",
    marginTop: 8,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    marginTop: 16,
  },

  statCard: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    alignItems: "center",
    // sombra tipo card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  statLabel: {
    color: "#777",
    marginTop: 4,
    fontSize: 13,
  },

  actions: {
    marginTop: "auto",
    gap: 10,
    paddingTop: 20,
  },

  btn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "white",
  },

  primary: {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
  },

  outline: {
    backgroundColor: "#ffffff",
    borderColor: "#d4d4d4",
  },

  danger: {
    backgroundColor: "#fff5f5",
    borderColor: "#f56565",
  },

  btnTextPrimary: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },

  btnTextOutline: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
  },

  btnTextDanger: {
    color: "#e53e3e",
    fontWeight: "700",
    fontSize: 16,
  },

  pickLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    marginTop: 10,
  },

  avatarsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingVertical: 6,
  },

  avatarOption: {
    padding: 2,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "transparent",
  },

  avatarSelected: {
    borderColor: "#667eea", // resalta seleccionado
  },

  avatarThumb: {
    width: 64,
    height: 64,
    borderRadius: 999,
  },
});