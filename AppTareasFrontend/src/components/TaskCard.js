// src/components/TaskCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = { text: '#2E7D32', primary: '#1E4620', secondary: '#F1F8E9' };

const TaskCard = ({ task, onToggleCompleted, onEdit, isCompletedView }) => {
    // Determinar ícono y estilo basado en si está completada
    const iconName = task.completed ? 'checkmark-circle' : 'ellipse-outline';
    const textStyle = task.completed ? styles.completedText : styles.taskTitle;
    const cardStyle = task.completed ? styles.completedCard : styles.taskCard;

    return (
        <View style={cardStyle}>
            {/* Checkbox para Completar/Incompletar */}
            <TouchableOpacity 
                onPress={() => onToggleCompleted(task.id, !task.completed)} 
                style={styles.checkbox}
                disabled={isCompletedView} // No se puede cambiar el estado desde la vista de completadas
            >
                <Ionicons 
                    name={iconName} 
                    size={28} 
                    color={task.completed ? COLORS.primary : COLORS.text} 
                />
            </TouchableOpacity>

            {/* Detalles de la Tarea */}
            <View style={styles.taskDetails}>
                <Text style={textStyle}>{task.title}</Text>
                {task.description && <Text style={styles.taskDescription}>{task.description}</Text>}
                {task.dueDate && <Text style={styles.taskDue}>Vence: {new Date(task.dueDate).toLocaleDateString()}</Text>}
            </View>

            {/* Botón de Edición (No disponible en la vista de completadas) */}
            {!isCompletedView && (
                <TouchableOpacity onPress={() => onEdit(task.id)} style={styles.editButton}>
                    <Ionicons name="create-outline" size={24} color={COLORS.text} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    taskCard: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: COLORS.secondary, 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 10,
    },
    completedCard: {
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#E8F5E9', // Un poco más claro
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 10,
        opacity: 0.8,
    },
    checkbox: { 
        paddingRight: 15 
    },
    taskDetails: { 
        flex: 1 
    },
    taskTitle: { 
        fontSize: 18, 
        color: COLORS.text,
        fontWeight: 'bold', 
    },
    completedText: {
        fontSize: 18, 
        color: COLORS.text,
        fontWeight: 'bold', 
        textDecorationLine: 'line-through', // Tarea completada tachada
        opacity: 0.6,
    },
    taskDescription: { 
        fontSize: 14, 
        color: COLORS.text, 
        opacity: 0.7 
    },
    taskDue: {
        fontSize: 12, 
        color: COLORS.primary,
        marginTop: 5,
    },
    editButton: {
        paddingLeft: 10,
    }
});

export default TaskCard;