// src/api/axiosConfig.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// *** IMPORTANTE ***
// Usa SIEMPRE la IP LOCAL de tu PC (ya verificada en tu captura)
const API_URL = 'http://192.168.1.5:3000';

// Crear instancia principal
const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 8000, // Evita apps colgadas si el backend no responde
});

// --- INTERCEPTOR PARA AGREGAR TOKEN JWT ---
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- INTERCEPTOR DE RESPUESTA PARA ERRORES DE RED ---
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.message === 'Network Error') {
            console.log('❌ No hay conexión con el backend');
        }
        return Promise.reject(error);
    }
);

export default api;
