import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

export default function RatingModal({ visible, onClose, onSubmit, classInfo }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      return; // No permitir enviar sin calificación
    }

    setLoading(true);
    try {
      await onSubmit(rating, comment);
      // Resetear estado después de enviar
      setRating(0);
      setComment('');
      onClose();
    } catch (error) {
      // El error se maneja en el componente padre
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment('');
    onClose();
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            disabled={loading}
            style={styles.starButton}
          >
            <Text style={styles.starIcon}>
              {star <= rating ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.overlay}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={styles.overlayBackground} />
          </TouchableWithoutFeedback>
          
          <View style={styles.modalContent}>
            <ScrollView 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Calificar Clase</Text>
                <TouchableOpacity onPress={handleClose} disabled={loading}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Información de la clase */}
              {classInfo && (
                <View style={styles.classInfo}>
                  <Text style={styles.className}>{classInfo.courseName}</Text>
                  <Text style={styles.classDetails}>📍 {classInfo.branch}</Text>
                  <Text style={styles.classDetails}>🕓 {classInfo.fecha}</Text>
                  {classInfo.professor && (
                    <Text style={styles.classDetails}>👤 {classInfo.professor}</Text>
                  )}
                </View>
              )}

              {/* Rating estrellas */}
              <View style={styles.section}>
                <Text style={styles.label}>
                  ¿Cómo fue la clase? <Text style={styles.required}>*</Text>
                </Text>
                {renderStars()}
                {rating > 0 && (
                  <Text style={styles.ratingText}>
                    {rating === 1 && '😞 Muy mala'}
                    {rating === 2 && '😕 Regular'}
                    {rating === 3 && '😐 Buena'}
                    {rating === 4 && '😊 Muy buena'}
                    {rating === 5 && '🤩 Excelente'}
                  </Text>
                )}
              </View>

              {/* Comentario */}
              <View style={styles.section}>
                <Text style={styles.label}>
                  Dejá un comentario (opcional)
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Contanos tu experiencia..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                  value={comment}
                  onChangeText={setComment}
                  editable={!loading}
                />
                <Text style={styles.charCount}>
                  {comment.length}/500 caracteres
                </Text>
              </View>

              {/* Botones */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleClose}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.submitButton,
                    (rating === 0 || loading) && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={rating === 0 || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.submitButtonText}>Enviar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 28,
    color: '#666',
    fontWeight: '300',
  },
  classInfo: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  classDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  required: {
    color: '#e74c3c',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  starButton: {
    padding: 5,
  },
  starIcon: {
    fontSize: 40,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
    marginTop: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fafafa',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#667eea',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
