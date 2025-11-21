import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    SafeAreaView,
    Alert,
    ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosConfig';

const COLORS = {
    primary: '#1E4620',
    secondary: '#F1F8E9',
    text: '#2E7D32',
    background: '#F9FBE7',
    white: '#FFFFFF',
    placeholder: '#757575',
    google: '#DB4437',
    facebook: '#4267B2',
};

const LoginScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // -------------------------------
    // 🔥 LOGIN CORREGIDO
    // -------------------------------
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/users/login', {
                email,
                password,
            });

            console.log("✔ Login exitoso:", response.data);

            const token = response.data?.token;
            if (token) {
                await AsyncStorage.setItem('userToken', token);
            }

            navigation.replace('MainTabs');

        } catch (error) {
            console.error("❌ Error en login:", error.response?.data || error.message);

            const message = error.response?.data?.message 
                || "Credenciales incorrectas.";

            Alert.alert("Error", message);
        } finally {
            setLoading(false);
        }
    };

    const goToRegister = () => {
        navigation.navigate('Register');
    };

    const handleSocialLogin = (provider) => {
        navigation.navigate('FunctionInProgress', { provider });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    
                    <Text style={styles.title}>{t('login_title')}</Text>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('email_placeholder')}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={t('email_placeholder')}
                            placeholderTextColor={COLORS.placeholder}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!loading}
                        />
                    </View>

                    {/* Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('password_placeholder')}</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.inputPassword}
                                placeholder={t('password_placeholder')}
                                placeholderTextColor={COLORS.placeholder}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                editable={!loading}
                            />
                            <TouchableOpacity 
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons 
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                                    size={24} 
                                    color={COLORS.text} 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Botón Login */}
                    <TouchableOpacity 
                        style={[styles.button, loading && styles.buttonDisabled]} 
                        onPress={handleLogin} 
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? t('loading') : t('login_button')}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.separatorContainer}>
                        <View style={styles.separatorLine} />
                        <Text style={styles.separatorText}>{t('o') || 'o'}</Text>
                        <View style={styles.separatorLine} />
                    </View>

                    {/* GOOGLE */}
                    <TouchableOpacity 
                        style={[styles.socialButton, { backgroundColor: COLORS.google }]} 
                        onPress={() => handleSocialLogin('Google')}
                        disabled={loading}
                    >
                        <FontAwesome5 name="google" size={20} color={COLORS.white} style={styles.socialIcon} />
                        <Text style={styles.socialButtonText}>
                            {t('login_with_google') || `${t('login_with')} Google`}
                        </Text>
                    </TouchableOpacity>

                    {/* FACEBOOK */}
                    <TouchableOpacity 
                        style={[styles.socialButton, { backgroundColor: COLORS.facebook }]} 
                        onPress={() => handleSocialLogin('Facebook')}
                        disabled={loading}
                    >
                        <FontAwesome5 name="facebook" size={20} color={COLORS.white} style={styles.socialIcon} />
                        <Text style={styles.socialButtonText}>
                            {t('login_with_facebook') || `${t('login_with')} Facebook`}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={goToRegister} disabled={loading} style={styles.registerLinkContainer}>
                        <Text style={styles.registerLinkText}>
                            {t('login_no_account')}
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.background },
    scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
    container: { width: '100%', alignItems: 'center' },
    title: { fontSize: 32, fontWeight: 'bold', color: COLORS.primary, marginBottom: 40, textAlign: 'center' },
    inputGroup: { width: '100%', marginBottom: 15 },
    label: { fontSize: 14, color: COLORS.text, marginBottom: 5, fontWeight: '600' },
    input: { width: '100%', height: 50, backgroundColor: COLORS.secondary, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, color: COLORS.primary },
    passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.secondary, borderRadius: 8 },
    inputPassword: { flex: 1, height: 50, paddingHorizontal: 15, fontSize: 16, color: COLORS.primary },
    eyeIcon: { padding: 10 },

    button: {
        width: '100%',
        height: 55,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonDisabled: { opacity: 0.7 },
    buttonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },

    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 25,
        width: '100%',
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.placeholder,
    },
    separatorText: {
        marginHorizontal: 10,
        color: COLORS.placeholder,
        fontSize: 14,
    },

    socialButton: {
        flexDirection: 'row',
        width: '100%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        elevation: 3,
    },
    socialButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    socialIcon: { marginRight: 10 },
    registerLinkContainer: { marginTop: 30 },
    registerLinkText: { color: COLORS.text, fontSize: 16, fontWeight: '600' }
});

export default LoginScreen;
