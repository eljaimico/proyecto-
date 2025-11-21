// src/screens/EditTaskScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, Alert,
  TouchableOpacity, ScrollView, Platform, ActivityIndicator
} from 'react-native';
import api from '../api/axiosConfig';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = { text: '#2E7D32', primary: '#1E4620', secondary: '#F1F8E9', danger: '#E53935' };

const EditTaskScreen = ({ route, navigation }) => {
  const taskId = route.params?.taskId;
  const isEditing = !!taskId;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);

  useEffect(() => {
    if (isEditing) fetchTask(taskId);
  }, [taskId]);

  // Fetch tarea
  const fetchTask = async (id) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await api.get(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const task = res.data;

      setTitle(task.title || '');
      setDescription(task.description || '');
      setCompleted(task.completed || false);

    } catch (err) {
      console.error('fetchTask error', err?.response || err);
      Alert.alert('Error', 'No se pudo cargar la tarea.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // Guardar tarea
  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'El título es obligatorio.');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const payload = {
        title,
        description: description || null,
        completed
      };

      if (isEditing) {
        await api.put(`/tasks/${taskId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        Alert.alert('Éxito', 'Tarea actualizada.');
      } else {
        await api.post('/tasks', payload, { headers: { Authorization: `Bearer ${token}` } });
        Alert.alert('Éxito', 'Tarea creada.');
      }

      navigation.goBack();
    } catch (err) {
      console.error('handleSave error', err?.response || err);
      Alert.alert('Error', 'No se pudo guardar la tarea.');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar tarea → confirmación correcta en web y móvil
  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('¿Eliminar esta tarea?')) {
        confirmDelete();
      }
      return;
    }

    Alert.alert(
      'Confirmar',
      '¿Eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: confirmDelete }
      ]
    );
  };

  const confirmDelete = async () => {
    if (processingDelete) return;
    setProcessingDelete(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      await api.delete(`/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });

      Alert.alert('Éxito', 'Tarea eliminada.');
      navigation.goBack();
    } catch (err) {
      console.error('confirmDelete error', err?.response || err);
      Alert.alert('Error', 'No se pudo eliminar la tarea.');
    } finally {
      setProcessingDelete(false);
    }
  };

  if (loading && isEditing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
        <Text style={styles.title}>{isEditing ? 'Editar Tarea' : 'Crear Tarea'}</Text>

        {/* Título */}
        <Text style={styles.label}>Título (*)</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Ej: Comprar comida"
          placeholderTextColor="#999"
        />

        {/* Descripción */}
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={description}
          onChangeText={setDescription}
          placeholder="Detalles..."
          placeholderTextColor="#999"
          multiline
        />

        {/* Checkbox Completada */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setCompleted(!completed)}
        >
          <Ionicons
            name={completed ? 'checkbox' : 'square-outline'}
            size={28}
            color={COLORS.primary}
          />
          <Text style={styles.checkboxLabel}>Completada</Text>
        </TouchableOpacity>

        {/* Botón Guardar */}
        <TouchableOpacity
          style={[styles.saveButton, loading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Guardar Cambios' : 'Crear Tarea'}
          </Text>
        </TouchableOpacity>

        {/* Botón Eliminar */}
        {isEditing && (
          <TouchableOpacity
            style={[styles.deleteButton, processingDelete && { opacity: 0.5 }]}
            onPress={handleDelete}
            disabled={processingDelete}
          >
            <Text style={styles.deleteButtonText}>Eliminar Tarea</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.text, marginBottom: 30 },
  label: { fontSize: 16, color: COLORS.text, marginBottom: 5, marginTop: 15, fontWeight: 'bold' },
  input: { height: 50, backgroundColor: COLORS.secondary, borderRadius: 10, paddingHorizontal: 15, color: COLORS.text, fontSize: 16 },
  multilineInput: { height: 100, paddingTop: 15, textAlignVertical: 'top' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  checkboxLabel: { marginLeft: 10, fontSize: 18, color: COLORS.text },
  saveButton: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  deleteButton: { backgroundColor: COLORS.danger, padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 15 },
  deleteButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default EditTaskScreen;
