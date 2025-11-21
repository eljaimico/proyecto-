// Tarea/controllers/userController.js - CÓDIGO ACTUALIZADO Y FINAL
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', 
  });
};

// POST /api/users/register
// NOTA: Renombrado a 'register' (ajusta tu userRoutes.js si usaba 'registerUser')
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Por favor, introduce todos los campos' });
  }

  try {
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: 'El usuario con ese correo ya existe' });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el usuario
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      streak: 0, // Asegurar inicialización
      lastActive: null, // Asegurar inicialización
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id), 
        streak: user.streak || 0,
        lastActive: user.lastActive || null, // <-- Aseguramos que se envía
      });
    } else {
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor al registrar usuario' });
  }
};

// POST /api/users/login
// NOTA: Renombrado a 'login' (ajusta tu userRoutes.js si usaba 'loginUser')
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    // Verificar usuario y contraseña
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
        streak: user.streak || 0,
        lastActive: user.lastActive || null, // <-- Aseguramos que se envía
      });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor al iniciar sesión' });
  }
};

// GET /api/users/profile (Protegida)
exports.getProfile = async (req, res) => {
  // El middleware 'auth.js' ya pobló req.user con los datos del usuario.
  if (req.user) {
    const profileData = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      streak: req.user.streak || 0, // Asegurar valor por defecto
      lastActive: req.user.lastActive || null, // Asegurar valor por defecto
    };
    res.json(profileData);
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
};