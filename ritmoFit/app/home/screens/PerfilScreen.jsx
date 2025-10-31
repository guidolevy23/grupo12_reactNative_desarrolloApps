import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import userService from "../../../services/userService";

export default function PerfilScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Campos editables
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await userService.getProfile();
      setUser(profile);
      setName(profile.name || "");
      setEmail(profile.email || "");
      if (profile.photo || profile.photoUrl) {
        setPhoto({ uri: profile.photo || profile.photoUrl });
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
      Alert.alert("Error", "No se pudo cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setName(user.name || "");
    setEmail(user.email || "");
    setPhoto(user.photo || user.photoUrl ? { uri: user.photo || user.photoUrl } : null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updateData = {
        name,
        email,
      };

      if (photo && photo.uri && photo.uri !== user?.photo && photo.uri !== user?.photoUrl) {
        updateData.photo = {
          uri: photo.uri,
          type: "image/jpeg",
          fileName: "profile.jpg",
        };
      }

      const updated = await userService.updateProfile(updateData);
      setUser(updated);
      setEditing(false);
      Alert.alert("Perfil actualizado", "Tus datos han sido actualizados exitosamente");
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      const message =
        error.response?.data?.message || "No se pudo actualizar el perfil";
      Alert.alert("Error", message);
    } finally {
      setSaving(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permisos necesarios",
          "Se necesitan permisos para acceder a la galería"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0]);
      }
    } catch (error) {
      console.error("Error seleccionando imagen:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen");
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permisos necesarios",
          "Se necesitan permisos para acceder a la cámara"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0]);
      }
    } catch (error) {
      console.error("Error tomando foto:", error);
      Alert.alert("Error", "No se pudo tomar la foto");
    }
  };

  const handlePhotoOptions = () => {
    Alert.alert(
      "Seleccionar foto",
      "¿Cómo deseas seleccionar tu foto?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Galería", onPress: handlePickImage },
        { text: "Cámara", onPress: handleTakePhoto },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("token");
              Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente");
              router.replace("/login");
            } catch (error) {
              console.error("Error al cerrar sesión:", error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e67e22" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Foto de perfil */}
        <View style={styles.photoSection}>
          {photo ? (
            <Image source={photo} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>
                {name.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
          )}
          {editing && (
            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={handlePhotoOptions}
            >
              <Text style={styles.changePhotoButtonText}>Cambiar foto</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Información */}
        <View style={styles.infoSection}>
          <View style={styles.field}>
            <Text style={styles.label}>Nombre</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nombre completo"
              />
            ) : (
              <Text style={styles.value}>{name || "Sin nombre"}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="correo@ejemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.value}>{email || "Sin email"}</Text>
            )}
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.actions}>
          {editing ? (
            <>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Guardar cambios</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.editButtonText}>Editar perfil</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  content: {
    padding: 20,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e67e22",
    justifyContent: "center",
    alignItems: "center",
  },
  photoPlaceholderText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
  },
  changePhotoButton: {
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#3498db",
    borderRadius: 8,
  },
  changePhotoButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  infoSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    fontSize: 16,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
  },
  actions: {
    gap: 12,
  },
  editButton: {
    backgroundColor: "#e67e22",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#95a5a6",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
