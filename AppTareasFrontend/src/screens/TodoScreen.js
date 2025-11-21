import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    FlatList, 
    TouchableOpacity, 
    Alert, 
    SafeAreaView 
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
    danger: '#E53935',
    disabled: '#BDBDBD'
};

// -----------------------------------------------------
//            COMPONENTE DE ITEM DE TAREA
// -----------------------------------------------------
const TodoItem = ({ item, toggleComplete, navigation }) => {
    const { t } = useTranslation();

    return (
        <View 
            style={[
                styles.taskItem,
                item.completed && styles.taskCompletedContainer
            ]}
        >
            {/* Texto y navegación al editor */}
            <TouchableOpacity 
                style={styles.taskTextContainer}
                onPress={() => {
                    navigation.navigate('EditTask', { taskId: item.id, taskTitle: item.title });
                }}
            >
                <Text 
                    style={[
                        styles.taskTitle,
                        item.completed && styles.taskCompletedText
                    ]}
                >
                    {item.title}
                </Text>

                {item.dueDate && (
                    <Text 
                        style={[
                            styles.taskSubtitle,
                            item.completed && styles.taskCompletedText
                        ]}
                    >
                        {t('todo_due_date')}: {new Date(item.dueDate).toLocaleDateString()}
                    </Text>
                )}
            </TouchableOpacity>

            {/* Botón completar */}
            <TouchableOpacity 
                onPress={() => toggleComplete(item.id)} 
                style={styles.actionButton}
            >
                <Ionicons
                    name={ item.completed ? 'checkmark-circle' : 'ellipse-outline' }
                    size={28}
                    color={ item.completed ? '#4CAF50' : COLORS.text }
                />
            </TouchableOpacity>
        </View>
    );
};

// -----------------------------------------------------
//                  PANTALLA PRINCIPAL
// -----------------------------------------------------
const TodoScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [loading, setLoading] = useState(false);

    // ------------------ FETCH TASKS ------------------
    const fetchTasks = async () => {
        setLoading(true);

        try {
            const token = await AsyncStorage.getItem('userToken');

            if (token) {
                const response = await api.get('/tasks', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setTasks(response.data);
            } else {
                Alert.alert(t('error'), t('auth_token_missing'));
                navigation.replace('Login'); 
            }
        } catch (error) {
            Alert.alert(t('error'), t('todo_fetch_error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
        const unsubscribe = navigation.addListener('focus', fetchTasks);
        return unsubscribe;
    }, [navigation]);

    // ------------------ ADD TASK ------------------
    const addTask = async () => {
        if (!newTask.trim()) {
            Alert.alert(t('error'), t('todo_empty_task'));
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');

            if (token) {
                const response = await api.post('/tasks', 
                    { title: newTask },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setTasks(prev => [...prev, response.data]);
                setNewTask('');
            }
        } catch (error) {
            Alert.alert(t('error'), t('todo_add_error'));
        } finally {
            setLoading(false);
        }
    };

    // ------------------ COMPLETE TASK ------------------
    const toggleComplete = async (id) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const updatedTasks = tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        setTasks(updatedTasks);

        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                await api.put(`/tasks/${id}`, 
                    { completed: !task.completed },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
        } catch (error) {
            Alert.alert(t('error'), t('todo_update_error'));
            fetchTasks();
        }
    };

    // ------------------ RENDER ------------------
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                
                <Text style={styles.headerTitle}>{t('tab_todo')}</Text>

                <Text style={styles.taskCount}>
                    {t('todo_tasks_pending')}: {tasks.filter(t => !t.completed).length}
                </Text>

                {/* Input nueva tarea */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={t('todo_new_task_placeholder')}
                        placeholderTextColor={COLORS.text}
                        value={newTask}
                        onChangeText={setNewTask}
                        onSubmitEditing={addTask}
                        editable={!loading}
                    />
                    <TouchableOpacity onPress={addTask} style={styles.addButton} disabled={loading}>
                        <Ionicons name="add-circle" size={40} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>

                {/* Lista */}
                <FlatList
                    data={tasks}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <TodoItem
                            item={item}
                            toggleComplete={toggleComplete}
                            navigation={navigation}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <Text style={styles.emptyText}>{t('todo_no_tasks')}</Text>
                    )}
                    refreshing={loading}
                    onRefresh={fetchTasks}
                />
            </View>
        </SafeAreaView>
    );
};

// -----------------------------------------------------
//                 ESTILOS COMPLETOS
// -----------------------------------------------------
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.background },
    container: { flex: 1, padding: 20 },
    headerTitle: { fontSize: 32, fontWeight: 'bold', color: COLORS.primary },
    taskCount: { fontSize: 16, color: COLORS.text, marginBottom: 20 },

    inputContainer: { 
        flexDirection: 'row', 
        backgroundColor: COLORS.secondary, 
        borderRadius: 12, 
        paddingHorizontal: 10, 
        marginBottom: 20,
        alignItems: 'center'
    },
    input: { flex: 1, height: 50, fontSize: 16, color: COLORS.text },
    addButton: { padding: 5 },

    taskItem: { 
        flexDirection: 'row', 
        backgroundColor: 'white', 
        padding: 15, 
        borderRadius: 12, 
        marginBottom: 10, 
        alignItems: 'center', 
        elevation: 3 
    },

    taskCompletedContainer: {
        backgroundColor: '#E8F5E9', 
        opacity: 0.9
    },
    taskCompletedText: {
        textDecorationLine: 'line-through',
        color: '#6FBF73'
    },

    taskTextContainer: { flex: 1 },
    taskTitle: { fontSize: 17, color: COLORS.primary },
    taskSubtitle: { fontSize: 12, color: COLORS.text, marginTop: 2 },

    actionButton: { marginLeft: 10 },

    emptyText: { textAlign: 'center', marginTop: 50, opacity: 0.7 }
});

export default TodoScreen;
