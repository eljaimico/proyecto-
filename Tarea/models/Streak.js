// Tarea/models/Streak.js - CÓDIGO ACTUALIZADO Y FINAL
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Streak = sequelize.define('Streak', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    daysConsecutive: { 
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    // CAMPO AÑADIDO: Necesario para mostrar la racha histórica más larga en el frontend (maxStreak)
    maxDaysConsecutive: { 
       type: DataTypes.INTEGER,
       defaultValue: 0,
       allowNull: false,
    },
    startDate: { 
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    lastActivityDate: { 
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  }, {
    timestamps: true,
    tableName: 'Racha',
  });

  // Asociación: Una Racha pertenece a un Usuario (One-to-One, Foreign Key userId)
  Streak.belongsTo(sequelize.models.User, {
    foreignKey: 'userId',
    unique: true, // Asegura que solo hay un registro de racha por usuario
  });

  return Streak;
};