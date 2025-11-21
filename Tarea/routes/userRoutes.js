// Tarea/routes/userRoutes.js - CÓDIGO ACTUALIZADO Y FINAL
const express = require('express');
const { 
    register,
    login,
    getProfile 
} = require('../controllers/userController');
const protect = require('../middleware/auth');

const router = express.Router();

// Ruta de prueba (NO requiere token)
router.get('/', (req, res) => {
    res.json({ message: "Conexión con /api/users exitosa!" });
});

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Ruta privada (requiere token JWT)
router.get('/profile', protect, getProfile);

module.exports = router;
