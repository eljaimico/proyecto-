// src/screens/CalendarScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'react-native-calendars';
import axios from '../api/axiosConfig';
import { Ionicons } from '@expo/vector-icons';

const COLORS = { text: '#2E7D32', primary: '#1E4620' };

const CalendarScreen = () => {
    const { t } = useTranslation();

    const [tasks, setTasks] = useState([]);
    const [markedDates, setMarkedDates] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // NORMALIZAR FECHAS A YYYY-MM-DD
    const normalizeDate = (date) => {
        if (!date) return null;
        try {
            return new Date(date).toISOString().split("T")[0];
        } catch {
            return null;
        }
    };

    // =============================
    // 1. Cargar tareas desde backend
    // =============================
    const fetchTasks = async () => {
        try {
            const response = await axios.get('/tasks');
            const data = response.data || [];

            // Normalizar fechas
            const normalized = data.map(t => ({
                ...t,
                date: normalizeDate(t.date)
            }));

            setTasks(normalized);
        } catch (error) {
            console.error("Error cargando tareas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // =============================
    // 2. Marcar fechas en calendario
    // =============================
    useEffect(() => {
        const marks = {};

        tasks.forEach(task => {
            if (!task.date) return;

            marks[task.date] = {
                marked: true,
                dotColor: task.completed ? '#4CAF50' : '#D32F2F'
            };
        });

        setMarkedDates(marks);
    }, [tasks]);

    // =============================
    // 3. Filtrar tareas por día
    // =============================
    const handleDayPress = (day) => {
        const selected = day.dateString;
        setSelectedDate(selected);

        const filtered = tasks.filter(task => task.date === selected);
        setFilteredTasks(filtered);
    };

    // =============================
    // LOADING
    // =============================
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>{t('loading')}...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('tab_calendar')}</Text>

            {/* CALENDARIO */}
            <Calendar
                markedDates={{
                    ...markedDates,
                    ...(selectedDate ? { 
                        [selectedDate]: { 
                            selected: true, 
                            selectedColor: COLORS.primary,
                            marked: markedDates[selectedDate]?.marked,
                            dotColor: markedDates[selectedDate]?.dotColor
                        } 
                    } : {})
                }}
                onDayPress={handleDayPress}
                theme={{
                    selectedDayBackgroundColor: COLORS.primary,
                    todayTextColor: COLORS.primary,
                    arrowColor: COLORS.primary,
                    monthTextColor: COLORS.text,
                }}
            />

            {/* LISTA DE TAREAS */}
            <View style={styles.tasksContainer}>
                <Text style={styles.sectionTitle}>
                    {selectedDate ? `Tareas para el ${selectedDate}` : "Selecciona un día"}
                </Text>

                {filteredTasks.length === 0 ? (
                    <Text style={styles.noTasksText}>No hay tareas en esta fecha.</Text>
                ) : (
                    <FlatList
                        data={filteredTasks}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.taskCard}>
                                <Ionicons
                                    name={item.completed ? "checkmark-circle" : "ellipse-outline"}
                                    size={22}
                                    color={item.completed ? COLORS.primary : "#616161"}
                                />
                                <Text style={styles.taskText}>{item.title}</Text>
                            </View>
                        )}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white', padding: 20 },
    title: { fontSize: 40, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
    
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
    loadingText: { marginTop: 10, color: COLORS.text, fontSize: 16 },

    tasksContainer: { marginTop: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 },
    noTasksText: { color: '#777', fontSize: 14 },

    taskCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F8E9',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10
    },
    taskText: { marginLeft: 10, fontSize: 16, color: COLORS.text }
});

export default CalendarScreen;
