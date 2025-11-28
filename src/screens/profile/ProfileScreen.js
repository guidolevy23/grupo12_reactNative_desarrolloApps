import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { useProfile } from "../../services/profileService";
import { getReservasUsuario } from "../../services/reservaService";
import { useFocusEffect } from "@react-navigation/native";
import { processNotifications } from "../../services/notificationBackgroudTask";
import { openMapsByCoords } from "../../utils/mapsLinking";

const validarDireccionBasica = (direccion) => {
  if (!direccion) return false;

  // Ejemplos válidos:
  // "Juncal 1919"
  // "Av. Santa Fe 3450"
  // "Carlos Pellegrini 1023 1°B"
  const regex = /^([A-Za-zÁÉÍÓÚÜÑáéíóúüñ.'º°\- ]+)\s+(\d+.*)$/;

  return regex.test(direccion.trim());
};

const validarDireccionBuenosAires = (direccion) => {
  if (!direccion) return false;

  // 1) Primero: validar calle + altura
  if (!validarDireccionBasica(direccion)) {
    return false;
  }

  // 2) Después: chequear que el texto incluya algo que indique Buenos Aires
  const normalizada = direccion
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // saca tildes

  const esBuenosAires =
    normalizada.includes("buenos aires") ||
    normalizada.includes("caba") ||
    normalizada.includes("capital federal") ||
    normalizada.includes("bs as") ||
    normalizada.includes("bs. as.");

  return esBuenosAires;
};

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [clases, setClases] = useState([]);
  const [proximaClase, setProximaClase] = useState(null);

  const { getUserDetail, postChangesUser } = useProfile();
  const { logout } = useContext(AuthContext);

  const AVATARS = [
  "https://robohash.org/user1.png",
  "https://robohash.org/user2.png",
  "https://robohash.org/user3.png",
  "https://robohash.org/user4.png",
  "https://robohash.org/user5.png",
  "https://robohash.org/user6.png",
  "https://robohash.org/user7.png",
  "https://robohash.org/user8.png",
  "https://robohash.org/user9.png",
  "https://robohash.org/user10.png",
];
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const calcularProximaClase = (reservas) => {
    const ahora = new Date();
    let mejor = null;
    let mejorDiff = Infinity;

    reservas?.forEach((clase) => {
      const fechaClase = new Date(clase.course.startsAt);
      const diff = fechaClase.getTime() - ahora.getTime();
      if (diff >= 0 && diff < mejorDiff && clase.estado === "CONFIRMADA") {
        mejorDiff = diff;
        mejor = clase;
      }
    });

    if (!mejor) return null; // 👈 importantísimo

    const fechaCompleta = mejor.course.startsAt.split("T");
    const horario = fechaCompleta[1].slice(0, 5); // HH:MM
    const fechaSola = fechaCompleta[0].split("-");
    const fechaOrdenada = [
      horario,
      fechaSola[2],
      meses[Number(fechaSola[1]) - 1],
      fechaSola[0],
    ];
    mejor.horario = fechaOrdenada.join(" ");
    return mejor;
  };

  const cargarDatos = useCallback(async () => {
    try {
      const usuario = await getUserDetail();
      if (!usuario) return;
      setUser(usuario);

      const reservas = await getReservasUsuario(usuario.id);
      setClases(reservas || []);

      const proxima = calcularProximaClase(reservas || []);
      setProximaClase(proxima);
    } catch (e) {
      console.log("Error cargando datos de perfil:", e);
    }
  }, [getUserDetail]);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        if (!alive) return;
        await cargarDatos();
      })();
      return () => {
        alive = false;
      };
    }, [cargarDatos])
  );

  const toggleEdit = () => {
    setDraft(user);
    setEditing((e) => !e);
  };

  const save = async () => {
  try {
    // ✅ Validación básica de dirección: calle + altura
    if (draft?.direccion && !validarDireccionBuenosAires(draft.direccion)) {
  Alert.alert(
    "Dirección inválida",
    "Ingresá una dirección con calle, altura y la ciudad en Buenos Aires. Ej: 'Juncal 1919, CABA'"
  );
  return;
}

    setUser(draft);
    await postChangesUser(draft);
    setEditing(false);
    Alert.alert("Perfil", "Cambios guardados");
  } catch (e) {
    Alert.alert("Error", "No se pudo guardar");
  }
};

  const currentUser = editing ? draft : user;
  const avatarUri = currentUser?.photoUrl || AVATARS[0];

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />

          {editing ? (
            <>
              {/* Picker de Avatares */}
              <View style={{ width: "100%" }}>
                <Text style={styles.pickLabel}>Elegí tu avatar</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.avatarsRow}
                >
                  {AVATARS.map((url) => {
                    const selected = draft?.photoUrl === url;
                    return (
                      <TouchableOpacity
                        key={url}
                        onPress={() => setDraft({ ...draft, photoUrl: url })}
                        style={[
                          styles.avatarOption,
                          selected && styles.avatarSelected,
                        ]}
                        activeOpacity={0.8}
                      >
                        <Image
                          source={{ uri: url }}
                          style={styles.avatarThumb}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={draft?.name || ""}
                onChangeText={(n) => setDraft({ ...draft, name: n })}
              />
              <TextInput
                style={styles.input}
                placeholder="Telefono"
                value={draft?.telefono || ""}
                onChangeText={(t) => setDraft({ ...draft, telefono: t })}
              />
              <TextInput
  style={styles.input}
  placeholder='Dirección (Ej: Juncal 1919, CABA)'
  value={draft?.direccion || ""}
  onChangeText={(d) => setDraft({ ...draft, direccion: d })}
/>
<Text style={styles.helperText}>
  Incluí la ciudad. Ej: "Juncal 1919, CABA".
</Text>
            </>
          ) : (
            <>
              <Text style={styles.name}>{user?.name}</Text>
              <Text style={styles.email}>{user?.email}</Text>
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {user?.telefono ? user.telefono : "-"}
                  </Text>
                  <Text style={styles.statLabel}>Telefono</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {user?.direccion ? user.direccion : "-"}
                  </Text>
                  <Text style={styles.statLabel}>Direccion</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Próxima reserva */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            {proximaClase ? (
              <>
                <Text style={styles.statNumber}>
                  {proximaClase.course.name}
                </Text>
                {/* ACA ME QUEDE, deberia ver como viene la sede en el proximaClase para mostrarlo */}
                <TouchableOpacity onPress={() => openMapsByCoords(proximaClase.course.branch?.lat, proximaClase.course.branch?.lng,user?.direccion)}>
                  <Text style={[styles.statNumber, { textDecorationLine: "underline", color: "#3366ff" }]}>{proximaClase.course.branch.nombre}</Text>
                </TouchableOpacity>
                <Text style={styles.statNumber}>
                  {proximaClase.horario}
                </Text>
              </>
            ) : (
              <Text style={styles.statNumber}>
                No tienes reservas proximas.
              </Text>
            )}
            <Text style={styles.statLabel}>Reserva más proxima</Text>
          </View>
        </View>

        {/* Acciones */}
        <View style={styles.actions}>
          {editing ? (
            <>
              <TouchableOpacity
                style={[styles.btn, styles.primary]}
                onPress={save}
              >
                <Text style={styles.btnTextPrimary}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.outline]}
                onPress={toggleEdit}
              >
                <Text style={styles.btnTextOutline}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.btn, styles.primary]}
                onPress={toggleEdit}
              >
                <Text style={styles.btnTextPrimary}>Editar perfil</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.danger]}
                onPress={logout}
              >
                <Text style={styles.btnTextDanger}>Cerrar sesión</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  container: {
    // ya no la uso como root, pero la dejo por si la querés en otro lado
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    marginTop: 12,
    marginBottom: 15,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
    gap: 8,
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
  name: { fontSize: 22, fontWeight: "600", color: "#333" },
  email: { color: "#666", fontSize: 14 },
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
    width:"100%",
    gap: 12,
    justifyContent: "space-between",
    // marginTop: 16,
  },
  statCard: {
    // flex: 1,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    alignItems: "center",
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
    marginTop: 15, // antes "auto", ahora deja que el ScrollView maneje el espacio
    gap: 10,
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
    borderColor: "#667eea",
  },
  avatarThumb: {
    width: 64,
    height: 64,
    borderRadius: 999,
  },
  helperText: {
  width: "100%",
  fontSize: 12,
  color: "#777",
  marginTop: 4,
},
});
