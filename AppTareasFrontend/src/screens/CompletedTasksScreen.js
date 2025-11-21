// src/screens/CompletedTasksScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, FlatList } from 'react-native';
import api from '../api/axiosConfig';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import TaskCard from '../components/TaskCard'; 

const COLORS = { text: '#2E7D32', primary: '#1E4620' };

const CompletedTasksScreen = () => {
    const { t } = useTranslation();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCompletedTasks = async () => {
        setLoading(true);
        try {
            // Llama a GET /api/tasks (el backend debe enviar todas las tareas, y filtramos las completadas)
            const response = await api.get('/tasks'); 
            setTasks(response.data.filter(t => t.completed === true));
        } catch (error) {
            Alert.alert(t('error'), 'No se pudieron cargar las tareas completadas.');
        } finally {
            setLoading(false);
        }
    };
    
    // Función Dummy: la vista de completadas NO debe permitir togglear.
    const handleToggle = () => { /* No-op */ };

    useFocusEffect(
        useCallback(() => {
            fetchCompletedTasks();
        }, [])
    );

    if (loading) {
        return <View style={styles.centerContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
    }

    const renderTask = ({ item }) => (
        <TaskCard 
            task={item} 
            onToggleCompleted={handleToggle} 
            onEdit={() => Alert.alert('Información', 'Las tareas completadas no se editan.')}
            isCompletedView={true} // Marca como vista completada
        />
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tareas Completadas</Text>
            {tasks.length > 0 ? (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderTask}
                />
            ) : (
                <Text style={styles.emptyText}>Aún no has completado ninguna tarea. ¡Empieza ya!</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white', padding: 20 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 32, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
    emptyText: { textAlign: 'center', marginTop: 50, color: COLORS.text }
});

export default CompletedTasksScreen;