// Tarea/models/index.js - CÓDIGO FINAL PORTABLE
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path'); 

dotenv.config();

// Inicializar Sequelize y conectar a SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  // Ruta absoluta y portable para database.sqlite
  storage: path.join(__basedir, 'database.sqlite'), 
  logging: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar modelos
db.User = require('./User')(sequelize, Sequelize);
db.Task = require('./Task')(sequelize, Sequelize);
db.Achievement = require('./Achievement')(sequelize, Sequelize); 
db.Streak = require('./Streak')(sequelize, Sequelize);           

// Definir Relaciones
db.User.hasMany(db.Task, { foreignKey: 'userId', as: 'tasks' });
db.Task.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

// Relación 1:1 Usuario-Racha
db.User.hasOne(db.Streak, { foreignKey: 'userId', as: 'streakInfo' });
db.Streak.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

// Relación N:M Usuario-Logro (Resuelve el error de colisión)
db.User.belongsToMany(db.Achievement, {
  through: 'Usuario_Logro', 
  as: 'achievements', // Alias para acceder a los logros del usuario
  foreignKey: 'userId',
});

db.Achievement.belongsToMany(db.User, {
  through: 'Usuario_Logro',
  as: 'users',
  foreignKey: 'logroId',
});

// Sincronizar la base de datos
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de datos sincronizada.');
    return require('./seedAchievements')(db);
  })
  .catch((err) => {
    console.error('Error al sincronizar la base de datos:', err);
  });

module.exports = db;