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
};

const RegisterScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Navegación a MainTabs
    const goToMain = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
        });
    };

    // Lógica de registro
    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert(t('error'), t('register_all_fields_required'));
            return;
        }

        if (password.length < 6) {
            Alert.alert(t('error'), t('register_password_min_length'));
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert(t('error'), t('register_passwords_do_not_match'));
            return;
        }

        setLoading(true);
        try {
            // 🔥 RUTA CORRECTA
            const response = await api.post('/users/register', {
                name,
                email,
                password,
            });

            console.log("✔ Registro exitoso:", response.data);

            const token = response.data?.token;

            if (token) {
                await AsyncStorage.setItem('userToken', token);
            }

            Alert.alert(t('success'), t('register_success_message'));

            goToMain(); // navegar al home

        } catch (error) {
            console.error("❌ Error en registro:", error.response?.data || error.message);

            const message = error.response?.data?.message 
                || "Ocurrió un error inesperado en registro.";

            Alert.alert("Error", message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <Text style={styles.title}>{t('register_title')}</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('name_placeholder')}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={t('name_placeholder')}
                            placeholderTextColor={COLORS.placeholder}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('email_placeholder')}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={t('email_placeholder')}
                            placeholderTextColor={COLORS.placeholder}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('password_placeholder')}</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.inputPassword}
                                placeholder={t('password_placeholder')}
                                placeholderTextColor={COLORS.placeholder}
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons 
                                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                                    size={24} 
                                    color={COLORS.text} 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('confirm_password_placeholder')}</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.inputPassword}
                                placeholder={t('confirm_password_placeholder')}
                                placeholderTextColor={COLORS.placeholder}
                                secureTextEntry={!showConfirmPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Ionicons 
                                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                                    size={24} 
                                    color={COLORS.text} 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={[styles.button, loading && { opacity: 0.6 }]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? t('loading') : t('register_button')}
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 40,
    },
    inputGroup: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 5,
        fontWeight: '600',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: COLORS.secondary,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.secondary,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    inputPassword: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    button: {
        width: '100%',
        height: 55,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default RegisterScreen;
