// src/screens/SuggestedTasksScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/axiosConfig';

const COLORS = { text: '#2E7D32', primary: '#1E4620', secondary: '#F1F8E9' };

const SuggestedTasksScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            // Llama a GET /api/tasks/suggested (ASUMIDO)
            const response = await api.get('/tasks/suggested');
            setSuggestions(response.data);
        } catch (error) {
            // Fallback: Si el endpoint no existe, usamos datos de prueba
            setSuggestions([
                { id: 1, title: 'Revisar la bandeja de entrada', description: 'Limpiar correos antiguos y responder los pendientes.', difficulty: 'Fácil' },
                { id: 2, title: 'Ejercicio de 30 minutos', description: 'Caminata, yoga o gimnasio.', difficulty: 'Medio' },
                { id: 3, title: 'Planificar la semana', description: 'Crear un horario detallado para los próximos 7 días.', difficulty: 'Difícil' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSuggestion = async (suggestion) => {
        try {
            // Llama a POST /api/tasks con los datos de la sugerencia
            await api.post('/tasks', {
                title: suggestion.title,
                description: suggestion.description,
                // dueDate se puede dejar nulo o establecer para hoy/mañana
            });
            Alert.alert('Éxito', `${suggestion.title} ha sido añadida a tus pendientes.`);
            navigation.goBack(); // Vuelve a TodoScreen para ver la tarea añadida
        } catch (error) {
            Alert.alert(t('error'), 'No se pudo añadir la tarea sugerida.');
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchSuggestions();
        }, [])
    );

    if (loading) {
        return <View style={styles.centerContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
    }

    const renderItem = ({ item }) => (
        <View style={styles.suggestionCard}>
            <View style={styles.textContainer}>
                <Text style={styles.suggestionTitle}>{item.title}</Text>
                <Text style={styles.suggestionDescription}>{item.description}</Text>
                <Text style={styles.suggestionDifficulty}>Dificultad: {item.difficulty}</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => handleAddSuggestion(item)}>
                <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tareas Sugeridas</Text>
            <FlatList
                data={suggestions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white', padding: 20 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 32, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
    suggestionCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.secondary,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    textContainer: { flex: 1, marginRight: 10 },
    suggestionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
    suggestionDescription: { fontSize: 14, color: COLORS.text, opacity: 0.7 },
    suggestionDifficulty: { fontSize: 12, color: COLORS.primary, marginTop: 5 },
    addButton: {
        backgroundColor: COLORS.primary,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SuggestedTasksScreen;