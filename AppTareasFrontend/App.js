// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import { useTranslation } from 'react-i18next';

import './src/i18n/i18n'; 

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen'; 
import TodoScreen from './src/screens/TodoScreen'; 
import AchievementsScreen from './src/screens/AchievementsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen'; 
import LanguageSelectionScreen from './src/screens/LanguageSelectionScreen';
import EditTaskScreen from './src/screens/EditTaskScreen';
import CompletedTasksScreen from './src/screens/CompletedTasksScreen';
import AboutUsScreen from './src/screens/AboutUsScreen'; 
import SuggestedTasksScreen from './src/screens/SuggestedTasksScreen';
import CalendarScreen from './src/screens/CalendarScreen'; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_COLORS = {
  active: '#1E4620',
  inactive: '#8D9F8E',
};

// --- 1. Navigation Stack for Tasks ---
function TodoStack() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator screenOptions={{ 
      headerStyle: { backgroundColor: '#F9FBE7' },
      headerTintColor: TAB_COLORS.active,
      headerBackTitleVisible: false,
    }}>
      <Stack.Screen name="Todo" component={TodoScreen} options={{ headerShown: false }} />
      
      {/* ❌ SE ELIMINA DE AQUÍ -> EditTaskScreen */}
      
      <Stack.Screen name="CompletedTasks" component={CompletedTasksScreen} options={{ title: 'Historial de Tareas' }} />
      <Stack.Screen name="SuggestedTasks" component={SuggestedTasksScreen} options={{ title: 'Sugerencias' }} />
    </Stack.Navigator>
  );
}

// --- 2. Profile Stack ---
function ProfileStack() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator screenOptions={{ 
      headerStyle: { backgroundColor: '#F9FBE7' },
      headerTintColor: TAB_COLORS.active,
      headerBackTitleVisible: false,
    }}>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: t('settings_title') }} />
      <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} options={{ title: t('settings_language') }} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} options={{ title: t('settings_about') }} />
    </Stack.Navigator>
  );
}

// --- 3. Tabs ---
function MainTabs() {
  const { t } = useTranslation(); 
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          color = focused ? TAB_COLORS.active : TAB_COLORS.inactive;

          if (route.name === 'TodoStack') { 
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Achievements') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'ProfileStack') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: TAB_COLORS.active,
        tabBarInactiveTintColor: TAB_COLORS.inactive,
        headerShown: false, 
      })}
    >
      <Tab.Screen name="TodoStack" component={TodoStack} options={{ title: t('tab_todo') }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: t('tab_calendar') }}/> 
      <Tab.Screen name="Achievements" component={AchievementsScreen} options={{ title: t('tab_achievements') }} />
      <Tab.Screen name="ProfileStack" component={ProfileStack} options={{ title: t('tab_profile') }} />
    </Tab.Navigator>
  );
}

// --- 4. Root Stack ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">

        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Registro de Usuario' }}
        />

        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs} 
          options={{ headerShown: false }}
        />

        {/* ✅ MOVIDO AQUÍ: YA NO ESTÁ DENTRO DE TABS */}
        <Stack.Screen 
          name="EditTask" 
          component={EditTaskScreen}
          options={{
            title: 'Editar Tarea',
            headerStyle: { backgroundColor: '#F9FBE7' },
            headerTintColor: TAB_COLORS.active,
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
