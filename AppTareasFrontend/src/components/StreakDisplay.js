// src/components/StreakDisplay.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/axiosConfig';

const COLORS = { primary: '#1E4620', text: '#2E7D32', secondary: '#F1F8E9' };

const StreakDisplay = () => {
    const [streakData, setStreakData] = useState({ currentStreak: 0, maxStreak: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStreak();
    }, []);

    const fetchStreak = async () => {
        try {
            // Llama a GET /api/tasks/streak
            const response = await api.get('/tasks/streak');
            setStreakData(response.data);
        } catch (error) {
            console.error('Streak Load Error:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="small" color={COLORS.primary} style={styles.loader} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Racha de Productividad</Text>
            <View style={styles.dataRow}>
                <Ionicons name="flame" size={30} color="#FF9800" />
                <View style={styles.dataColumn}>
                    <Text style={styles.streakCount}>{streakData.currentStreak}</Text>
                    <Text style={styles.streakLabel}>Días Consecutivos</Text>
                </View>
            </View>
            <View style={styles.dataRow}>
                <Ionicons name="star-outline" size={30} color={COLORS.text} />
                <View style={styles.dataColumn}>
                    <Text style={styles.streakCount}>{streakData.maxStreak}</Text>
                    <Text style={styles.streakLabel}>Racha Máxima</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.secondary,
        borderRadius: 15,
        padding: 20,
        marginVertical: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.text,
        paddingBottom: 5,
    },
    dataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    dataColumn: {
        marginLeft: 15,
    },
    streakCount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    streakLabel: {
        fontSize: 14,
        color: COLORS.text,
    },
    loader: {
        marginVertical: 20,
    }
});

export default StreakDisplay;