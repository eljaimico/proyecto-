import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
// Importamos useTranslation para manejar textos localizados (i18n)
import { useTranslation } from 'react-i18next';

// Colores definidos según el tema verde/claro utilizado en App.js
const COLORS = {
    primary: '#1E4620', // Verde Oscuro (para títulos y botones)
    background: '#F9FBE7', // Fondo Claro de la pantalla
    white: '#FFFFFF', // Para texto de botón
    text: '#2E7D32', // Verde medio para texto secundario
    accent: '#8BC34A', // Color de acento
};

/**
 * MainScreen: La pantalla principal de la aplicación que se muestra tras la autenticación.
 * Recibe 'onLogout' y el objeto 'user' como props desde App.js.
 *
 * @param {object} props - Propiedades del componente.
 * @param {function} props.onLogout - Función para cerrar la sesión (llama al handler en App.js).
 * @param {object} props.user - Objeto del usuario autenticado (con la propiedad 'uid').
 */
const MainScreen = ({ onLogout, user }) => {
    // Hook para la traducción
    const { t } = useTranslation();
    
    // Función que se ejecuta al presionar el botón de cerrar sesión
    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        }
    };

    // Mensaje de bienvenida y confirmación de login
    const welcomeMessage = user?.uid ? `Bienvenido, Usuario ${user.uid.substring(0, 8)}...` : 'Bienvenido';

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('app_name') || 'Mi Aplicación'}</Text>
                {user && (
                    <Text style={styles.headerSubtitle}>
                        {welcomeMessage}
                    </Text>
                )}
            </View>
            
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>{t('dashboard_title') || 'Panel Principal'}</Text>
                    <Text style={styles.subtitle}>
                        {t('main_content_description') || 'Aquí integrarás tus pestañas y la navegación real de la aplicación.'}
                    </Text>
                    
                    {/* Placeholder para la navegación de pestañas (MainTabs) */}
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>
                            [Placeholder para MainTabs]
                        </Text>
                        <Text style={styles.placeholderTextSmall}>
                            La navegación de pestañas se implementará aquí.
                        </Text>
                    </View>
                </View>

                {/* Botón de Cerrar Sesión con buen estilo */}
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleLogout} 
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>
                        {t('logout_button') || 'Cerrar Sesión'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: COLORS.background 
    },
    header: {
        padding: 20,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: COLORS.white,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.accent,
        marginTop: 5,
    },
    container: { 
        flex: 1, 
        padding: 20,
        alignItems: 'center',
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: COLORS.white,
        borderRadius: 15,
        padding: 25,
        marginTop: 30,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: COLORS.primary, 
        marginBottom: 15 
    },
    subtitle: { 
        fontSize: 16, 
        color: COLORS.text, 
        marginBottom: 20, 
        textAlign: 'center' 
    },
    placeholder: {
        borderWidth: 2,
        borderColor: COLORS.accent,
        borderStyle: 'dashed',
        padding: 20,
        borderRadius: 10,
        marginTop: 20,
        backgroundColor: COLORS.background,
        width: '100%',
    },
    placeholderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.accent,
        textAlign: 'center',
    },
    placeholderTextSmall: {
        fontSize: 12,
        color: COLORS.text,
        textAlign: 'center',
        marginTop: 5,
    },
    button: {
        width: 250,
        height: 50,
        backgroundColor: '#D32F2F', // Rojo para el logout (acción destructiva)
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        // Sombra más fuerte
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 5,
        elevation: 6,
    },
    buttonText: { 
        color: COLORS.white, 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
});

export default MainScreen;