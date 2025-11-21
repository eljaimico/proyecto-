// Tarea/middleware/auth.js
const jwt = require('jsonwebtoken');
const db = require('../models');

// Función que verifica el JWT en el header de la solicitud
const protect = async (req, res, next) => {
  let token;

  // 1. Verificar el formato 'Bearer <token>'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Extraer el token
      token = req.headers.authorization.split(' ')[1];

      // 3. Verificar el token y decodificar el payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Buscar el usuario por ID (excluyendo la contraseña)
      req.user = await db.User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
      });

      if (!req.user) {
        return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
      }

      next(); // Pasa al siguiente middleware/controlador
    } catch (error) {
      console.error('Error de autenticación:', error.message);
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
  }

  // 5. Si no hay token
  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no se encontró token' });
  }
};

module.exports = protect;