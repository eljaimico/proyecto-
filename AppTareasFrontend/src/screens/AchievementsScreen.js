// src/screens/AchievementsScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/axiosConfig';

const COLORS = { text: '#2E7D32', primary: '#1E4620', secondary: '#F1F8E9' };

const AchievementsScreen = () => {
    const { t } = useTranslation();
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAchievements = async () => {
        setLoading(true);
        try {
            // Llama a GET /api/achievements (endpoint asumido)
            const response = await api.get('/achievements');
            setAchievements(response.data);
        } catch (error) {
            console.error('Achievements Load Error:', error.response ? error.response.data : error.message);
            Alert.alert(t('error'), 'No se pudieron cargar los logros.');
            
            // Datos de prueba (Fallback) si falla la conexión
            setAchievements(getMockAchievements()); 
        } finally {
            setLoading(false);
        }
    };

    // Usar useFocusEffect para recargar cada vez que se visita la pestaña
    useFocusEffect(
        useCallback(() => {
            fetchAchievements();
        }, [])
    );

    const getMockAchievements = () => [
        { id: 1, name: 'Primer Paso', description: 'Completa tu primera tarea.', unlocked: true },
        { id: 2, name: 'Racha de 3 Días', description: 'Mantén una racha de productividad por 3 días.', unlocked: true },
        { id: 3, name: 'Maestro de la Rutina', description: 'Completa 20 tareas en un mes.', unlocked: false },
        { id: 4, name: 'Concentración Total', description: 'Completa una tarea etiquetada como Difícil.', unlocked: false },
    ];

    if (loading) {
        return <View style={styles.centerContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
    }

    const renderAchievement = ({ item }) => {
        const iconName = item.unlocked ? 'ribbon' : 'lock-closed-outline';
        const color = item.unlocked ? '#FFD700' : COLORS.text;
        
        return (
            <View style={styles.achievementCard}>
                <Ionicons name={iconName} size={35} color={color} style={styles.icon} />
                <View style={styles.textContainer}>
                    <Text style={styles.titleText}>{item.name}</Text>
                    <Text style={styles.descriptionText}>{item.description}</Text>
                </View>
                <Text style={[styles.statusText, { color: item.unlocked ? COLORS.primary : '#A9A9A9' }]}>
                    {item.unlocked ? t('achievements_unlocked') : 'Bloqueado'}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>{t('achievements_title')}</Text>
            <FlatList
                data={achievements}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderAchievement}
                ListEmptyComponent={<Text style={styles.emptyText}>{t('achievements_empty')}</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white', padding: 20 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 40, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
    achievementCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.secondary,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    icon: {
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    descriptionText: {
        fontSize: 14,
        color: COLORS.text,
        opacity: 0.7,
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyText: { textAlign: 'center', marginTop: 50, color: COLORS.text }
});

export default AchievementsScreen;