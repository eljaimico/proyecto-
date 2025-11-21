// Tarea/routes/taskRoutes.js - CÓDIGO COMPLETO FINAL
const express = require('express');
const { 
    getTasks, 
    createTask, 
    updateTask, 
    deleteTask, 
    getTaskById 
} = require('../controllers/taskController'); // <-- Todas estas funciones deben existir
const protect = require('../middleware/auth'); 
const { getStreak } = require('../controllers/streakController'); // <-- Endpoint de racha

const router = express.Router();

// 1. Rutas para la lista de tareas y la creación (requieren token)
router.route('/')
    .get(protect, getTasks)
    .post(protect, createTask);

// 2. Rutas para operaciones específicas por ID (requieren token)
router.route('/:id')
    .get(protect, getTaskById) // <-- Esta línea o una cercana (Línea 24) falló por función Undefined
    .put(protect, updateTask)
    .delete(protect, deleteTask);

// 3. Rutas de Información de Racha (requieren token)
// Este endpoint es llamado por el frontend para obtener la racha
router.route('/streak')
    .get(protect, getStreak);


module.exports = router;