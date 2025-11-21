// src/screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

const COLORS = { text: '#2E7D32', primary: '#1E4620', secondary: '#F1F8E9' };

const SettingsScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

    // Cargar configuración del switch desde AsyncStorage
    useEffect(() => {
        const loadSettings = async () => {
            const savedValue = await AsyncStorage.getItem("notificationsEnabled");
            if (savedValue !== null) {
                setIsNotificationsEnabled(savedValue === "true");
            }
        };
        loadSettings();
    }, []);

    // Guardar configuración del switch
    const toggleNotifications = async () => {
        const newValue = !isNotificationsEnabled;
        setIsNotificationsEnabled(newValue);
        await AsyncStorage.setItem("notificationsEnabled", newValue.toString());
    };

    const SettingItem = ({ title, icon, action, isSwitch, switchValue }) => (
        <TouchableOpacity style={styles.item} onPress={action} disabled={isSwitch}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={icon} size={24} color={COLORS.primary} style={{ marginRight: 15 }} />
                <Text style={styles.itemText}>{title}</Text>
            </View>

            {isSwitch ? (
                <Switch
                    trackColor={{ false: COLORS.secondary, true: COLORS.primary }}
                    thumbColor={'#f4f3f4'}
                    onValueChange={toggleNotifications}
                    value={switchValue}
                />
            ) : (
                <Ionicons name="chevron-forward" size={24} color={COLORS.text} />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('settings_title')}</Text>

            {/* Notifications Switch */}
            <SettingItem
                title="Notificaciones"   // ← Cambiado a texto fijo como pediste
                icon="notifications-outline"
                isSwitch={true}
                switchValue={isNotificationsEnabled}
                action={toggleNotifications}
            />

            {/* Language */}
            <SettingItem
                title={t('settings_language')}
                icon="globe-outline"
                action={() => navigation.navigate('LanguageSelection')}
            />

            {/* About Us */}
            <SettingItem
                title={t('settings_about')}
                icon="information-circle-outline"
                action={() => navigation.navigate('AboutUs')}
            />

            {/* ❌ LOGOUT REMOVIDO */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, padding: 25 },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 30,
        marginTop: 20
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    itemText: { fontSize: 18, color: COLORS.text }
});

export default SettingsScreen;
