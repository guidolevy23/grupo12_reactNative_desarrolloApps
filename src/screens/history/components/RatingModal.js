import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import CalificacionService from '../../../services/calificacionService';

export default function RatingModal({ visible, onClose, asistenciaId, onSaved }) {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!asistenciaId) return;
    setSaving(true);
    try {
      // Prevent duplicate submissions by checking existing calificaciones for this user
      try {
        const existing = await CalificacionService.getMyRatings();
        const found = existing.find((c) => {
          // match by asistenciaId, or by turnoId equal to asistenciaId (some backends map turno==asistencia)
          if (c.asistenciaId && Number(c.asistenciaId) === Number(asistenciaId)) return true;
          if (c.turnoId && Number(c.turnoId) === Number(asistenciaId)) return true;
          return false;
        });
        if (found) {
          Alert.alert('No permitido', 'Ya existe una calificación para esta asistencia (verificada localmente).');
          setSaving(false);
          return;
        }
      } catch (pollErr) {
        // proceed to try submit — backend will still validate
      }

      const resp = await CalificacionService.submitRating(asistenciaId, stars, comment);
      // Expecting resp: { id, turnoId, estrellas, comentario }
      onSaved && onSaved(resp);
      setComment('');
      setStars(5);
      onClose();
    } catch (err) {
      // If backend returns 400/409 for duplicate rating, show friendly message including server message when available
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message;
      if (status === 400 || status === 409) {
        Alert.alert('No permitido', serverMsg ? `Ya existe una calificación: ${serverMsg}` : 'Ya existe una calificación para esta asistencia.');
      } else {
        const msg = serverMsg || err.message || 'Error al enviar la calificación';
        Alert.alert('Error', msg);
      }
    } finally {
      setSaving(false);
    }
  };

  const renderStars = () => {
    const arr = [1, 2, 3, 4, 5];
    return (
      <View style={styles.starsRow}>
        {arr.map((n) => (
          <TouchableOpacity key={n} onPress={() => setStars(n)}>
            <Text style={[styles.star, n <= stars ? styles.starActive : styles.starInactive]}>{'★'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>Calificar clase</Text>
          {renderStars()}
          <TextInput
            placeholder="Comentario (opcional)"
            value={comment}
            onChangeText={setComment}
            style={styles.input}
            multiline
            numberOfLines={3}
            maxLength={300}
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={saving}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={submit} disabled={saving}>
              <Text style={styles.saveText}>{saving ? 'Guardando...' : 'Guardar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  container: { width: '90%', backgroundColor: 'white', borderRadius: 12, padding: 18 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
  star: { fontSize: 28, marginHorizontal: 6 },
  starActive: { color: '#f5a623' },
  starInactive: { color: '#ddd' },
  input: { borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 8, minHeight: 60, textAlignVertical: 'top' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 14, marginRight: 8 },
  cancelText: { color: '#666' },
  saveBtn: { backgroundColor: '#667eea', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  saveText: { color: 'white', fontWeight: '700' },
});
