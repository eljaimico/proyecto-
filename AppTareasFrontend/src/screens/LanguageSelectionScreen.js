// src/screens/LanguageSelectionScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n';
import { Ionicons } from '@expo/vector-icons';

const COLORS = { text: '#2E7D32', primary: '#1E4620', background: '#F9FBE7' };

const LanguageSelectionScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const currentLanguage = i18n.language;

    // Función principal para cambiar el idioma
    const changeAppLanguage = async (lng) => {
        try {
            await i18n.changeLanguage(lng);
            
            // Recargar la aplicación para que las pestañas se actualicen inmediatamente (opcional pero recomendado)
            // navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] }); 
            
            Alert.alert(
                t('app_name'), 
                t('language_changed', { lng: lng.toUpperCase() }) // Mensaje de confirmación traducido
            );
            
            navigation.goBack(); 
        } catch (error) {
            Alert.alert(t('error'), "No se pudo cambiar el idioma.");
        }
    };
    
    const languages = [
        { code: 'es', name: 'Español (ES)', icon: 'globe' },
        { code: 'en', name: 'English (EN)', icon: 'globe' },
        { code: 'fr', name: 'Français (FR)', icon: 'globe' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('settings_language')}</Text> {/* Usar traducción */}

            {languages.map((lang) => (
                <TouchableOpacity
                    key={lang.code}
                    style={styles.languageItem}
                    onPress={() => changeAppLanguage(lang.code)}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name={lang.icon} size={24} color={COLORS.primary} style={{ marginRight: 15 }} />
                        <Text style={styles.languageText}>{lang.name}</Text>
                    </View>
                    {currentLanguage === lang.code && (
                        <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, padding: 25 },
    title: { fontSize: 40, fontWeight: 'bold', color: COLORS.text, marginBottom: 30, marginTop: 20 },
    languageItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    languageText: { fontSize: 18, color: COLORS.text },
});

export default LanguageSelectionScreen;