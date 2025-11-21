// src/screens/ProfileScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import api from '../api/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import StreakDisplay from '../components/StreakDisplay'; // <-- Componente de Racha

const COLORS = { text: '#2E7D32', primary: '#1E4620', secondary: '#F1F8E9' };

const ProfileScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users/profile');
            setUserData(response.data);
        } catch (error) {
            Alert.alert(t('error'), t('profile_load_error'));
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('userToken');
        navigation.getParent().getParent().replace('Login');
    };

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
                <Ionicons name="person-circle-outline" size={80} color={COLORS.text} style={styles.avatar} />
                <Text style={styles.username}>{userData?.name || 'Usuario'}</Text>
                <Text style={styles.email}>{userData?.email || 'email@dominio.com'}</Text>
            </View>

            {/* Racha */}
            <StreakDisplay />

            {/* ÚNICA OPCIÓN QUE QUEDA: AJUSTES */}
            <ProfileOption
                title={t('settings_title')}
                icon="settings-outline"
                action={() => navigation.navigate('Settings')}
            />

            {/* BOTÓN DE CERRAR SESIÓN */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const ProfileOption = ({ title, icon, action }) => (
    <TouchableOpacity style={styles.option} onPress={action}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name={icon} size={24} color={COLORS.text} />
            <Text style={styles.optionText}>{title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={COLORS.text} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white', padding: 20 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.secondary
    },
    avatar: { marginBottom: 10 },
    username: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
    email: { fontSize: 16, color: COLORS.text, opacity: 0.7 },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.secondary,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10
    },
    optionText: { fontSize: 18, color: COLORS.text, marginLeft: 10 },
    logoutButton: {
        marginTop: 40,
        padding: 15,
        backgroundColor: '#E53935',
        borderRadius: 10,
        alignItems: 'center'
    },
    logoutText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default ProfileScreen;
