// Tarea/routes/achievementRoutes.js - CÓDIGO COMPLETO Y FINAL
const express = require('express');
const { getAchievements } = require('../controllers/achievementController');
const protect = require('../middleware/auth'); // Middleware de protección

const router = express.Router();

// Ruta principal para obtener todos los logros (bloqueados y desbloqueados)
// La ruta será /api/achievements
router.route('/')
    // Aplica el middleware 'protect' para asegurar que solo usuarios logueados accedan
    .get(protect, getAchievements);

module.exports = router;