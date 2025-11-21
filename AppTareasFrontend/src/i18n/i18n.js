// src/i18n/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resources } from './resources';

// Módulo para detectar y guardar el idioma del usuario
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    // 1. Intentar obtener el idioma guardado
    const savedLanguage = await AsyncStorage.getItem('user-language');
    // 2. Usar 'es' (Español) como idioma por defecto si no hay nada guardado
    callback(savedLanguage || 'es'); 
  },
  init: () => {},
  cacheUserLanguage: async (lng) => {
    // 3. Función para guardar la nueva selección de idioma
    await AsyncStorage.setItem('user-language', lng);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es', // Idioma de respaldo
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    // Namespace por defecto
    defaultNS: 'translation', 
  });

export default i18n;