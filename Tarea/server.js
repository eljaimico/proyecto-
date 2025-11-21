// Tarea/server.js - CÓDIGO FINAL PORTABLE
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// 1. DEFINICIÓN BASE PATH AL INICIO
global.__basedir = __dirname;

// 2. IMPORTAR DB DESPUÉS DE DEFINIR __basedir
const db = require('./models');

dotenv.config();

const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- CORS CONFIGURADO PARA EXPO EN MÓVIL Y PC ---
app.use(cors({
    origin: [
        'http://localhost:8081',      // Expo Web
        'http://192.168.1.5:8081',   // Expo corriendo en tu red WiFi
        'exp://192.168.1.5:8081'     // Expo Go en celular
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de TareasApp funcionando!');
});

// Servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Accede a http://localhost:${PORT}`);
});
