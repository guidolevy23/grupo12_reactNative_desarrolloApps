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
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* Header con icono */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>⭐</Text>
            </View>
            <Text style={styles.title}>Calificar clase</Text>
            <Text style={styles.subtitle}>Tu opinión nos ayuda a mejorar</Text>
          </View>

          {/* Stars Section */}
          <View style={styles.starsSection}>
            {renderStars()}
            <Text style={styles.starsLabel}>
              {stars === 5 ? '¡Excelente!' : stars === 4 ? 'Muy bueno' : stars === 3 ? 'Bueno' : stars === 2 ? 'Regular' : 'Mejorable'}
            </Text>
          </View>

          {/* Comment Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Comentario (opcional)</Text>
            <TextInput
              placeholder="Comparte tu experiencia..."
              placeholderTextColor="#999"
              value={comment}
              onChangeText={setComment}
              style={styles.input}
              multiline
              numberOfLines={4}
              maxLength={300}
            />
            <Text style={styles.charCount}>{comment.length}/300</Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.cancelBtn} 
              onPress={onClose} 
              disabled={saving}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]} 
              onPress={submit} 
              disabled={saving}
              activeOpacity={0.8}
            >
              <Text style={styles.saveText}>
                {saving ? '⏳ Guardando...' : '✓ Guardar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff3e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  starsSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  star: {
    fontSize: 36,
    marginHorizontal: 4,
  },
  starActive: {
    color: '#f5a623',
  },
  starInactive: {
    color: '#e0e0e0',
  },
  starsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 15,
    color: '#333',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#667eea',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnDisabled: {
    backgroundColor: '#b0b8e8',
    opacity: 0.7,
  },
  saveText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
