// src/screens/AboutUsScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AboutUsScreen = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Sobre Nosotros</Text>

            <Text style={styles.sectionTitle}>¿Qué es TareasApp?</Text>
            <Text style={styles.paragraph}>
                TareasApp es una aplicación diseñada para ayudarte a organizar tus actividades diarias y crear hábitos saludables de forma sencilla y motivadora. A diferencia de otras apps de tareas, TareasApp combina la gestión de actividades con un sistema de logros y rachas que te impulsa a mantener la constancia, parecido al estilo de Duolingo.
            </Text>

            <Text style={styles.sectionTitle}>¿Qué problema busca resolver?</Text>
            <Text style={styles.paragraph}>
                Muchas personas tienen dificultades para organizar su día a día, recordar sus pendientes y mantener buenos hábitos. TareasApp nace como una solución que mezcla productividad y motivación, ayudándote a llevar un estilo de vida más ordenado y equilibrado.
            </Text>

            <Text style={styles.sectionTitle}>¿Para quién está hecha la app?</Text>
            <Text style={styles.paragraph}>
                La aplicación está pensada para:
                {'\n'}• Estudiantes
                {'\n'}• Trabajadores
                {'\n'}• Personas que buscan mejorar sus hábitos
                {'\n'}• Usuarios que desean llevar un registro claro de sus tareas y progreso
                {'\n'}En general, TareasApp es ideal para cualquiera que quiera organizar mejor su tiempo y mantenerse motivado.
            </Text>

            <Text style={styles.sectionTitle}>¿Qué puedes hacer con TareasApp?</Text>
            <Text style={styles.paragraph}>
                Estas son las funciones principales:
                {'\n'}• Crear, editar y eliminar tus tareas diarias.
                {'\n'}• Asignar horarios a cada actividad.
                {'\n'}• Clasificar tareas usando etiquetas.
                {'\n'}• Configurar descansos y días libres.
                {'\n'}• Recibir recordatorios mediante notificaciones.
                {'\n'}• Consultar tus logros y rachas al cumplir tareas.
                {'\n'}• Ver estadísticas que muestran tu progreso.
                {'\n'}• Acceder a un historial de tareas completadas.
                {'\n'}• Recibir sugerencias de tareas saludables.
            </Text>

            <Text style={styles.sectionTitle}>¿Qué está en desarrollo? </Text>
            <Text style={styles.paragraph}>
                Estas funciones están en progreso y estarán disponibles pronto:
                {'\n'}• Sistema completo de logros.
                {'\n'}• Rachas diarias y semanales.
                {'\n'}• Notificaciones avanzadas.
                {'\n'}• Calendario interactivo.
                {'\n'}• Tareas repetitivas automáticas.
                {'\n'}• Obtener sugerencias de tareas saludables.
                {'\n'}• Recibir recordatorios mediante notificaciones.
                {'\n'}• Configurar descansos y días libres.
                {'\n'}• Funcionalidad completa con los idiomas ingles y frances.
            </Text>

            <Text style={styles.sectionTitle}>Alcance del Proyecto</Text>
            <Text style={styles.paragraph}>
                TareasApp se está construyendo como una app híbrida con tecnologías modernas como React Native, permitiendo que funcione tanto en Android como en iOS. El sistema almacenará tus datos de forma local y también podrá usar la nube en futuras versiones.
            </Text>

            <Text style={styles.sectionTitle}>Requerimientos que buscamos cumplir</Text>
            <Text style={styles.paragraph}>
                Funcionales:
                {'\n'}• Registro y sesión de usuario.
                {'\n'}• Gestión completa de tareas.
                {'\n'}• Notificaciones de recordatorio.
                {'\n'}• Logros, rachas y estadísticas.
                {'\n'}• Historial de tareas.
                {'\n'}\nNo funcionales:
                {'\n'}• Cargar rápido (menos de 3 segundos).
                {'\n'}• Datos seguros y encriptados.
                {'\n'}• Interfaz simple, limpia e intuitiva.
                {'\n'}• Compatible con Android e iOS.
                {'\n'}• Lista para crecer con nuevas funciones.
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 22,
    },
});

export default AboutUsScreen;